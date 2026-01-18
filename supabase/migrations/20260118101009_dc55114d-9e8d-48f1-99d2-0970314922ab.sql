-- Add 'author' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'author';

-- Create a rate limiting table for newsletter signups
CREATE TABLE IF NOT EXISTS public.newsletter_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  attempts INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.newsletter_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow inserts/updates for rate limiting (service role only)
CREATE POLICY "Service role can manage rate limits" ON public.newsletter_rate_limits
  FOR ALL USING (true) WITH CHECK (true);

-- Create internal_links table for tracking
CREATE TABLE IF NOT EXISTS public.internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  target_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  anchor_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(source_post_id, target_post_id)
);

-- Enable RLS on internal_links
ALTER TABLE public.internal_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view internal links
CREATE POLICY "Anyone can view internal links" ON public.internal_links
  FOR SELECT USING (true);

-- Admins and editors can manage internal links
CREATE POLICY "Admins and editors can insert internal links" ON public.internal_links
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can delete internal links" ON public.internal_links
  FOR DELETE USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- Create content_quality_scores table
CREATE TABLE IF NOT EXISTS public.content_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE UNIQUE,
  readability_score DECIMAL(5,2),
  word_count INTEGER,
  has_disclaimer BOOLEAN DEFAULT false,
  has_sources BOOLEAN DEFAULT false,
  has_reviewer BOOLEAN DEFAULT false,
  seo_score DECIMAL(5,2),
  overall_score DECIMAL(5,2),
  issues JSONB DEFAULT '[]'::jsonb,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on content_quality_scores
ALTER TABLE public.content_quality_scores ENABLE ROW LEVEL SECURITY;

-- Admins and editors can view/manage quality scores
CREATE POLICY "Admins and editors can view quality scores" ON public.content_quality_scores
  FOR SELECT USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can insert quality scores" ON public.content_quality_scores
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update quality scores" ON public.content_quality_scores
  FOR UPDATE USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));