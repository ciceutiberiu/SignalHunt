import type { RedditPost, RedditSearchResponse } from "./types";

const USER_AGENT = "web:SignalHunt:1.0 (by /u/SignalHuntBot)";

// OAuth token cache
let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Reddit OAuth failed: ${res.status}`);
  }

  const data = await res.json();
  accessToken = data.access_token;
  // Expire 60 seconds early to be safe
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;

  return accessToken!;
}

// Simple rate limiter: minimum 1 second between requests (OAuth allows ~60/min)
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1000;

async function oauthFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();

  const token = await getAccessToken();

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });
}

export async function searchReddit(
  keyword: string,
  options: { limit?: number; sort?: string; t?: string; subreddits?: string[] } = {}
): Promise<RedditPost[]> {
  const { limit = 25, sort = "new", t = "week", subreddits } = options;

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

      const response = await oauthFetch(
        `https://oauth.reddit.com/r/${encodeURIComponent(sub)}/search?${params}`
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

  const response = await oauthFetch(
    `https://oauth.reddit.com/search?${params}`
  );

  if (!response.ok) {
    throw new Error(`Reddit search failed: ${response.status}`);
  }

  const data: RedditSearchResponse = await response.json();
  return data.data.children.map((child) => child.data);
}
