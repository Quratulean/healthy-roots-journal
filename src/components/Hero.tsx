import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Wellness and health" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>
      
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Journey to
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Better Health
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover expert-backed advice on nutrition, fitness, and mental wellness. 
            Transform your lifestyle with evidence-based insights and practical tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base group">
              Explore Articles
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Start Free Newsletter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
