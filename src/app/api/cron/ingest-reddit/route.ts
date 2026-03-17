import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { searchReddit } from "@/lib/reddit/client";
import { verifyCronAuth } from "@/lib/utils/cron-auth";
import type { RedditPost } from "@/lib/reddit/types";

function isLikelyNoise(post: RedditPost): boolean {
  const title = (post.title || "").toLowerCase();
  const body = (post.selftext || "").toLowerCase();
  const combined = `${title} ${body}`;
  if (/\b(i built|i made|i created|check out my|just launched|show ?hn|side project)\b/.test(combined)) return true;
  if (post.link_flair_text && /meme|joke|shitpost|humor/i.test(post.link_flair_text)) return true;
  if (post.author === "[deleted]" || post.selftext === "[removed]") return true;
  return false;
}

export async function GET(request: NextRequest) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const startedAt = new Date();
  const supabase = createAdminClient();
  let signalsCreated = 0;
  let keywordsProcessed = 0;
  const errors: string[] = [];

  try {
    // Get all distinct active keywords
    const { data: keywords } = await supabase
      .from("keywords")
      .select("keyword, user_id, subreddits")
      .eq("is_active", true);

    if (!keywords?.length) {
      return NextResponse.json({ message: "No active keywords" });
    }

    // Group users and subreddits by keyword
    const keywordUsers = new Map<string, string[]>();
    const keywordSubreddits = new Map<string, string[]>();
    for (const kw of keywords) {
      const users = keywordUsers.get(kw.keyword) || [];
      users.push(kw.user_id);
      keywordUsers.set(kw.keyword, users);

      // Merge subreddits from all users tracking this keyword
      if (kw.subreddits) {
        const existing = keywordSubreddits.get(kw.keyword) || [];
        const subs = kw.subreddits.split(",").map((s: string) => s.trim()).filter(Boolean);
        keywordSubreddits.set(kw.keyword, [...new Set([...existing, ...subs])]);
      }
    }

    // Process up to 10 distinct keywords per run
    const uniqueKeywords = Array.from(keywordUsers.keys()).slice(0, 10);

    for (const keyword of uniqueKeywords) {
      const subreddits = keywordSubreddits.get(keyword);
      try {
        const rawPosts = await searchReddit(keyword, { limit: 25, subreddits });
        keywordsProcessed++;
        const posts = rawPosts.filter((p) => !isLikelyNoise(p));

        for (const post of posts) {
          // Insert signal (dedup by reddit_post_id)
          const { data: signal, error: insertError } = await supabase
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

          if (insertError && insertError.code !== "23505") {
            errors.push(`Insert error for ${post.id}: ${insertError.message}`);
            continue;
          }

          // If signal was created, get its ID; otherwise look it up
          let signalId = signal?.id;
          if (!signalId) {
            const { data: existing } = await supabase
              .from("signals")
              .select("id")
              .eq("reddit_post_id", post.id)
              .single();
            signalId = existing?.id;
          }

          if (!signalId) continue;

          if (signal) signalsCreated++;

          // Link signal to all users tracking this keyword
          const userIds = keywordUsers.get(keyword) || [];
          for (const userId of userIds) {
            await supabase
              .from("user_signals")
              .upsert(
                { user_id: userId, signal_id: signalId },
                { onConflict: "user_id,signal_id", ignoreDuplicates: true }
              );
          }
        }
      } catch (err) {
        errors.push(`Keyword "${keyword}": ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Log ingestion
    const completedAt = new Date();
    await supabase.from("ingestion_log").insert({
      job_type: "ingest-reddit",
      keywords_processed: keywordsProcessed,
      signals_created: signalsCreated,
      errors: errors.length > 0 ? errors : null,
      duration_ms: completedAt.getTime() - startedAt.getTime(),
      started_at: startedAt.toISOString(),
      completed_at: completedAt.toISOString(),
    });

    return NextResponse.json({
      keywords_processed: keywordsProcessed,
      signals_created: signalsCreated,
      errors: errors.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
