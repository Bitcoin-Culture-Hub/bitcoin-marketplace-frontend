import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import footerBg from "@/assets/footer-bg.png";

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const RedditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.71c.147.307.22.64.22.986 0 2.393-2.786 4.332-6.227 4.332-3.44 0-6.227-1.939-6.227-4.332 0-.347.073-.68.22-.986a1.495 1.495 0 01-.468-1.09c0-.832.676-1.508 1.508-1.508.413 0 .787.167 1.058.437a8.552 8.552 0 014.009-1.244l.758-3.566a.367.367 0 01.435-.283l2.517.533a1.044 1.044 0 011.981.467c0 .577-.468 1.044-1.044 1.044a1.044 1.044 0 01-1.038-.95l-2.24-.474-.672 3.16a8.524 8.524 0 013.953 1.239 1.5 1.5 0 011.058-.437c.832 0 1.508.676 1.508 1.508 0 .44-.19.835-.49 1.11zM9.063 14.043c0 .577.468 1.044 1.044 1.044.577 0 1.044-.467 1.044-1.044 0-.577-.467-1.044-1.044-1.044-.576 0-1.044.467-1.044 1.044zm5.891 2.607c-.36.36-1.05.487-2.954.487s-2.593-.127-2.954-.487a.254.254 0 01.36-.36c.253.253 1.007.36 2.594.36s2.34-.107 2.594-.36a.254.254 0 01.36.36zm-.114-1.563c.577 0 1.044-.467 1.044-1.044 0-.577-.467-1.044-1.044-1.044-.577 0-1.044.467-1.044 1.044 0 .577.467 1.044 1.044 1.044z" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

interface FooterProps {
  variant?: "dark" | "marketplace";
}

const Footer = ({ variant = "dark" }: FooterProps) => {
  if (variant === "marketplace") {
    return (
      <footer className="relative overflow-hidden">
        <div className="bg-[#0a0e1a] relative">
          <img src={footerBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[97px] py-16 lg:py-[111px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr] gap-10 lg:gap-16">
              {/* Brand */}
              <div className="flex flex-col gap-5">
                <span className="text-[56px] lg:text-[70px] font-black leading-none tracking-[0.014em] text-white font-sans">
                  CLCT
                </span>
                <p className="text-[15px] leading-relaxed tracking-[0.014em] text-[#DFDFDF]/90 max-w-[320px]">
                  Discover, buy, and trade collectible cards worldwide, connecting passionate collectors with trusted sellers in a secure community.
                </p>
              </div>

              {/* My Account */}
              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold tracking-[0.014em] text-white">
                  My Account
                </h3>
                <nav className="flex flex-col gap-5">
                  <Link to="/inventory" className="text-[15px] tracking-[0.014em] text-[#DFDFDF]/80 hover:text-white transition-colors">
                    Storefront
                  </Link>
                  <Link to="/profile" className="text-[15px] tracking-[0.014em] text-[#DFDFDF]/80 hover:text-white transition-colors">
                    My Profile
                  </Link>
                  <Link to="/create-collection" className="text-[15px] tracking-[0.014em] text-[#DFDFDF]/80 hover:text-white transition-colors">
                    Create Collection
                  </Link>
                </nav>
              </div>

              {/* Subscribe */}
              <div className="flex flex-col gap-5">
                <h3 className="text-lg font-semibold tracking-[0.014em] text-white">
                  Subscribe
                </h3>
                <p className="text-[15px] leading-relaxed tracking-[0.014em] text-[#DFDFDF]/90 max-w-[294px]">
                  Stay updated on new featured collections, and exclusive deals.
                </p>
                <div className="flex items-center max-w-[294px] h-12 bg-white/20 backdrop-blur-sm rounded-full pl-4 border border-white/10">
                  <input
                    type="email"
                    placeholder="user@yourmail.com"
                    className="flex-1 min-w-0 bg-transparent text-sm tracking-[0.014em] text-white/90 placeholder-white/50 outline-none"
                  />
                  <button className="w-12 h-12 bg-btc-orange rounded-full flex items-center justify-center shrink-0 hover:bg-btc-orange/90 transition-colors">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {[
                    { icon: FacebookIcon, href: "#", label: "Facebook" },
                    { icon: XIcon, href: "#", label: "X" },
                    { icon: RedditIcon, href: "#", label: "Reddit" },
                    { icon: TelegramIcon, href: "#", label: "Telegram" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#121212] hover:bg-white/90 transition-colors"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default dark variant (unchanged)
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-display font-medium">
            Bitcoin Card Market
          </div>
          <nav className="flex items-center gap-6 text-xs text-background/60">
            <Link to="/terms" className="hover:text-background transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-background transition-colors">
              Privacy
            </Link>
            <a href="mailto:support@bitcoincardmarket.com" className="hover:text-background transition-colors">
              Contact
            </a>
          </nav>
          <div className="text-xs text-background/40">
            © 2026
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
