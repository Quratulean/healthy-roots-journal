import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedArticles from "@/components/FeaturedArticles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Moon, Smile } from "lucide-react";

const MentalHealth = () => {
  const mentalHealthTopics = [
    {
      icon: Brain,
      title: "Stress Management",
      description: "Learn effective techniques to manage stress and build resilience in daily life."
    },
    {
      icon: Heart,
      title: "Emotional Wellness",
      description: "Develop healthy emotional regulation and cultivate positive mental habits."
    },
    {
      icon: Moon,
      title: "Sleep Quality",
      description: "Improve sleep hygiene and rest quality for better mental and physical health."
    },
    {
      icon: Smile,
      title: "Mindfulness",
      description: "Practice present-moment awareness and meditation for mental clarity."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Mental Health & Wellness
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Evidence-based strategies for maintaining mental wellness, managing stress, 
              and building emotional resilience.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {mentalHealthTopics.map((topic) => {
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
              <h2 className="font-display text-2xl font-bold mb-4">Mental Wellness Practices</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Practice daily mindfulness or meditation for 10-15 minutes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Maintain social connections and nurture relationships</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Prioritize 7-9 hours of quality sleep each night</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Engage in regular physical activity to boost mood</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Seek professional help when needed - it's a sign of strength</span>
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

export default MentalHealth;
