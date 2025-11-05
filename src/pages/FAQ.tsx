import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Is the health information on this site evidence-based?",
      answer: "Yes, all our content is backed by scientific research and reviewed by certified health professionals. We cite peer-reviewed studies and trusted medical sources."
    },
    {
      question: "Can I use this information to self-diagnose?",
      answer: "No, the information provided is for educational purposes only. Always consult with a qualified healthcare provider for medical advice, diagnosis, or treatment."
    },
    {
      question: "How often is the content updated?",
      answer: "We regularly update our articles to reflect the latest research and medical guidelines. Most articles are reviewed and updated quarterly or when significant new research emerges."
    },
    {
      question: "Can I submit article suggestions or questions?",
      answer: "Absolutely! We welcome topic suggestions and questions from our readers. Please use our contact form to submit your ideas."
    },
    {
      question: "Do you offer personalized health advice?",
      answer: "We provide general health information and education. For personalized advice specific to your health situation, please consult with your healthcare provider."
    },
    {
      question: "How can I subscribe to your newsletter?",
      answer: "You can subscribe to our newsletter by entering your email in the newsletter signup form at the bottom of any page. You'll receive weekly health tips and article updates."
    },
    {
      question: "Are your articles peer-reviewed?",
      answer: "Our content is reviewed by certified health professionals in their respective fields to ensure accuracy and reliability before publication."
    },
    {
      question: "Can I share your articles on social media?",
      answer: "Yes! We encourage sharing our content to help spread evidence-based health information. Use the share buttons on each article."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our health and wellness content
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 p-8 bg-muted/30 rounded-lg text-center">
              <h2 className="font-display text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
