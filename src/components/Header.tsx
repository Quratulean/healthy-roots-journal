import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "Categories", href: "/#categories" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" role="banner">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group" aria-label="HealthHub Home">
          <div className="relative">
            <img 
              src={logo} 
              alt="HealthHub - Evidence-Based Health & Wellness" 
              className="h-16 w-16 rounded-xl object-cover shadow-lg ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all" 
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-xl font-bold text-foreground">HealthHub</div>
            <div className="text-xs text-muted-foreground">Evidence-Based Wellness</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-4 shadow-sm" aria-label="Subscribe to newsletter">
            <Link to="/newsletter">Subscribe</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col gap-4 mt-8" role="navigation" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-4" aria-label="Subscribe to newsletter">
                <Link to="/newsletter">Subscribe</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
