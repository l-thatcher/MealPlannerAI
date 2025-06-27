'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { UserResponse } from '@supabase/supabase-js'

export async function login(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}


export async function signup(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Attempting signup for:', data.email);

  const { error, data: signUpData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://plaite.vercel.app/'}/auth/confirm`
    }
  })

  if (error) {
    console.log('Signup error:', error.message);
    return { error: error.message };
  }

  console.log('Signup successful:', signUpData);

  // Redirect to email confirmation waiting page instead of home
  redirect('/verify-email?email=' + encodeURIComponent(data.email))
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPassword(email: string): Promise<{ error?: string, data?: Record<string, never> }> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function resetPassword(newPassword: string): Promise<{ error?: string, data?: UserResponse['data'] }> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    return { error: error.message };
  }

  console.log('Password reset successful:', data);

  return { data };
}

export async function resendVerificationEmail(email: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  console.log('Attempting to resend verification email for:', email);

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://plaite.vercel.app/'}/auth/confirm`
    }
  });

  if (error) {
    console.log('Resend verification email error:', error.message);
    return { error: error.message };
  }

  console.log('Verification email resent successfully');
  return { success: true };
}


