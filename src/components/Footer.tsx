import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Content: [
      { name: "Nutrition", href: "/nutrition" },
      { name: "Fitness", href: "/fitness" },
      { name: "Mental Health", href: "/mental-health" },
      { name: "Wellness", href: "/wellness" },
      { name: "Lifestyle", href: "/lifestyle" },
      { name: "Sleep", href: "/sleep" },
      { name: "Beauty", href: "/beauty" }
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" }
    ],
    Resources: [
      { name: "All Articles", href: "/articles" },
      { name: "Newsletter", href: "/newsletter" },
      { name: "FAQ", href: "/faq" },
      { name: "Support", href: "/support" }
    ],
  };

  return (
    <footer className="bg-muted/40 border-t" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity" aria-label="HealthHub Home">
              <img src={logo} alt="HealthHub Logo" className="h-14 w-14 rounded-xl object-cover shadow-md ring-2 ring-primary/10" />
              <div>
                <div className="font-display text-lg font-bold text-foreground">HealthHub</div>
                <div className="text-xs text-muted-foreground">Evidence-Based Wellness</div>
              </div>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm leading-relaxed">
              Your trusted source for <strong>evidence-based</strong> health and wellness information. 
              Empowering better health decisions through research and expert insights.
            </p>
            <div className="flex gap-4" role="list" aria-label="Social media links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Follow us on LinkedIn">
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
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} HealthHub. All rights reserved. | 
            <span className="hover:text-primary transition-colors ml-1 cursor-pointer">Medical Disclaimer</span> | 
            <span className="hover:text-primary transition-colors ml-1 cursor-pointer">Accessibility Statement</span>
          </p>
          <p className="mt-2 text-xs">
            Information provided is for educational purposes only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
