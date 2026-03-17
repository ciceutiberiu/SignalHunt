import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("keywords")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load keywords" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const keyword = body.keyword;
  const subreddits = body.subreddits; // optional comma-separated string
  if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  // Validate subreddits format if provided
  const cleanSubreddits = subreddits && typeof subreddits === "string"
    ? subreddits.split(",").map((s: string) => s.trim().replace(/^r\//, "")).filter(Boolean).join(",")
    : null;

  // Check plan limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("keyword_limit")
    .eq("id", user.id)
    .single();

  const { count } = await supabase
    .from("keywords")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (profile && count !== null && count >= profile.keyword_limit) {
    return NextResponse.json(
      { error: "Keyword limit reached. Upgrade to Pro for more keywords." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("keywords")
    .insert({ user_id: user.id, keyword: keyword.trim().toLowerCase(), subreddits: cleanSubreddits })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "You already track this keyword" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add keyword" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
