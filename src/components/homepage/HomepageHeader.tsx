import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomepageHeader = () => {
  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#trust", label: "Trust" },
  ];

  return (
    <header className="bg-foreground sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Brand */}
          <Link to="/homepage" className="text-sm font-display font-medium text-background">
            Bitcoin Card Market
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-background/60 hover:text-background transition-colors"
            >
              Log in
            </Link>
            <Button asChild size="sm" variant="secondary" className="font-medium">
              <Link to="/login">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomepageHeader;
