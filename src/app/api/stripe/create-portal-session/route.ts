import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's Stripe customer ID from your database
    const { data: userRole, error: userError } = await supabase
      .from('user_roles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (userError || !userRole?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userRole.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json({ 
      error: 'Failed to create portal session' 
    }, { status: 500 });
  }
}