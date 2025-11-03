import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Person practicing wellness activities in a serene environment" 
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
      </div>
      
      <div className="container relative z-10 py-16 md:py-20">
        <div className="max-w-2xl">
          <h1 
            id="hero-title" 
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
          >
            Evidence-Based Health
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
              Insights You Can Trust
            </span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-xl">
            Access research-backed information on <strong>nutrition</strong>, <strong>mental health</strong>, and <strong>fitness</strong>. 
            Make informed decisions with expert-reviewed content designed for better health literacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button 
              size="lg" 
              className="text-base group shadow-lg hover:shadow-xl transition-all"
              aria-label="Explore our health articles"
            >
              Explore Articles
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base border-2 hover:bg-muted/50"
              aria-label="Subscribe to our newsletter"
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
