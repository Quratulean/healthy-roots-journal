import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed!",
            description: "This email is already on our newsletter list.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Welcome to our health & wellness community.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="py-16 md:py-20 bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground"
      aria-labelledby="newsletter-heading"
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-90" aria-hidden="true" />
          <h2 id="newsletter-heading" className="font-display text-3xl md:text-4xl font-bold mb-4">
            Stay Informed with Evidence-Based Insights
          </h2>
          <p className="text-primary-foreground/95 mb-8 text-base md:text-lg leading-relaxed">
            Receive curated research summaries, expert health tips, and the latest wellness discoveries weekly.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <Input 
              id="newsletter-email"
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              aria-required="true"
              className="bg-background/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-primary-foreground/50 focus-visible:ring-offset-0"
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-background text-primary hover:bg-background/90 font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap disabled:opacity-50"
              aria-label="Subscribe to newsletter"
            >
              {isLoading ? "Subscribing..." : "Subscribe Now"}
            </Button>
          </form>
          
          <p className="text-sm text-primary-foreground/80 mt-4">
            Join <strong>10,000+</strong> health-conscious readers. Unsubscribe anytime. Privacy guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
