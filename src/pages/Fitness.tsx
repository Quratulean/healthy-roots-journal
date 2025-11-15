import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedArticles from "@/components/FeaturedArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Heart, Zap, Users } from "lucide-react";

const Fitness = () => {
  const fitnessAreas = [
    {
      icon: Dumbbell,
      title: "Strength Training",
      description: "Build muscle, increase bone density, and boost metabolism with resistance exercises."
    },
    {
      icon: Heart,
      title: "Cardiovascular Health",
      description: "Improve heart health and endurance through aerobic activities and cardio workouts."
    },
    {
      icon: Zap,
      title: "Flexibility & Mobility",
      description: "Enhance range of motion and prevent injuries with stretching and mobility exercises."
    },
    {
      icon: Users,
      title: "Group Activities",
      description: "Stay motivated and social with team sports, classes, and group fitness programs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Fitness & Exercise
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Science-backed fitness guidance to help you build strength, improve endurance, 
              and create sustainable exercise habits.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {fitnessAreas.map((area) => {
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
              <h2 className="font-display text-2xl font-bold mb-4">Fitness Fundamentals</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Aim for at least 150 minutes of moderate aerobic activity per week</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Include strength training exercises 2-3 times weekly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Warm up before workouts and cool down afterwards</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Listen to your body and allow adequate recovery time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Start slowly and progressively increase intensity</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container">
            <FeaturedArticles />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Fitness;
