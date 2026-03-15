import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SIGNAL_STATUSES } from "@/lib/utils/constants";
import { rateLimit } from "@/lib/utils/rate-limit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success: rlOk } = rateLimit(`status:${user.id}`, 60, 60_000);
  if (!rlOk) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { status } = await request.json();
  if (!SIGNAL_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_signals")
    .update({ status })
    .eq("signal_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("user_signals")
    .delete()
    .eq("signal_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
