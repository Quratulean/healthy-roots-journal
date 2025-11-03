import { Heart, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Content: ["Nutrition", "Fitness", "Mental Health", "Wellness"],
    Company: ["About Us", "Contact", "Privacy Policy", "Terms of Service"],
    Resources: ["Blog", "Newsletter", "FAQ", "Support"],
  };

  return (
    <footer className="bg-muted/40 border-t" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity" aria-label="HealthHub Home">
              <Heart className="h-6 w-6 text-primary fill-primary" aria-hidden="true" />
              <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HealthHub
              </span>
            </a>
            <p className="text-muted-foreground mb-4 max-w-sm leading-relaxed">
              Your trusted source for <strong>evidence-based</strong> health and wellness information. 
              Empowering better health decisions through research and expert insights.
            </p>
            <div className="flex gap-4" role="list" aria-label="Social media links">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on LinkedIn">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-labelledby={`footer-${category.toLowerCase()}`}>
              <h3 id={`footer-${category.toLowerCase()}`} className="font-semibold mb-4 text-foreground">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} HealthHub. All rights reserved. | 
            <a href="#" className="hover:text-primary transition-colors ml-1">Medical Disclaimer</a> | 
            <a href="#" className="hover:text-primary transition-colors ml-1">Accessibility Statement</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
