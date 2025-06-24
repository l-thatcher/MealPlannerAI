import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring',
    });

    const plans = prices.data.map(price => {
      // Type guard to check if product is an object and not a string
      const product = price.product && typeof price.product === 'object' && 'name' in price.product
        ? price.product as Stripe.Product
        : null;

      return {
        id: price.id,
        name: product?.name ?? '',
        description: product?.description ?? '',
        price: price.unit_amount,
        interval: price.recurring?.interval ?? '',
        price_id: price.id,
      };
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching subscription plans' }, { status: 500 });
  }
}