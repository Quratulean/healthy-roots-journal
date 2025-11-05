import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    }
  };

  const benefits = [
    {
      icon: Mail,
      title: "Weekly Health Tips",
      description: "Get expert-backed health advice delivered to your inbox every week"
    },
    {
      icon: TrendingUp,
      title: "Latest Research",
      description: "Stay updated with the newest health and wellness research findings"
    },
    {
      icon: Calendar,
      title: "Exclusive Content",
      description: "Access subscriber-only articles and wellness guides"
    },
    {
      icon: CheckCircle,
      title: "No Spam",
      description: "Unsubscribe anytime. We respect your privacy and inbox"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <Mail className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Join Our Newsletter
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get evidence-based health tips, wellness advice, and the latest research 
              delivered straight to your inbox.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <Card className="mb-16">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Subscribe Now</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit">
                    Subscribe
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from us.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card key={benefit.title}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{benefit.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-16 text-center bg-muted/30 p-8 rounded-lg">
              <h2 className="font-display text-2xl font-bold mb-4">What to Expect</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our newsletter arrives every Monday morning with a curated selection of health tips, 
                the latest wellness research, and practical advice you can implement right away. 
                Join over 10,000 subscribers who trust us for reliable health information.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Newsletter;
