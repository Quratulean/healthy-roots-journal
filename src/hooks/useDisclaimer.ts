import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDisclaimer = (name: string = "medical_disclaimer") => {
  return useQuery({
    queryKey: ["disclaimer", name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disclaimers")
        .select("*")
        .eq("name", name)
        .eq("is_active", true)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });
};
