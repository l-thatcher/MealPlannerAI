import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { plan } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!plan) {
    return NextResponse.json({ error: "Missing plan" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meal_plans")
    .insert([{ user_id: user.id, plan }])
    .select("id") 
    .single(); ;

  if (error) {
    console.error("Error saving meal plan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }); // <-- Return the id
}