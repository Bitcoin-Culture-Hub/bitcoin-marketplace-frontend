import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Bell, Search, ShoppingBag, UserCircle } from "lucide-react";

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
      { href: "/marketplace", label: "Marketplace" },
      { href: "/storefronts", label: "Storefronts" },
      {href: "/inventory", label: "Inventory"},
    ];

    return (
      <header className="bg-[#fefefe] sticky top-0 z-50">
        <div className="flex items-center justify-between h-[100px] px-[87px] py-[18px]">
          {/* Logo */}
          <Link
            to="/homepage"
            className="font-['Inter'] font-black text-[24px] text-[#121212] tracking-[0.014em] shrink-0"
          >
            LOGO
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-[13px]">
            {lightNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-['Inter'] font-normal text-[16px] text-[#121212] p-[10px] transition-colors ${
                  isActive(link.href) ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Right Side */}
          <div className="flex items-center gap-5">
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#121212]/60" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search"
                className="w-[270px] h-9 pl-9 pr-4 bg-transparent border border-[#121212]/60 rounded-full text-sm text-[#121212] placeholder-[#121212]/40 outline-none focus:border-[#121212]/30 transition-colors"
              />
            </div>
          {customer ? (
            <div className="flex items-center gap-6">
              <Link
                to="/profile"
                className={`flex items-center gap-2 font-['Inter'] font-normal text-[16px] text-[#121212] transition-colors ${
                  location.pathname.startsWith("/profile") ? "font-medium" : "hover:opacity-70"
                }`}
              >
                <UserCircle className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                className="relative text-[#121212] hover:opacity-70 transition-colors p-1"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </button>
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
              </Link>
              <button
                type="button"
                className="relative text-[#121212] hover:opacity-70 transition-colors p-1"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </button>
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
          <Link to="/homepage" className="text-sm font-display font-medium text-background shrink-0">
            Bitcoin Card Market
          </Link>

          {/* Search + Right Navigation */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-background/40" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search"
                className="w-[18px] h-8 pl-9 pr-4 bg-transparent border border-background/20 rounded-full text-xs text-background placeholder-background/40 outline-none focus:border-background/30 transition-colors"
              />
            </div>
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
                      ? "text-background"
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
                    ? "text-background"
                    : "text-background/60 hover:text-background"
                }`}
              >
                Profile
              </Link>
              <button
                type="button"
                className="relative text-background/60 hover:text-background transition-colors p-1"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </button>
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
                className="relative text-background/60 hover:text-background transition-colors p-1"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </button>
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
      </div>
    </header>
  );
};

export default Header;
