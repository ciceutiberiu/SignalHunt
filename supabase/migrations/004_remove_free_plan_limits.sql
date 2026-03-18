-- Free users can no longer add keywords (must upgrade)
UPDATE public.profiles SET keyword_limit = 0 WHERE plan = 'free';
