-- Fix the newsletter_subscribers INSERT policy to add validation
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create a more secure INSERT policy that requires valid email format
-- and prevents duplicate signups (handled by unique constraint on email)
CREATE POLICY "Anyone can subscribe with valid email" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (
    email IS NOT NULL 
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND LENGTH(email) <= 255
  );