import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { plan, user_id } = await req.json();

  if (!user_id || !plan) {
    return NextResponse.json({ error: "Missing user_id or plan" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meal_plans")
    .insert([{ user_id, plan }])
    .select("id") 
    .single(); ;

  if (error) {
    console.error("Error saving meal plan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }); // <-- Return the id
}