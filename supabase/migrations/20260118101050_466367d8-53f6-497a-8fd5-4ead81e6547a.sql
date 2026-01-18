-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.newsletter_rate_limits;

-- The newsletter_rate_limits table is managed by edge functions using service role key
-- No public RLS policies needed - service role bypasses RLS
-- This is intentional as rate limiting should only be managed server-side

-- Add DELETE policy for content_quality_scores
CREATE POLICY "Admins and editors can delete quality scores" ON public.content_quality_scores
  FOR DELETE USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));