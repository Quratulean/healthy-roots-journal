import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedArticles from "@/components/FeaturedArticles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Beauty = () => {
  const articles = [
    {
      id: 1,
      title: "Dermatological Research: Evidence-Based Skincare Ingredients",
      description: "Clinical trials and peer-reviewed studies on active ingredients and their efficacy in skin health",
      category: "Beauty",
      readTime: "11 min read",
      date: "March 22, 2024",
      slug: "skincare-ingredients"
    },
    {
      id: 2,
      title: "UV Protection and Skin Aging: Longitudinal Study Results",
      description: "30-year research on sun exposure, photoaging, and protective measures backed by dermatological data",
      category: "Beauty",
      readTime: "9 min read",
      date: "March 20, 2024",
      slug: "uv-protection-aging"
    },
    {
      id: 3,
      title: "Collagen and Skin Elasticity: Meta-Analysis of Clinical Studies",
      description: "Systematic review examining collagen supplementation and topical application effects on skin structure",
      category: "Beauty",
      readTime: "10 min read",
      date: "March 17, 2024",
      slug: "collagen-skin-health"
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
                Beauty & Dermatology Research
              </h1>
              <p className="text-xl text-muted-foreground">
                Scientific evidence on skincare, cosmetic ingredients, and dermatological health from clinical studies
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

export default Beauty;