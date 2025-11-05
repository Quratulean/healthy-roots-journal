import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Users, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Evidence-Based",
      description: "All our content is backed by scientific research and expert knowledge"
    },
    {
      icon: Target,
      title: "Practical",
      description: "We focus on actionable advice you can implement in your daily life"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community of health-conscious individuals"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the highest quality health information"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              About HealthHub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make evidence-based health and wellness information 
              accessible to everyone, empowering you to make informed decisions about your wellbeing.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In a world filled with conflicting health advice, we cut through the noise to deliver 
                clear, science-backed guidance. Our team of certified health professionals is dedicated 
                to helping you achieve your wellness goals through practical, sustainable approaches.
              </p>
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className="text-center">
                    <CardHeader>
                      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Expert Articles</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
                <p className="text-muted-foreground">Monthly Readers</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Newsletter Subscribers</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
