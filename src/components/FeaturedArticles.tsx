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
    title: "Peer-Reviewed Study: Phytonutrients and Immune Function",
    description: "Analysis of 47 clinical trials examining how specific plant compounds modulate immune response and reduce inflammatory markers.",
    category: "Nutrition",
    readTime: "8 min read",
    image: nutritionImage,
    slug: "superfoods-immune-system"
  },
  {
    id: 2,
    title: "Meta-Analysis: Exercise Adherence and Long-Term Health Outcomes",
    description: "Systematic review of 156 studies on sustainable exercise protocols and their correlation with metabolic health markers.",
    category: "Fitness",
    readTime: "10 min read",
    image: fitnessImage,
    slug: "sustainable-fitness-routine"
  },
  {
    id: 3,
    title: "Clinical Evidence: Mindfulness-Based Interventions for Stress Reduction",
    description: "Randomized controlled trials demonstrating measurable cortisol reduction and neuroplasticity changes through meditation practices.",
    category: "Mental Health",
    readTime: "9 min read",
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
            Scientific Research & Clinical Studies
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Peer-reviewed research and evidence-based findings from leading academic institutions and medical journals
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
