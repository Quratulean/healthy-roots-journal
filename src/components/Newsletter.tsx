import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-primary-foreground/90 mb-8 text-lg">
            Get weekly health tips, exclusive articles, and wellness insights delivered straight to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground/50"
            />
            <Button 
              className="bg-background text-primary hover:bg-background/90 font-semibold"
            >
              Subscribe
            </Button>
          </div>
          
          <p className="text-sm text-primary-foreground/70 mt-4">
            Join 10,000+ health enthusiasts. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
