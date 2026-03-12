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
  options: { limit?: number; sort?: string; t?: string } = {}
): Promise<RedditPost[]> {
  const { limit = 25, sort = "new", t = "day" } = options;

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
