import type { RedditPost, RedditSearchResponse } from "./types";

const USER_AGENT = "SignalHunt/1.0 (public JSON endpoint)";

// Simple rate limiter: minimum 6 seconds between requests (~10 req/min)
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 6000;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();

  return fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });
}

export async function searchReddit(
  keyword: string,
  options: { limit?: number; sort?: string; t?: string; subreddits?: string[] } = {}
): Promise<RedditPost[]> {
  const { limit = 25, sort = "new", t = "day", subreddits } = options;

  // If subreddits specified, search within each one; otherwise search globally
  if (subreddits && subreddits.length > 0) {
    const allPosts: RedditPost[] = [];
    const perSubLimit = Math.max(5, Math.floor(limit / subreddits.length));

    for (const sub of subreddits.slice(0, 5)) {
      const params = new URLSearchParams({
        q: keyword,
        sort,
        t,
        limit: perSubLimit.toString(),
        restrict_sr: "true",
        type: "link",
      });

      const response = await rateLimitedFetch(
        `https://www.reddit.com/r/${encodeURIComponent(sub)}/search.json?${params}`
      );

      if (response.ok) {
        const data: RedditSearchResponse = await response.json();
        allPosts.push(...data.data.children.map((child) => child.data));
      }
    }

    return allPosts;
  }

  // Global search (no subreddit filter)
  const params = new URLSearchParams({
    q: keyword,
    sort,
    t,
    limit: limit.toString(),
    type: "link",
    restrict_sr: "false",
  });

  const response = await rateLimitedFetch(
    `https://www.reddit.com/search.json?${params}`
  );

  if (!response.ok) {
    throw new Error(`Reddit search failed: ${response.status}`);
  }

  const data: RedditSearchResponse = await response.json();
  return data.data.children.map((child) => child.data);
}
