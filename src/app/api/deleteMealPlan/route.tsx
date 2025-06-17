import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { user_id, plan_id } = await req.json();

  if (!user_id || !plan_id) {
    return NextResponse.json(
      { error: "Missing user_id or plan_id" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", plan_id)
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
