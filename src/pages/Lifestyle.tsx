import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedArticles from "@/components/FeaturedArticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Lifestyle = () => {
  const articles = [
    {
      id: 1,
      title: "Evidence-Based Daily Routines for Optimal Health",
      description: "Systematic review of lifestyle interventions and their impact on long-term health outcomes",
      category: "Lifestyle",
      readTime: "8 min read",
      date: "March 20, 2024",
      slug: "optimal-health-routines"
    },
    {
      id: 2,
      title: "Work-Life Balance: Clinical Research on Stress and Productivity",
      description: "Meta-analysis of studies examining the relationship between lifestyle balance and health markers",
      category: "Lifestyle",
      readTime: "10 min read",
      date: "March 18, 2024",
      slug: "work-life-balance"
    },
    {
      id: 3,
      title: "Environmental Factors and Health: A Research Review",
      description: "Comprehensive analysis of how environmental lifestyle choices affect physical and mental wellbeing",
      category: "Lifestyle",
      readTime: "9 min read",
      date: "March 15, 2024",
      slug: "environmental-health"
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
                Lifestyle Research
              </h1>
              <p className="text-xl text-muted-foreground">
                Evidence-based insights on daily habits, routines, and lifestyle choices backed by scientific research
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

export default Lifestyle;