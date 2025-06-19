import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { plan_id } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (!plan_id) {
    return NextResponse.json({ error: "Missing plan_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("meal_plans")
    .delete()
    .eq("id", plan_id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
