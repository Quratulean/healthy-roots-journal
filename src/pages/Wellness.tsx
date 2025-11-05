import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Sun, Droplet, Wind } from "lucide-react";

const Wellness = () => {
  const wellnessAreas = [
    {
      icon: Leaf,
      title: "Holistic Health",
      description: "Integrate mind, body, and spirit for complete wellbeing and life balance."
    },
    {
      icon: Sun,
      title: "Lifestyle Habits",
      description: "Develop sustainable daily routines that support long-term health goals."
    },
    {
      icon: Droplet,
      title: "Hydration",
      description: "Understand the importance of proper hydration for optimal body function."
    },
    {
      icon: Wind,
      title: "Breathwork",
      description: "Learn breathing techniques to reduce stress and increase vitality."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Wellness & Lifestyle
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive wellness strategies to help you live a balanced, 
              healthy, and fulfilling life.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {wellnessAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <Card key={area.title}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{area.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{area.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto bg-muted/30 p-8 rounded-lg">
              <h2 className="font-display text-2xl font-bold mb-4">Daily Wellness Habits</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Start your day with a morning routine that sets positive intentions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Practice gratitude and positive thinking regularly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Spend time in nature and get sunlight exposure</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Limit screen time and digital distractions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Create work-life balance and set healthy boundaries</span>
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

export default Wellness;
