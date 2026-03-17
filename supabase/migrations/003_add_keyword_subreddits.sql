-- Add optional subreddits column to keywords
-- Users can target specific subreddits per keyword (comma-separated)
ALTER TABLE public.keywords ADD COLUMN IF NOT EXISTS subreddits TEXT DEFAULT NULL;

-- Add comment explaining format
COMMENT ON COLUMN public.keywords.subreddits IS 'Optional comma-separated list of subreddits to search (e.g. "SaaS,startups,smallbusiness")';
