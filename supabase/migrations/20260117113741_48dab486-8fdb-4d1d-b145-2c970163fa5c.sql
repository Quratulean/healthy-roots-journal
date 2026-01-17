-- Create disclaimers table to store versioned medical disclaimers
CREATE TABLE public.disclaimers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disclaimers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active disclaimers" 
ON public.disclaimers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can insert disclaimers" 
ON public.disclaimers 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update disclaimers" 
ON public.disclaimers 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete disclaimers" 
ON public.disclaimers 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add disclaimer trigger for updated_at
CREATE TRIGGER update_disclaimers_updated_at
BEFORE UPDATE ON public.disclaimers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default medical disclaimer
INSERT INTO public.disclaimers (name, content, is_active, version) VALUES (
  'medical_disclaimer',
  '<div class="medical-disclaimer" style="background: linear-gradient(135deg, #fef3cd 0%, #fff3e0 100%); border-left: 4px solid #f59e0b; padding: 1.5rem; margin: 2rem 0; border-radius: 0.5rem;"><p style="margin: 0; font-size: 0.875rem; color: #92400e;"><strong>Medical Disclaimer:</strong> The information provided in this article is for educational and informational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional before making any changes to your diet, exercise routine, or health regimen. The author and publisher are not responsible for any adverse effects or consequences resulting from the use of any suggestions, preparations, or procedures discussed in this article.</p></div>',
  true,
  1
);