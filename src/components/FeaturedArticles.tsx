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
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Featured Articles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expert insights and practical advice to help you achieve your health goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} to={`/blog/${article.slug}`}>
            <Card 
              className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-muted"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground hover:bg-background">
                  {article.category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 mb-4">
                  {article.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Read Article
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
