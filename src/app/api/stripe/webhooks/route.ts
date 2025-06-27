import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get('stripe-signature');

  // Check if signature exists
  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature, // Now TypeScript knows this is not null
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
}
  
  // Use direct Supabase client with service role key to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS
  );
  
  try {
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;
      const customerId = subscription.customer as string;
      const subscriptionId = subscription.id;
      
      // Get the subscription interval (monthly/yearly) from the first item
      // We need to expand the subscription to get items, or fetch it separately
      let subscriptionInterval = 'month'; // default
      
      try {
        // Fetch the full subscription with items expanded
        const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price']
        });
        subscriptionInterval = fullSubscription.items.data[0]?.price?.recurring?.interval || 'month';
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        // Continue with default interval
      }
      
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user role:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch user role' }, { status: 500 });
      }

      if (existingUser) {
        // Update existing user record
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({
            role: 'pro',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: subscription.status,
            subscription_duration: subscriptionInterval,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating user role:', updateError);
          return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
        }
      } else {
        // Create new user record
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'pro', 
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: subscription.status,
            subscription_duration: subscriptionInterval,
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Error creating user role:', insertError);
          return NextResponse.json({ error: 'Failed to create user role' }, { status: 500 });
        }
      }
    }
    
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;
      const customerId = subscription.customer as string;
      
      // Find user by customer ID
      const { data: userData, error: findError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single();
      
      if (findError || !userData) {
        console.error('Error finding user by customer ID:', findError);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      // Get subscription interval if the subscription is updated (not deleted)
      let subscriptionInterval = null;
      if (event.type === 'customer.subscription.updated') {
        try {
          const fullSubscription = await stripe.subscriptions.retrieve(subscription.id, {
            expand: ['items.data.price']
          });
          subscriptionInterval = fullSubscription.items.data[0]?.price?.recurring?.interval || 'month';
        } catch (error) {
          console.error('Error fetching subscription details:', error);
        }
      }
      
      // Prepare update data
      const updateData: {
        subscription_status: string;
        role: 'pro' | 'basic';
        updated_at: string;
        stripe_subscription_id?: string | null;
        subscription_duration?: string | null;
      } = {
        subscription_status: status,
        role: status === 'active' ? 'pro' : 'basic',
        updated_at: new Date().toISOString()
      };

      // Only clear subscription ID if subscription is actually deleted, not just canceled
      if (event.type === 'customer.subscription.deleted') {
        updateData.stripe_subscription_id = null;
        updateData.subscription_duration = null;
      } else if (event.type === 'customer.subscription.updated') {
        updateData.stripe_subscription_id = subscription.id;
        if (subscriptionInterval) {
          updateData.subscription_duration = subscriptionInterval;
        }
      }
      
      // Update subscription status (preserving stripe_customer_id)
      const { error: updateError } = await supabase
        .from('user_roles')
        .update(updateData)
        .eq('user_id', userData.user_id);
      
      if (updateError) {
        console.error('Error updating subscription status:', updateError);
        return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
      }
    }

    if (event.type === 'customer.deleted') {
      const customer = event.data.object as { id: string }; // Stripe customer object
      const customerId = customer.id;
      
      console.log('Customer deleted in Stripe:', customerId);
      
      // Find user by customer ID and clear the stripe_customer_id
      const { data: userData, error: findError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single();
      
      if (findError) {
        console.error('Error finding user by deleted customer ID:', findError);
        // Don't fail the webhook for this - customer might not exist in our DB
        return NextResponse.json({ received: true });
      }
      
      if (userData) {
        // Clear the customer ID and reset to basic plan
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({
            stripe_customer_id: null,
            stripe_subscription_id: null,
            subscription_status: 'canceled',
            subscription_duration: null,
            role: 'basic',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userData.user_id);
        
        if (updateError) {
          console.error('Error clearing customer data after deletion:', updateError);
          return NextResponse.json({ error: 'Failed to update user after customer deletion' }, { status: 500 });
        }
        
        console.log('Successfully cleared customer data for user:', userData.user_id);
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';