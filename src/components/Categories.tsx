import { Apple, Dumbbell, Brain, Heart } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  {
    icon: Apple,
    title: "Nutrition",
    description: "Healthy eating guides, meal plans, and nutritional science",
    color: "text-green-600",
  },
  {
    icon: Dumbbell,
    title: "Fitness",
    description: "Workout routines, exercise tips, and training programs",
    color: "text-blue-600",
  },
  {
    icon: Brain,
    title: "Mental Health",
    description: "Mindfulness, stress management, and emotional wellness",
    color: "text-purple-600",
  },
  {
    icon: Heart,
    title: "Wellness",
    description: "Holistic health, sleep, recovery, and lifestyle balance",
    color: "text-red-600",
  },
];

const Categories = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Explore Topics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive library of health and wellness content
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.title}
                className="group hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className={`h-7 w-7 ${category.color}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
