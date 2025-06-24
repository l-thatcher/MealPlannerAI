import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get the authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Update user subscription status in your database using the authenticated user ID
    const userId = user.id;

    // Check if user exists and update their subscription status
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!fetchError && existingUser) {
      // Only update if the subscription isn't already marked as active
      if (existingUser.subscription_status !== 'active') {
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({
            role: 'pro',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating user subscription:', updateError);
          // Don't fail the request, as the webhook will handle this
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
      }
    });

  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json({ 
      error: 'Failed to verify subscription' 
    }, { status: 500 });
  }
}