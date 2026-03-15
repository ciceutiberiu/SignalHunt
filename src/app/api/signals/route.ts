import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/utils/rate-limit";

const ALLOWED_SORT_FIELDS = ["reddit_created_at", "intent_score", "created_at", "upvotes"];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = rateLimit(`signals:${user.id}`, 60, 60_000);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const intent = searchParams.get("intent");
  const keyword = searchParams.get("keyword");
  const subreddit = searchParams.get("subreddit");
  const sort = ALLOWED_SORT_FIELDS.includes(searchParams.get("sort") || "") ? searchParams.get("sort")! : "reddit_created_at";
  const dir = searchParams.get("dir") === "asc" ? "asc" : "desc";
  const page = Math.max(1, Math.min(100, parseInt(searchParams.get("page") || "1") || 1));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "25") || 25));
  const offset = (page - 1) * limit;

  // Query user_signals joined with signals
  let query = supabase
    .from("user_signals")
    .select(
      `
      id,
      status,
      notes,
      signal:signals (
        id,
        title,
        body,
        subreddit,
        author,
        reddit_url,
        permalink,
        reddit_created_at,
        matched_keyword,
        intent_score,
        intent_label,
        summary,
        upvotes,
        num_comments,
        created_at
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id);

  if (status) query = query.eq("status", status);

  // Apply range and limit
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Failed to load signals" }, { status: 500 });

  // Flatten and apply client-side filters that can't be done in join
  let signals = (data || [])
    .filter((row) => row.signal !== null)
    .map((row) => {
      const signal = (Array.isArray(row.signal) ? row.signal[0] : row.signal) as Record<string, unknown>;
      return {
        id: signal.id as string,
        title: signal.title as string | null,
        body: signal.body as string | null,
        subreddit: signal.subreddit as string,
        author: signal.author as string,
        reddit_url: signal.reddit_url as string,
        reddit_created_at: signal.reddit_created_at as string,
        matched_keyword: signal.matched_keyword as string,
        intent_score: signal.intent_score as number | null,
        intent_label: signal.intent_label as string | null,
        summary: signal.summary as string | null,
        upvotes: signal.upvotes as number,
        num_comments: signal.num_comments as number,
        user_status: row.status,
        user_notes: row.notes,
      };
    });

  // Client-side filters for joined fields
  if (intent) signals = signals.filter((s) => s.intent_label === intent);
  if (keyword) signals = signals.filter((s) => s.matched_keyword === keyword);
  if (subreddit) signals = signals.filter((s) => s.subreddit.toLowerCase().includes(subreddit.toLowerCase()));

  // Sort
  const sortKey = sort as keyof (typeof signals)[0];
  signals.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (dir === "asc") return aVal < bVal ? -1 : 1;
    return aVal > bVal ? -1 : 1;
  });

  return NextResponse.json({
    signals,
    total: count ?? 0,
    page,
    limit,
  });
}
