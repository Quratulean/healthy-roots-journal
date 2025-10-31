import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Search, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import nutritionImage from "@/assets/nutrition-article.jpg";
import fitnessImage from "@/assets/fitness-article.jpg";
import mentalHealthImage from "@/assets/mental-health-article.jpg";

const allArticles = [
  {
    id: 1,
    title: "10 Superfoods That Boost Your Immune System",
    description: "Discover the power of nutrient-rich foods that can strengthen your body's natural defenses.",
    category: "Nutrition",
    readTime: "5 min read",
    image: nutritionImage,
    slug: "superfoods-immune-system",
    date: "March 15, 2024"
  },
  {
    id: 2,
    title: "Building a Sustainable Fitness Routine",
    description: "Learn how to create a workout plan that fits your lifestyle and keeps you motivated long-term.",
    category: "Fitness",
    readTime: "7 min read",
    image: fitnessImage,
    slug: "sustainable-fitness-routine",
    date: "March 12, 2024"
  },
  {
    id: 3,
    title: "Mindfulness Meditation for Stress Relief",
    description: "Simple techniques to reduce anxiety and improve your mental well-being through daily practice.",
    category: "Mental Health",
    readTime: "6 min read",
    image: mentalHealthImage,
    slug: "mindfulness-meditation-stress",
    date: "March 10, 2024"
  },
  {
    id: 4,
    title: "Understanding Macronutrients: A Complete Guide",
    description: "Everything you need to know about proteins, carbs, and fats for optimal health.",
    category: "Nutrition",
    readTime: "8 min read",
    image: nutritionImage,
    slug: "macronutrients-guide",
    date: "March 8, 2024"
  },
  {
    id: 5,
    title: "Home Workout: No Equipment Needed",
    description: "Effective bodyweight exercises you can do anywhere, anytime.",
    category: "Fitness",
    readTime: "5 min read",
    image: fitnessImage,
    slug: "home-workout-guide",
    date: "March 5, 2024"
  },
  {
    id: 6,
    title: "Sleep Hygiene: Better Rest for Better Health",
    description: "Proven strategies to improve your sleep quality and wake up refreshed.",
    category: "Wellness",
    readTime: "6 min read",
    image: mentalHealthImage,
    slug: "sleep-hygiene-guide",
    date: "March 3, 2024"
  }
];

const AllArticles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Nutrition", "Fitness", "Mental Health", "Wellness"];

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              All Articles
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of health and wellness content
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredArticles.map((article) => (
              <Link key={article.id} to={`/blog/${article.slug}`}>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
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
                      <span className="ml-auto">{article.date}</span>
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

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllArticles;
