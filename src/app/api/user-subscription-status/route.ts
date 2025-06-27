import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user role and subscription status
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role, subscription_status, subscription_duration, updated_at')
      .eq('user_id', user.id)
      .single();

    if (roleError && roleError.code !== 'PGRST116') {
      console.error('Error fetching user role:', roleError);
      return NextResponse.json({ error: 'Failed to fetch user subscription status' }, { status: 500 });
    }

    // Default to basic if no record exists
    const role = userRole?.role || 'basic';
    const subscriptionStatus = userRole?.subscription_status || null;
    const subscriptionDuration = userRole?.subscription_duration || null;
    const updatedAt = userRole?.updated_at || null;

    return NextResponse.json({
      role,
      subscriptionStatus,
      subscriptionDuration,
      isPro: role === 'pro' && subscriptionStatus === 'active',
      updatedAt
    });

  } catch (error) {
    console.error('Error checking user subscription status:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
