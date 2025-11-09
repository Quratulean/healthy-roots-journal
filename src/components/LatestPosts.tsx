import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const latestPosts = [
  {
    id: 1,
    title: "Longitudinal Study: Circadian Rhythm Optimization and Biomarker Improvement",
    category: "Wellness",
    date: "March 18, 2024",
    slug: "morning-habits-health"
  },
  {
    id: 2,
    title: "Controlled Trial: Hydration Protocols and Cognitive Performance Metrics",
    category: "Nutrition",
    date: "March 17, 2024",
    slug: "hydration-science"
  },
  {
    id: 3,
    title: "Evidence-Based Progressive Overload: Systematic Review of Resistance Training",
    category: "Fitness",
    date: "March 16, 2024",
    slug: "strength-training-beginners"
  },
  {
    id: 4,
    title: "Clinical Research: Respiratory Modulation and HRV-Based Stress Management",
    category: "Mental Health",
    date: "March 14, 2024",
    slug: "breathing-techniques-stress"
  }
];

const LatestPosts = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-muted/20 to-background" aria-labelledby="latest-heading">
      <div className="container">
        <header className="text-center mb-10 md:mb-12">
          <h2 id="latest-heading" className="font-display text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Recent Research & Insights
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest evidence-based health discoveries and wellness research
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {latestPosts.map((post) => (
            <article key={post.id}>
              <Link to={`/blog/${post.slug}`} aria-label={`Read article: ${post.title}`}>
                <Card className="group hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <Badge variant="outline" className="font-medium">{post.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <time dateTime={post.date}>{post.date}</time>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-xl leading-snug">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/articles"
            className="text-primary font-semibold hover:underline inline-flex items-center gap-2 text-base group"
            aria-label="View all health articles"
          >
            Explore All Articles
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
