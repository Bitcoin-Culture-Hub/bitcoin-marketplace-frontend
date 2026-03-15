import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { customer, logout } = useAuth();
  const isHomepage = location.pathname === "/homepage" || location.pathname === "/";

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/inventory", label: "Storefront" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/homepage" className="text-sm font-display font-medium text-background">
            Bitcoin Card Market
          </Link>

          {/* Right Navigation */}
          {isHomepage && !customer ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                Log in
              </Link>
              <Button asChild size="sm" variant="secondary" className="font-medium rounded-none">
                <Link to="/login">Sign up</Link>
              </Button>
            </div>
          ) : customer ? (
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-background font-medium"
                      : "text-background/60 hover:text-background"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                Sign out
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-background font-medium"
                      : "text-background/60 hover:text-background"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
