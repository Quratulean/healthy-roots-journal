import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Carrot, Fish, Wheat } from "lucide-react";

const Nutrition = () => {
  const nutritionTopics = [
    {
      icon: Apple,
      title: "Balanced Diet",
      description: "Learn how to create nutritionally complete meals that fuel your body and mind."
    },
    {
      icon: Carrot,
      title: "Vitamins & Minerals",
      description: "Understand essential nutrients and their role in maintaining optimal health."
    },
    {
      icon: Fish,
      title: "Healthy Fats",
      description: "Discover the importance of omega-3s and other beneficial fats in your diet."
    },
    {
      icon: Wheat,
      title: "Whole Grains",
      description: "Explore the benefits of whole grains and complex carbohydrates for sustained energy."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Nutrition & Diet
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Evidence-based nutrition advice to help you make informed dietary choices 
              for better health and wellness.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {nutritionTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Card key={topic.title}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{topic.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{topic.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto bg-muted/30 p-8 rounded-lg">
              <h2 className="font-display text-2xl font-bold mb-4">Quick Nutrition Tips</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Eat a rainbow of colorful fruits and vegetables daily</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Choose whole grains over refined carbohydrates</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Include lean proteins and healthy fats in every meal</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Stay hydrated with water throughout the day</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Practice mindful eating and portion control</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Nutrition;
