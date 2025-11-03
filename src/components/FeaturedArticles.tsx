import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import nutritionImage from "@/assets/nutrition-article.jpg";
import fitnessImage from "@/assets/fitness-article.jpg";
import mentalHealthImage from "@/assets/mental-health-article.jpg";

const articles = [
  {
    id: 1,
    title: "10 Superfoods That Boost Your Immune System",
    description: "Discover the power of nutrient-rich foods that can strengthen your body's natural defenses.",
    category: "Nutrition",
    readTime: "5 min read",
    image: nutritionImage,
    slug: "superfoods-immune-system"
  },
  {
    id: 2,
    title: "Building a Sustainable Fitness Routine",
    description: "Learn how to create a workout plan that fits your lifestyle and keeps you motivated long-term.",
    category: "Fitness",
    readTime: "7 min read",
    image: fitnessImage,
    slug: "sustainable-fitness-routine"
  },
  {
    id: 3,
    title: "Mindfulness Meditation for Stress Relief",
    description: "Simple techniques to reduce anxiety and improve your mental well-being through daily practice.",
    category: "Mental Health",
    readTime: "6 min read",
    image: mentalHealthImage,
    slug: "mindfulness-meditation-stress"
  },
];

const FeaturedArticles = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20" aria-labelledby="featured-heading">
      <div className="container">
        <header className="text-center mb-10 md:mb-12">
          <h2 id="featured-heading" className="font-display text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Research-Backed Articles
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Evidence-based insights reviewed by health experts to support your wellness journey
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {articles.map((article) => (
            <article key={article.id}>
              <Link to={`/blog/${article.slug}`} aria-label={`Read article: ${article.title}`}>
                <Card 
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border h-full hover:border-primary/50"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={article.image} 
                      alt={`${article.category} - ${article.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <Badge className="absolute top-4 left-4 bg-background/95 text-foreground hover:bg-background shadow-sm">
                      {article.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <time>{article.readTime}</time>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors line-clamp-2 text-xl">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4 text-base">
                      {article.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                      Read Full Article
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
