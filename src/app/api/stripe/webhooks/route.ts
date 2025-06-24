import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { StripeSubscription } from "@/types/interfaces";

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
      const subscription = event.data.object as StripeSubscription;
      const userId = subscription.metadata.userId;
      const customerId = subscription.customer;
      const subscriptionId = subscription.id;
      
      // Update user role in database
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'pro', 
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
      }
    }
    
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as StripeSubscription;
      const status = subscription.status;
      const customerId = subscription.customer;
      
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
      
      // Update subscription status
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({
          subscription_status: status,
          role: status === 'active' ? 'pro' : 'basic',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userData.user_id);
      
      if (updateError) {
        console.error('Error updating subscription status:', updateError);
        return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
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