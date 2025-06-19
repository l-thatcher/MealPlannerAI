// filepath: /src/app/api/getSavedMealPlans/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();


  if (!user) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }


  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, plan")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const plans = (data || []).map(row => ({
    ...row.plan,
    id: row.id,
  }));

  return NextResponse.json({ plans });
}