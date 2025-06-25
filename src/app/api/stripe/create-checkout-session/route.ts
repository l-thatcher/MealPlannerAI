import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    console.log('Processing checkout for price:', priceId);

    // Verify the price exists in Stripe
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (!price.active) {
        return NextResponse.json({ error: 'Price is not active' }, { status: 400 });
      }
      console.log('Price verified:', { id: price.id, active: price.active, type: price.type });
    } catch (priceError) {
      console.error('Invalid price ID:', priceError);
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to subscribe' }, { status: 401 });
    }

    // Check if user already has a Stripe customer ID
    const { data: userRole, error: userRoleError } = await supabase
      .from('user_roles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId: string | undefined;

    // If user has existing Stripe customer ID, use it
    if (!userRoleError && userRole?.stripe_customer_id) {
      const existingCustomerId = userRole.stripe_customer_id;
      console.log('Using existing Stripe customer:', existingCustomerId);
      
      // Verify the customer still exists in Stripe
      try {
        await stripe.customers.retrieve(existingCustomerId);
        customerId = existingCustomerId;
      } catch (stripeError) {
        console.error('Existing customer not found in Stripe, creating new one:', stripeError);
        customerId = undefined; // Force creation of new customer
      }
    }

    if (!customerId) {
      console.log('Creating new Stripe customer for user:', user.id);
      // If no existing customer, create one and save it
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      console.log('Created new Stripe customer:', customerId);

      // Save the new customer ID to the database
      const { error: upsertError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          role: 'basic', // Default role
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error('Error saving customer ID to database:', upsertError);
        // Continue anyway as the customer was created in Stripe
      }
    }

    console.log('Creating checkout session with:', {
      customerId,
      priceId,
      userId: user.id,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/subscriptions`,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    });

    console.log('Checkout session created:', {
      id: checkoutSession.id,
      url: checkoutSession.url,
      customer: checkoutSession.customer,
      status: checkoutSession.status
    });

    if (!checkoutSession.url) {
      console.error('Checkout session created but no URL returned:', checkoutSession);
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}