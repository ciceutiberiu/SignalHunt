-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  keyword_limit INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keywords
CREATE TABLE public.keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, keyword)
);

-- Signals
CREATE TABLE public.signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reddit_post_id TEXT UNIQUE NOT NULL,
  reddit_type TEXT NOT NULL DEFAULT 'post' CHECK (reddit_type IN ('post', 'comment')),
  title TEXT,
  body TEXT,
  subreddit TEXT NOT NULL,
  author TEXT NOT NULL,
  reddit_url TEXT NOT NULL,
  permalink TEXT NOT NULL,
  reddit_created_at TIMESTAMPTZ NOT NULL,
  matched_keyword TEXT NOT NULL,
  intent_score INTEGER CHECK (intent_score >= 0 AND intent_score <= 100),
  intent_label TEXT CHECK (intent_label IN ('high', 'medium', 'low', 'none')),
  summary TEXT,
  classified_at TIMESTAMPTZ,
  classification_attempts INTEGER NOT NULL DEFAULT 0,
  upvotes INTEGER NOT NULL DEFAULT 0,
  num_comments INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Signals (junction table)
CREATE TABLE public.user_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  signal_id UUID NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'saved', 'contacted', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, signal_id)
);

-- Ingestion Log
CREATE TABLE public.ingestion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  keywords_processed INTEGER NOT NULL DEFAULT 0,
  signals_created INTEGER NOT NULL DEFAULT 0,
  signals_classified INTEGER NOT NULL DEFAULT 0,
  errors JSONB,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_keywords_user_id ON public.keywords(user_id);
CREATE INDEX idx_keywords_keyword ON public.keywords(keyword);
CREATE INDEX idx_signals_reddit_post_id ON public.signals(reddit_post_id);
CREATE INDEX idx_signals_matched_keyword ON public.signals(matched_keyword);
CREATE INDEX idx_signals_intent_label ON public.signals(intent_label);
CREATE INDEX idx_signals_classified_at ON public.signals(classified_at);
CREATE INDEX idx_signals_created_at ON public.signals(created_at DESC);
CREATE INDEX idx_user_signals_user_id ON public.user_signals(user_id);
CREATE INDEX idx_user_signals_signal_id ON public.user_signals(signal_id);
CREATE INDEX idx_user_signals_status ON public.user_signals(status);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_signals ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Keywords: full CRUD on own
CREATE POLICY "Users can view own keywords" ON public.keywords FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own keywords" ON public.keywords FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own keywords" ON public.keywords FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own keywords" ON public.keywords FOR DELETE USING (auth.uid() = user_id);

-- Signals: authenticated users can read (filtered via user_signals join in practice)
CREATE POLICY "Authenticated users can read signals" ON public.signals FOR SELECT TO authenticated USING (true);

-- User Signals: users read/update own
CREATE POLICY "Users can view own user_signals" ON public.user_signals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_signals" ON public.user_signals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_signals" ON public.user_signals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own user_signals" ON public.user_signals FOR DELETE USING (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_signals_updated_at
  BEFORE UPDATE ON public.user_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
