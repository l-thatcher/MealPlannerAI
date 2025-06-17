// filepath: /src/app/api/getSavedMealPlans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, plan")
    .eq("user_id", user_id)
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