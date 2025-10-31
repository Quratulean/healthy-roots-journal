import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const latestPosts = [
  {
    id: 1,
    title: "5 Morning Habits That Transform Your Health",
    category: "Wellness",
    date: "March 18, 2024",
    slug: "morning-habits-health"
  },
  {
    id: 2,
    title: "The Science of Hydration: How Much Water Do You Really Need?",
    category: "Nutrition",
    date: "March 17, 2024",
    slug: "hydration-science"
  },
  {
    id: 3,
    title: "Strength Training for Beginners: Complete Guide",
    category: "Fitness",
    date: "March 16, 2024",
    slug: "strength-training-beginners"
  },
  {
    id: 4,
    title: "Managing Stress Through Breathing Techniques",
    category: "Mental Health",
    date: "March 14, 2024",
    slug: "breathing-techniques-stress"
  }
];

const LatestPosts = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Latest Posts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our newest health and wellness content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {latestPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="group hover:shadow-md hover:border-primary transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/articles"
            className="text-primary font-medium hover:underline inline-flex items-center gap-2"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
