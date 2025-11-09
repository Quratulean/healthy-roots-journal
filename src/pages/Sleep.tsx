import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Sleep = () => {
  const articles = [
    {
      id: 1,
      title: "Sleep Architecture and Cognitive Performance: Meta-Analysis",
      description: "Comprehensive review of 200+ studies on sleep stages, duration, and their effects on brain function",
      category: "Sleep",
      readTime: "12 min read",
      date: "March 21, 2024",
      slug: "sleep-cognitive-performance"
    },
    {
      id: 2,
      title: "Circadian Rhythm Optimization: Clinical Trial Results",
      description: "Controlled studies examining light exposure, timing, and sleep-wake cycle regulation",
      category: "Sleep",
      readTime: "10 min read",
      date: "March 19, 2024",
      slug: "circadian-rhythm"
    },
    {
      id: 3,
      title: "Sleep Deprivation and Metabolic Health: Research Review",
      description: "Evidence linking insufficient sleep to hormonal imbalances, weight gain, and chronic disease risk",
      category: "Sleep",
      readTime: "11 min read",
      date: "March 16, 2024",
      slug: "sleep-metabolic-health"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Sleep Science Research
              </h1>
              <p className="text-xl text-muted-foreground">
                Peer-reviewed studies on sleep quality, circadian rhythms, and their impact on health and performance
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 line-clamp-3">
                        {article.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sleep;