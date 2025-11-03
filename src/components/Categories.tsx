import { Apple, Dumbbell, Brain, Heart } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  {
    icon: Apple,
    title: "Nutrition",
    description: "Evidence-based eating guides, meal plans, and nutritional science research",
    color: "text-secondary",
  },
  {
    icon: Dumbbell,
    title: "Fitness",
    description: "Science-backed workout routines, exercise research, and training programs",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "Mental Health",
    description: "Research-based mindfulness, stress management, and emotional wellness strategies",
    color: "text-accent",
  },
  {
    icon: Heart,
    title: "Wellness",
    description: "Holistic health research, sleep science, recovery, and lifestyle optimization",
    color: "text-primary",
  },
];

const Categories = () => {
  return (
    <section className="py-16 md:py-20 bg-background" aria-labelledby="categories-heading">
      <div className="container">
        <header className="text-center mb-10 md:mb-12">
          <h2 id="categories-heading" className="font-display text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Health Topics
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse evidence-based content across key wellness categories
          </p>
        </header>

        <nav aria-label="Health topic categories">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 list-none">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <li key={category.title}>
                  <Card 
                    className="group hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                    tabIndex={0}
                    role="button"
                    aria-label={`Explore ${category.title} articles`}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className={`h-8 w-8 ${category.color}`} aria-hidden="true" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors text-xl">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-base leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Categories;
