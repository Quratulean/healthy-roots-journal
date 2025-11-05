import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, HelpCircle, Book } from "lucide-react";

const Support = () => {
  const supportOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24-48 hours",
      action: "Contact Us",
      link: "/contact"
    },
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Connect with other readers and share experiences",
      action: "Join Forum",
      link: "#"
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Find quick answers to common questions",
      action: "View FAQ",
      link: "/faq"
    },
    {
      icon: Book,
      title: "Knowledge Base",
      description: "Browse our comprehensive health resources",
      action: "Explore Articles",
      link: "/articles"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Support Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're here to help you find the health information you need
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {supportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card key={option.title}>
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{option.title}</CardTitle>
                      </div>
                      <p className="text-muted-foreground">{option.description}</p>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href={option.link}
                        className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                      >
                        {option.action}
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto bg-muted/30 p-8 rounded-lg">
              <h2 className="font-display text-2xl font-bold mb-4">Important Notice</h2>
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">Medical Emergency:</strong> If you are experiencing a medical emergency, 
                please call your local emergency number immediately. This website does not provide emergency medical services.
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Medical Advice:</strong> The information on this website is for educational 
                purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider 
                about your specific health concerns.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
