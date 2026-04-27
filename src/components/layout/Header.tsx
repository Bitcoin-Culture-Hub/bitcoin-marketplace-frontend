import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Bell, Menu, Search, ShoppingBag, UserCircle } from "lucide-react";

interface HeaderProps {
  variant?: "light" | "dark";
}

const CATEGORY_LINKS = [
  { label: "Historical Artifacts", href: "" },
  { label: "Mining Hardware", href: "" },
  { label: "Event Memorabilia", href: "" },
  { label: "Wearable Goods", href: "" },
  { label: "Games & Toys", href: "" },
  { label: "Digital Property", href: "" },
  { label: "Trading Cards", href: "/marketplace?category=trading-cards" },
  { label: "Physical Bitcoin", href: "" },
  { label: "Fine Art", href: "" },
  { label: "Digital Art", href: "" },
  { label: "Rare Sats", href: "" },
  { label: "Print Media", href: "" },
];

const Header = ({ variant = "dark" }: HeaderProps) => {
  const location = useLocation();
  const { customer, logout } = useAuth();
  const { lines, openDrawer } = useCart();
  const isHomepage = location.pathname === "/homepage" || location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const isVerifiedSeller = customer?.metadata?.is_verified_seller === true;

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/storefronts", label: "Storefronts" },
    { href: "/inventory", label: "Inventory" },
    ...(isVerifiedSeller ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const isActive = (href: string) => location.pathname === href;

  if (variant === "light") {
    const menuLinks = [
      { href: "/marketplace", label: "Marketplace" },
      { href: "/inventory", label: "Inventory" },
      { href: "/storefronts", label: "Storefront" },
      ...(isVerifiedSeller ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    ];

    const conveyorItems = [...CATEGORY_LINKS, ...CATEGORY_LINKS];

    return (
      <header className="bg-[#fefefe] sticky top-0 z-50 border-b border-[#121212]/10">
        <div className="flex items-center justify-between h-[60px] px-6 lg:px-[87px]">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="text-[#121212] hover:opacity-70 transition-opacity p-1"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-[#fefefe] border-r border-[#121212]/10 flex flex-col gap-0 p-0"
              >
                <div className="px-8 pt-10 pb-8 border-b border-[#121212]/10">
                  <span className="font-['Inter'] font-normal text-[24px] text-[#121212]">
                    CLCT
                  </span>
                </div>
                <nav className="flex flex-col px-8 py-6 gap-1">
                  {menuLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={`font-['Inter'] text-[18px] text-[#121212] py-3 transition-opacity ${
                          isActive(link.href) ? "opacity-100 font-medium" : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                {customer && (
                  <div className="mt-auto px-8 py-6 border-t border-[#121212]/10 flex flex-col gap-1">
                    <SheetClose asChild>
                      <Link
                        to="/profile"
                        className="font-['Inter'] text-[16px] text-[#121212] py-2 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        Profile
                      </Link>
                    </SheetClose>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="font-['Inter'] text-[16px] text-[#121212] py-2 text-left opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Link
              to="/homepage"
              className="font-display font-normal text-[20px] text-[#121212] shrink-0"
            >
              CLCT
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-5">
            <Link
              to="/homepage#newsletter"
              onClick={(e) => {
                if (location.pathname === "/homepage") {
                  e.preventDefault()
                  document
                    .getElementById("newsletter")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }}
              className="hidden sm:block font-extralight text-[13px] text-[#121212] opacity-70 hover:opacity-100 transition-opacity"
            >
              Sell With Us
            </Link>

            {customer ? (
              <Link
                to="/profile"
                className="flex items-center gap-1.5 font-['Inter'] font-normal text-[12px] text-[#121212] px-3 py-1.5 border border-[#121212]/30 rounded-full opacity-70 hover:opacity-100 hover:border-[#919191] transition-[opacity,border-color,background-color] duration-300 ease-in-out"
              >
                <UserCircle className="h-4 w-4" strokeWidth={1.5} />
                Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 font-['Inter'] font-normal text-[12px] text-[#000000] px-4 py-1.5 border border-[#121212]/30 rounded-full opacity-70 hover:opacity-100 hover:border-[#919191] transition-[opacity,border-color,background-color] duration-300 ease-in-out"
              >
                <UserCircle className="h-4 w-4" strokeWidth={1.5} />
                Log In or Sign Up
              </Link>
            )}

            <button
              type="button"
              aria-label="Search"
              className="text-[#121212] hover:opacity-70 transition-opacity p-1"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => openDrawer()}
              className="relative text-[#121212] hover:opacity-70 transition-opacity p-1"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              {lines.length > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-[16px] h-[16px] text-[10px] font-medium bg-[#121212] text-[#fefefe] flex items-center justify-center px-1 rounded-full">
                  {lines.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category conveyor belt */}
        <div
          className="group relative overflow-hidden border-t border-[#121212]/10 py-3"
          aria-label="Browse categories"
        >
          <div
            className="flex w-max animate-marquee gap-10 whitespace-nowrap group-hover:[animation-play-state:paused]"
          >
            {conveyorItems.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                to={item.href}
                className="font-['Inter'] font-normal text-[12px] text-[#121212] opacity-70 hover:opacity-100 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
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
