-- Step 2: Create post_status enum
DO $$ BEGIN
  CREATE TYPE public.post_status AS ENUM ('draft', 'editor_review', 'scheduled', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 3: Upgrade blog_posts table with all new columns including scheduled_at
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS status post_status DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewer_id UUID,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_medically_reviewed TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS needs_update BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Rename image_url to featured_image for clarity
ALTER TABLE public.blog_posts RENAME COLUMN image_url TO featured_image;

-- Create indexes for scheduled posts and status
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at ON public.blog_posts(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);

-- Step 4: Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 5: Create post_categories junction table
CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (post_id, category_id)
);

ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post categories" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Admins and Editors can insert post categories" ON public.post_categories FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins and Editors can delete post categories" ON public.post_categories FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Step 6: Add credentials to profiles for author info
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS credentials TEXT,
  ADD COLUMN IF NOT EXISTS is_author BOOLEAN DEFAULT false;

-- Step 7: Create medical_reviewers table
CREATE TABLE IF NOT EXISTS public.medical_reviewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  credentials TEXT,
  profile_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.medical_reviewers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reviewers" ON public.medical_reviewers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert reviewers" ON public.medical_reviewers FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update reviewers" ON public.medical_reviewers FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete reviewers" ON public.medical_reviewers FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 8: Create post_versions table (snapshots on publish)
CREATE TABLE IF NOT EXISTS public.post_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  content_snapshot JSONB NOT NULL,
  version_number INTEGER NOT NULL,
  edited_by UUID,
  edited_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.post_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and Editors can view versions" ON public.post_versions FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "System can insert versions" ON public.post_versions FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Step 9: Upgrade newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS confirmed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';

-- Step 10: Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view logs" ON public.admin_activity_logs FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated users can insert logs" ON public.admin_activity_logs FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Step 11: Update blog_posts RLS for editor role
DROP POLICY IF EXISTS "Admins can insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete posts" ON public.blog_posts;

CREATE POLICY "Admins and Editors can insert posts" ON public.blog_posts FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and Editors can update posts" ON public.blog_posts FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Only Admins can delete posts" ON public.blog_posts FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));