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
  const dailyLimit = 8000; // Adjust based on your limits
  let user: User | null = null;
  let requiresAuth = false;
  
  try {
    console.log('Received request to generate meal plan');

    const body = await req.json();
    const formData = body;
    
    // Get the user from Supabase auth instead of form data
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    user = authUser; // Store user in the outer scope
    
    console.log("Auth response:", { user: !!user, error: authError });
    
    // If authentication is required for this endpoint
    requiresAuth = !formData.guestMode;
    
    if (requiresAuth && (!user || authError)) {
      console.error("Authentication error:", authError);
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Only check tokens for authenticated users
    if (user) {
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
      
      // If no token record exists, create one
      if (!userTokens) {
        const { error: insertError } = await supabase
          .from('token_usage')
          .insert([{ user_id: user.id, used_tokens: 0, cap_reached_at: null }]);
          
        if (insertError) {
          console.error("Error creating token record:", insertError);
          return NextResponse.json({ error: "Error updating tokens" }, { status: 500 });
        }
      } else {
        // Check if user has reached token cap
        const now = new Date();
        const capReachedAt = userTokens.cap_reached_at ? new Date(userTokens.cap_reached_at) : null;
        const resetTime = capReachedAt ? new Date(capReachedAt.getTime() + 24 * 60 * 60 * 1000) : null;

        if (capReachedAt && resetTime && now < resetTime) {
          return NextResponse.json({
            allowed: false,
            reason: `Token limit reached. Try again after ${resetTime.toLocaleString()}.`
          }, { status: 429 });
        }

        // Reset if cap has been reached and reset time has passed
        if (capReachedAt && resetTime && now >= resetTime) {
          const { error: updateError } = await supabase
          .from('token_usage')
          .update({ 
            used_tokens: 0,
            cap_reached_at: null
          })
          .eq('user_id', user.id);
          if (updateError) {
            console.error("Error resetting tokens:", updateError);
            return NextResponse.json({ error: "Error resetting tokens" }, { status: 500 });
          }
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
        if (user && !formData.guestMode) {
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
            const { error: updateError } = await supabase
              .from('token_usage')
              .update({ 
                used_tokens: newTotal,
                cap_reached_at: newTotal >= dailyLimit ? new Date().toISOString() : userTokens.cap_reached_at
              })
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
      console.log('"""""""""""""""" NoObjectGeneratedError """"""""""""""""');
      console.log('Cause:', (error as NoObjectGeneratedError).cause);
      console.log('Text:', JSON.stringify((error as NoObjectGeneratedError).text, null, 2));
      console.log('Response:', (error as NoObjectGeneratedError).response);
      console.log('Usage:', (error as NoObjectGeneratedError).usage);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to generate a valid meal plan. Please try again.'
      }, { status: 422 });
    } else {
      console.error('Error generating meal plan:', 
        error instanceof Error ? error.message : 'Unknown error');
    }
    return NextResponse.json(
      { success: false, error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}