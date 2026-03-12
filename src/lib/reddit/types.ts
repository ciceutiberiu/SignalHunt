export interface RedditPost {
  id: string;
  name: string;
  title: string;
  selftext: string;
  subreddit: string;
  author: string;
  url: string;
  permalink: string;
  created_utc: number;
  ups: number;
  num_comments: number;
  is_self: boolean;
}

export interface RedditSearchResponse {
  data: {
    children: Array<{
      kind: string;
      data: RedditPost;
    }>;
    after: string | null;
  };
}

export interface RedditToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
