import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  console.log('=== AUTH CONFIRM ROUTE HIT ===');
  console.log('Auth confirm route hit with URL:', request.url);
  console.log('Stripe key configured:', !!process.env.STRIPE_SECRET_KEY);
  console.log('=== PROCESSING REQUEST ===');
  
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  console.log('Extracted params:', { token_hash: !!token_hash, type, next });

  if (token_hash && type) {
    const supabase = await createClient()

    console.log('Attempting to verify OTP...');
    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    console.log('OTP verification result:', { 
      hasError: !!error, 
      errorMessage: error?.message,
      hasUser: !!data?.user,
      userEmail: data?.user?.email 
    });
    
    if (!error && data.user) {
      console.log('Email verification successful for user:', data.user.email);
      
      // Create Stripe customer after successful email verification
      try {
        console.log('Attempting to create Stripe customer...');
        const customer = await stripe.customers.create({
          email: data.user.email!,
          metadata: {
            userId: data.user.id,
          },
        });

        console.log('Stripe customer created successfully:', customer.id);

        // Save to database
        console.log('Saving user role to database...');
        const { error: dbError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: data.user.id,
            stripe_customer_id: customer.id,
            role: 'basic',
            updated_at: new Date().toISOString(),
          });

        if (dbError) {
          console.error('Database error saving user role:', dbError);
        } else {
          console.log('User role saved successfully');
        }

        console.log('Created Stripe customer on signup:', customer.id);
      } catch (stripeError) {
        console.error('Failed to create Stripe customer:', stripeError);
      }

      redirect(next)
    } else {
      console.log('OTP verification failed or no user data');
      if (error) {
        console.error('OTP verification error:', error);
      }
    }
  } else {
    console.log('Missing required parameters:', { 
      hasTokenHash: !!token_hash, 
      hasType: !!type 
    });
  }
  
  console.log('Redirecting to /error');
  redirect('/error')
}