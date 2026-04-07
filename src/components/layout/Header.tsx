import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, UserCircle, Wallet } from "lucide-react";

interface HeaderProps {
  variant?: "light" | "dark";
}

const Header = ({ variant = "dark" }: HeaderProps) => {
  const location = useLocation();
  const { customer, logout } = useAuth();
  const { lines, openDrawer } = useCart();
  const isHomepage = location.pathname === "/homepage" || location.pathname === "/";

  const isVerifiedSeller = customer?.metadata?.is_verified_seller === true;

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/storefronts", label: "Storefronts" },
    { href: "/inventory", label: "Inventory" },
    ...(isVerifiedSeller ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const isActive = (href: string) => location.pathname === href;

  if (variant === "light") {
    const lightNavLinks = [
      { href: "/homepage", label: "Home" },
      { href: "/inventory", label: "Inventory" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/storefronts", label: "Storefronts" },
    ];

    return (
      <header className="bg-[#fefefe] sticky top-0 z-50">
        <div className="flex items-center justify-between h-[100px] px-[87px] py-[18px]">
          {/* Logo */}
          <Link
            to="/homepage"
            className="font-['Inter'] font-black text-[24px] text-[#121212] tracking-[0.014em]"
          >
            LOGO
          </Link>

          {/* Center Navigation */}
          <nav className="flex items-center gap-[13px]">
            {lightNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-['Inter'] font-normal text-[16px] text-[#121212] p-[10px] transition-colors ${
                  isActive(link.href) ? "font-medium" : "hover:opacity-70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          {isHomepage && !customer ? (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors hover:opacity-70"
              >
                <UserCircle className="h-5 w-5" strokeWidth={1.5} />
                Account
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors hover:opacity-70"
              >
                <Wallet className="h-5 w-5" strokeWidth={1.5} />
                Wallet
              </Link>
            </div>
          ) : customer ? (
            <div className="flex items-center gap-6">
              <Link
                to="/profile"
                className={`flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors ${
                  location.pathname.startsWith("/profile") ? "font-medium" : "hover:opacity-70"
                }`}
              >
                <UserCircle className="h-5 w-5" strokeWidth={1.5} />
                Account
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors hover:opacity-70"
              >
                <Wallet className="h-5 w-5" strokeWidth={1.5} />
                Wallet
              </Link>
              <button
                type="button"
                onClick={() => openDrawer()}
                className="relative text-[#121212] hover:opacity-70 transition-colors p-1"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {lines.length > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] text-[10px] font-medium bg-[#121212] text-[#fefefe] flex items-center justify-center px-1">
                    {lines.length}
                  </span>
                )}
              </button>
              <button
                onClick={logout}
                className="font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors hover:opacity-70"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors hover:opacity-70"
              >
                <UserCircle className="h-5 w-5" strokeWidth={1.5} />
                Account
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors hover:opacity-70"
              >
                <Wallet className="h-5 w-5" strokeWidth={1.5} />
                Wallet
              </Link>
              <button
                type="button"
                onClick={() => openDrawer()}
                className="relative text-[#121212] hover:opacity-70 transition-colors p-1"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {lines.length > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] text-[10px] font-medium bg-[#121212] text-[#fefefe] flex items-center justify-center px-1">
                    {lines.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>
    );
  }

  // Dark variant — original behavior, unchanged
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
              <Link
                to="/profile"
                className={`text-sm transition-colors ${
                  location.pathname.startsWith("/profile")
                    ? "text-background font-medium"
                    : "text-background/60 hover:text-background"
                }`}
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={() => openDrawer()}
                className="relative text-background/60 hover:text-background transition-colors p-1"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {lines.length > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] text-[10px] font-medium bg-background text-foreground flex items-center justify-center px-1">
                    {lines.length}
                  </span>
                )}
              </button>
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
              <button
                type="button"
                onClick={() => openDrawer()}
                className="relative text-background/60 hover:text-background transition-colors p-1"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {lines.length > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] text-[10px] font-medium bg-background text-foreground flex items-center justify-center px-1">
                    {lines.length}
                  </span>
                )}
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
