import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedArticles from "@/components/FeaturedArticles";
import Categories from "@/components/Categories";
import LatestPosts from "@/components/LatestPosts";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <FeaturedArticles />
        <div id="categories">
          <Categories />
        </div>
        <LatestPosts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
