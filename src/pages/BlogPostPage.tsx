import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPost from "@/components/BlogPost";
import RelatedPosts from "@/components/RelatedPosts";
import Newsletter from "@/components/Newsletter";
import nutritionImage from "@/assets/nutrition-article.jpg";
import fitnessImage from "@/assets/fitness-article.jpg";
import mentalHealthImage from "@/assets/mental-health-article.jpg";

const blogPosts = {
  "superfoods-immune-system": {
    title: "10 Superfoods That Boost Your Immune System",
    category: "Nutrition",
    author: "Dr. Sarah Johnson",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: nutritionImage,
    content: `
      <p class="lead text-xl text-muted-foreground mb-6">Discover the power of nutrient-rich foods that can strengthen your body's natural defenses and keep you healthy year-round.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Why Superfoods Matter</h2>
      <p class="mb-4">Your immune system is your body's defense mechanism against harmful pathogens, viruses, and bacteria. The foods you eat play a crucial role in supporting and strengthening this complex network of cells and proteins.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Top 10 Immune-Boosting Superfoods</h2>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">1. Citrus Fruits</h3>
      <p class="mb-4">Rich in vitamin C, citrus fruits like oranges, grapefruits, and lemons help increase the production of white blood cells, which are key to fighting infections.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">2. Berries</h3>
      <p class="mb-4">Blueberries, strawberries, and raspberries are packed with antioxidants that protect your cells from damage and reduce inflammation.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">3. Garlic</h3>
      <p class="mb-4">This powerful allium contains compounds that enhance immune function and have antimicrobial properties.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">4. Spinach and Leafy Greens</h3>
      <p class="mb-4">Loaded with vitamin C, beta carotene, and antioxidants, leafy greens support your immune system's ability to fight off infections.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">5. Yogurt with Live Cultures</h3>
      <p class="mb-4">Probiotics in yogurt support gut health, which is closely linked to immune function. Look for products with "live and active cultures."</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">How to Incorporate These Foods</h2>
      <p class="mb-4">Start your day with a smoothie packed with berries and spinach, snack on citrus fruits throughout the day, and incorporate garlic into your evening meals. Consistency is key to reaping the immune-boosting benefits.</p>
      
      <blockquote class="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison." - Ann Wigmore
      </blockquote>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Conclusion</h2>
      <p class="mb-4">While no single food can guarantee protection from illness, incorporating these nutrient-dense superfoods into a balanced diet can significantly support your immune system's ability to keep you healthy.</p>
    `
  },
  "sustainable-fitness-routine": {
    title: "Building a Sustainable Fitness Routine",
    category: "Fitness",
    author: "Mike Thompson",
    date: "March 12, 2024",
    readTime: "7 min read",
    image: fitnessImage,
    content: `
      <p class="lead text-xl text-muted-foreground mb-6">Learn how to create a workout plan that fits your lifestyle and keeps you motivated long-term, without burnout or injury.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">The Problem with Most Fitness Plans</h2>
      <p class="mb-4">Many people start fitness routines with enthusiasm, only to quit within weeks. The issue isn't lack of willpower—it's unsustainable planning.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Key Principles for Sustainability</h2>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Start Small and Build Gradually</h3>
      <p class="mb-4">Don't try to go from zero to hero overnight. Begin with 20-30 minute sessions, 3 times per week, and gradually increase intensity and duration as your fitness improves.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Choose Activities You Enjoy</h3>
      <p class="mb-4">Exercise shouldn't feel like punishment. Whether it's dancing, swimming, hiking, or weightlifting, find movements that bring you joy.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Mix It Up</h3>
      <p class="mb-4">Variety prevents boredom and works different muscle groups. Combine cardio, strength training, flexibility work, and balance exercises throughout your week.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Sample Weekly Routine</h2>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Monday: 30-minute strength training (upper body)</li>
        <li>Tuesday: 20-minute cardio (running, cycling, or swimming)</li>
        <li>Wednesday: Rest or gentle yoga</li>
        <li>Thursday: 30-minute strength training (lower body)</li>
        <li>Friday: 30-minute mixed cardio and bodyweight exercises</li>
        <li>Weekend: Active recovery (walking, hiking, or recreational sports)</li>
      </ul>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Recovery is Just as Important</h2>
      <p class="mb-4">Your body needs time to repair and adapt. Prioritize sleep, proper nutrition, and rest days to prevent burnout and injury.</p>
    `
  },
  "mindfulness-meditation-stress": {
    title: "Mindfulness Meditation for Stress Relief",
    category: "Mental Health",
    author: "Dr. Emily Chen",
    date: "March 10, 2024",
    readTime: "6 min read",
    image: mentalHealthImage,
    content: `
      <p class="lead text-xl text-muted-foreground mb-6">Simple techniques to reduce anxiety and improve your mental well-being through daily mindfulness practice.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Understanding Mindfulness</h2>
      <p class="mb-4">Mindfulness is the practice of being fully present in the moment, aware of your thoughts and feelings without judgment. Research shows it can significantly reduce stress and improve overall mental health.</p>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Getting Started with Meditation</h2>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Find Your Space</h3>
      <p class="mb-4">Choose a quiet, comfortable spot where you won't be disturbed. It doesn't have to be a special meditation room—a corner of your bedroom works perfectly.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Start with 5 Minutes</h3>
      <p class="mb-4">Begin with just 5 minutes daily. As it becomes a habit, gradually increase the duration. Consistency matters more than length.</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Simple Breathing Technique</h3>
      <ol class="list-decimal pl-6 mb-4 space-y-2">
        <li>Sit comfortably with your back straight</li>
        <li>Close your eyes or maintain a soft gaze</li>
        <li>Breathe naturally through your nose</li>
        <li>Focus on the sensation of breath entering and leaving</li>
        <li>When your mind wanders (and it will), gently return focus to your breath</li>
      </ol>
      
      <h2 class="text-2xl font-display font-bold mt-8 mb-4">Benefits You Can Expect</h2>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Reduced anxiety and stress levels</li>
        <li>Improved focus and concentration</li>
        <li>Better emotional regulation</li>
        <li>Enhanced self-awareness</li>
        <li>Improved sleep quality</li>
      </ul>
      
      <p class="mb-4">The key is patience and persistence. Like any skill, mindfulness improves with regular practice.</p>
    `
  }
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = [
    {
      id: 1,
      title: "5 Morning Habits for Better Health",
      category: "Wellness",
      readTime: "4 min read",
      image: nutritionImage,
      slug: "morning-habits-health"
    },
    {
      id: 2,
      title: "Understanding Your Body's Nutritional Needs",
      category: "Nutrition",
      readTime: "6 min read",
      image: fitnessImage,
      slug: "nutritional-needs"
    },
    {
      id: 3,
      title: "Sleep Better: A Complete Guide",
      category: "Wellness",
      readTime: "8 min read",
      image: mentalHealthImage,
      slug: "sleep-guide"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <BlogPost {...post} />
        <RelatedPosts posts={relatedPosts} />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default BlogPostPage;
