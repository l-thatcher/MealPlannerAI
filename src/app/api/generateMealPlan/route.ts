import { NoObjectGeneratedError } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';
import { mealPlanSchema } from './use-object/mealPlanSchema';
import { streamObject } from 'ai';
import { getUserPrompt, getSystemPrompt } from './prompts';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';

const apiKey = process.env.OPENAI_API_KEY;

// export const maxDuration = 60;
export const preferredRegion = 'auto';

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = createOpenAI({
  apiKey,
  compatibility: 'strict',
});

export async function POST(req: Request) {
  let user: User | null = null;
  
  try {
    console.log('Received request to generate meal plan');

    const body = await req.json();
    const formData = body;
    
    // Get the user from Supabase auth instead of form data
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    user = authUser; // Store user in the outer scope


    let dailyLimit = 8000; // Adjust based on your limits
    let userRole = 'basic'; // Default role
    
    console.log("Auth response:", { user: !!user, error: authError });
    
    
    if (!user || authError) {
      console.error("Authentication error:", authError);
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Only check tokens for authenticated users
    if (user) {
      const { data: userRoles, error: userRoleError } = await supabase
       .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (userRoleError && userRoleError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error checking user roles:", userRoleError);
        return NextResponse.json({ error: "Error checking user tokens" }, { status: 500 });
      }

      userRole = userRoles.role;

      switch (userRole) {
        // case 'admin':
        //   dailyLimit = 500; // Higher limit for admin users
        //   break;
        case 'pro':
          dailyLimit = 16000; // Higher limit for pro users
          break;
        case 'basic':
        default:
          dailyLimit = 8000; // Default limit for basic users
          break;
      }

      console.log(`User role: ${userRole}, daily token limit: ${dailyLimit}`);

      // Use direct database access instead of an API call
      const { data: userTokens, error: tokenError } = await supabase
        .from('token_usage')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (tokenError && tokenError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error checking user tokens:", tokenError);
        return NextResponse.json({ error: "Error checking user tokens" }, { status: 500 });
      }
      
      const now = new Date();
      
      // If no token record exists, create one
      if (!userTokens) {
        const { error: insertError } = await supabase
          .from('token_usage')
          .insert([{ 
            user_id: user.id, 
            used_tokens: 0, 
            cap_reached_at: null,
            daily_period_start: now.toISOString()
          }]);
          
        if (insertError) {
          console.error("Error creating token record:", insertError);
          return NextResponse.json({ error: "Error updating tokens" }, { status: 500 });
        }
      } else {
        const dailyPeriodStart = userTokens.daily_period_start ? new Date(userTokens.daily_period_start) : null;
        const capReachedAt = userTokens.cap_reached_at ? new Date(userTokens.cap_reached_at) : null;
        
        // Check if 24 hours have passed since the daily period started
        const shouldResetPeriod = !dailyPeriodStart || (now.getTime() - dailyPeriodStart.getTime()) >= (24 * 60 * 60 * 1000);
        
        if (shouldResetPeriod) {
          // Reset the daily period
          const { error: updateError } = await supabase
            .from('token_usage')
            .update({ 
              used_tokens: 0,
              cap_reached_at: null,
              daily_period_start: now.toISOString()
            })
            .eq('user_id', user.id);
            
          if (updateError) {
            console.error("Error resetting daily period:", updateError);
            return NextResponse.json({ error: "Error resetting tokens" }, { status: 500 });
          }
        } else if (capReachedAt && userRole !== 'admin') {
          // User hit cap and period hasn't reset yet
          const periodEndTime = new Date(dailyPeriodStart!.getTime() + 24 * 60 * 60 * 1000);
          return NextResponse.json({
            allowed: false,
            reason: `Token limit reached. Your daily limit resets at ${periodEndTime.toLocaleString()}.`
          }, { status: 429 });
        }
      }
    }

    console.log(getUserPrompt(formData));
    console.log("Using model:", formData.selectedModel);

    const result = streamObject({
      model: openai(formData.selectedModel),
      temperature: 1.3,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(formData)
        },
        {
          role: 'user',
          content: getUserPrompt(formData)
        }
      ],
      schema: mealPlanSchema(formData),    
      onFinish: async ({ usage }) => {
        const { promptTokens, completionTokens, totalTokens } = usage;
        console.log('Prompt tokens:', promptTokens);
        console.log('Completion tokens:', completionTokens);
        console.log('Total tokens:', totalTokens);
        
        // Only update tokens for authenticated users
        if (user) {
          const supabase = await createClient();
          
          // Get current token usage
          const { data: userTokens, error: tokenError } = await supabase
            .from('token_usage')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (tokenError && tokenError.code !== 'PGRST116') {
            console.error("Error checking user tokens for update:", tokenError);
            return;
          }
          
          if (userTokens) {
            const newTotal = userTokens.used_tokens + totalTokens;
            const updateData: {
              used_tokens: number;
              last_generation: string;
              cap_reached_at?: string;
            } = {
              used_tokens: newTotal,
              last_generation: new Date().toISOString()
            };
            
            // Only set cap_reached_at if they hit the limit and aren't admin
            if (newTotal >= dailyLimit && userRole !== "admin") {
              updateData.cap_reached_at = new Date().toISOString();
            }
            
            const { error: updateError } = await supabase
              .from('token_usage')
              .update(updateData)
              .eq('user_id', user.id);
              
            if (updateError) {
              console.error("Error updating tokens after completion:", updateError);
            } else {
              console.log("Updated token usage successfully. New total:", newTotal);
            }
          }
        }
      },
    });

    console.log('Stream object created successfully');
    return result.toTextStreamResponse();

  } catch (error: unknown) {
    // Type guard for Error objects
    if (error instanceof Error) {
      console.error('Stream generation error:', {
        error: error.message,
        cause: error.cause,
        stack: error.stack
      });
    } else {
      console.error('Unknown error:', error);
    }

    if (NoObjectGeneratedError.isInstance(error)) {
      console.log('NoObjectGeneratedError occurred');
      const noObjectError = error as NoObjectGeneratedError;
      
      // Extract a more user-friendly error message
      let userMessage = 'Failed to generate a valid meal plan. Please try again.';
  
      // Try to get a more specific error if available
      if (noObjectError.text) {
        const textContent = String(noObjectError.text);
        if (textContent.includes("token limit")) {
          userMessage = "Your plan is too large for the selected model. Try reducing the number of days or meals.";
        } else if (textContent.includes("dietary restrictions")) {
          userMessage = "Cannot create a plan with these dietary restrictions. Try simplifying your requirements.";
        }
      }
      return NextResponse.json({success: false, error: userMessage}, { status: 422 });
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating meal plan:', errorMessage);
      
      return NextResponse.json(
        { success: false, error: 'Failed to generate meal plan. Please try different settings.' },
        { status: 500 }
      );
    }
  }
}