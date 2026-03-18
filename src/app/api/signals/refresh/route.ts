import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { searchReddit } from "@/lib/reddit/client";
import { classifySignals } from "@/lib/ai/classify";
import { rateLimit } from "@/lib/utils/rate-limit";
import type { RedditPost } from "@/lib/reddit/types";

// Filter out obvious noise before wasting AI credits on classification
function isLikelyNoise(post: RedditPost): boolean {
  const title = (post.title || "").toLowerCase();
  const body = (post.selftext || "").toLowerCase();
  const combined = `${title} ${body}`;

  // Self-promotion / show-and-tell
  if (/\b(i built|i made|i created|check out my|just launched|show ?hn|side project)\b/.test(combined)) return true;

  // Memes, jokes, shitposts
  if (post.link_flair_text && /meme|joke|shitpost|humor/i.test(post.link_flair_text)) return true;

  // Deleted or removed posts
  if (post.author === "[deleted]" || post.selftext === "[removed]") return true;

  return false;
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Check if user has a paid plan
  const { data: profile } = await admin
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (!profile || profile.plan === "free") {
    return NextResponse.json({ error: "Upgrade to a paid plan to scan Reddit." }, { status: 403 });
  }

  // Limit refreshes to 5 per hour per user
  const { success } = rateLimit(`refresh:${user.id}`, 5, 3_600_000);
  if (!success) return NextResponse.json({ error: "Too many refreshes. Try again later." }, { status: 429 });

  // Get this user's active keywords
  const { data: keywords } = await admin
    .from("keywords")
    .select("keyword, subreddits")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!keywords?.length) {
    return NextResponse.json({ message: "No active keywords" });
  }

  let signalsCreated = 0;
  const newSignalIds: string[] = [];

  for (const kw of keywords.slice(0, 5)) {
    const keyword = kw.keyword;
    const subreddits = kw.subreddits
      ? kw.subreddits.split(",").map((s: string) => s.trim()).filter(Boolean)
      : undefined;
    try {
      const rawPosts = await searchReddit(keyword, { limit: 10, subreddits });
      const posts = rawPosts.filter((p) => !isLikelyNoise(p));

      for (const post of posts) {
        const { data: signal, error: insertError } = await admin
          .from("signals")
          .upsert(
            {
              reddit_post_id: post.id,
              reddit_type: "post",
              title: post.title,
              body: post.selftext || null,
              subreddit: post.subreddit,
              author: post.author,
              reddit_url: `https://reddit.com${post.permalink}`,
              permalink: post.permalink,
              reddit_created_at: new Date(post.created_utc * 1000).toISOString(),
              matched_keyword: keyword,
              upvotes: post.ups,
              num_comments: post.num_comments,
            },
            { onConflict: "reddit_post_id", ignoreDuplicates: true }
          )
          .select("id")
          .single();

        let signalId = signal?.id;
        if (insertError && insertError.code !== "23505") continue;

        if (!signalId) {
          const { data: existing } = await admin
            .from("signals")
            .select("id")
            .eq("reddit_post_id", post.id)
            .single();
          signalId = existing?.id;
        }

        if (!signalId) continue;
        if (signal) {
          signalsCreated++;
          newSignalIds.push(signalId);
        }

        await admin
          .from("user_signals")
          .upsert(
            { user_id: user.id, signal_id: signalId },
            { onConflict: "user_id,signal_id", ignoreDuplicates: true }
          );
      }
    } catch {
      // Skip failed keywords silently
    }
  }

  // Classify any new unclassified signals from this batch
  if (newSignalIds.length > 0) {
    try {
      const { data: unclassified } = await admin
        .from("signals")
        .select("id, title, body, subreddit, upvotes, num_comments")
        .in("id", newSignalIds)
        .is("classified_at", null)
        .limit(20);

      if (unclassified?.length) {
        const results = await classifySignals(unclassified);
        for (const result of results) {
          await admin
            .from("signals")
            .update({
              intent_score: result.intent_score,
              intent_label: result.intent_label,
              summary: result.summary,
              classified_at: new Date().toISOString(),
            })
            .eq("id", result.id);
        }
      }
    } catch {
      // Classification can fail - signals are still created
    }
  }

  return NextResponse.json({ signals_created: signalsCreated });
}
