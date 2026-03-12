import { getRedditToken } from "./auth";
import type { RedditPost, RedditSearchResponse } from "./types";

export async function searchReddit(
  keyword: string,
  options: { limit?: number; sort?: string; t?: string } = {}
): Promise<RedditPost[]> {
  const { limit = 25, sort = "new", t = "day" } = options;
  const token = await getRedditToken();

  const params = new URLSearchParams({
    q: keyword,
    sort,
    t,
    limit: limit.toString(),
    type: "link",
    restrict_sr: "false",
  });

  const response = await fetch(
    `https://oauth.reddit.com/search.json?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "SignalHunt/1.0",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Reddit search failed: ${response.status}`);
  }

  const data: RedditSearchResponse = await response.json();
  return data.data.children.map((child) => child.data);
}
