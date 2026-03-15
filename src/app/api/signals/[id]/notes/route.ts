import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/utils/rate-limit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = rateLimit(`notes:${user.id}`, 30, 60_000);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await request.json();
  const notes = body.notes;

  if (typeof notes !== "string" || notes.length > 5000) {
    return NextResponse.json({ error: "Invalid notes" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_signals")
    .update({ notes: notes.trim() })
    .eq("signal_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to save notes" }, { status: 500 });
  return NextResponse.json({ success: true });
}
