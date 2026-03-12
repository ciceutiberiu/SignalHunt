import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalRes, newRes, highIntentRes, savedRes] = await Promise.all([
    supabase
      .from("user_signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("user_signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "new"),
    supabase
      .from("user_signals")
      .select("signal:signals!inner(intent_label)", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("signals.intent_label", "high"),
    supabase
      .from("user_signals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "saved"),
  ]);

  return NextResponse.json({
    total: totalRes.count ?? 0,
    new: newRes.count ?? 0,
    highIntent: highIntentRes.count ?? 0,
    saved: savedRes.count ?? 0,
  });
}
