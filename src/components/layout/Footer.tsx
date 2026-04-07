import { Link } from "react-router-dom";

interface FooterProps {
  variant?: "dark" | "marketplace";
}

const Footer = ({ variant = "dark" }: FooterProps) => {
  if (variant === "marketplace") {
    return (
      <footer className="relative overflow-hidden">
        {/* Dark background with overlay */}
        <div className="bg-[#121212] relative">
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative max-w-[1440px] mx-auto px-[97px] py-[111px]">
            <div className="flex gap-24">
              {/* Brand */}
              <div className="flex flex-col gap-6 max-w-[357px]">
                <span className="text-[70px] font-black leading-none tracking-[0.014em] text-white font-sans">
                  LOGO
                </span>
                <p className="text-base leading-[19px] tracking-[0.014em] text-[#DFDFDF]">
                  Discover, buy, and trade collectible cards worldwide, connecting passionate collectors with trusted sellers in a secure community.
                </p>
              </div>

              {/* My Account */}
              <div className="flex flex-col gap-6">
                <h3 className="text-[20px] font-semibold leading-6 tracking-[0.014em] text-white">
                  My Account
                </h3>
                <nav className="flex flex-col gap-4">
                  <Link to="/marketplace" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Marketplace
                  </Link>
                  <Link to="/inventory" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Storefront
                  </Link>
                  <Link to="/profile" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Collection
                  </Link>
                  <Link to="/dashboard/offers" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Offers & Orders
                  </Link>
                </nav>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-6">
                <h3 className="text-[20px] font-semibold leading-6 tracking-[0.014em] text-white">
                  Resources
                </h3>
                <nav className="flex flex-col gap-4">
                  <Link to="/terms" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Grading
                  </Link>
                  <Link to="/privacy" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Authentication
                  </Link>
                  <Link to="/terms" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Pricing
                  </Link>
                  <a href="mailto:support@bitcoincardmarket.com" className="text-base tracking-[0.014em] text-[#DFDFDF] hover:text-white transition-colors px-2.5 py-2.5">
                    Contact Us
                  </a>
                </nav>
              </div>

              {/* Subscribe */}
              <div className="flex flex-col gap-6">
                <h3 className="text-[20px] font-semibold leading-6 tracking-[0.014em] text-white">
                  Subscribe
                </h3>
                <p className="text-base leading-[19px] tracking-[0.014em] text-[#DFDFDF] max-w-[294px]">
                  Stay updated with the latest drops and marketplace news.
                </p>
                <div className="flex items-center w-[294px] h-12 bg-white/30 backdrop-blur-sm rounded-pill pl-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent text-sm tracking-[0.014em] text-[#d0d0d0]/77 placeholder-[#d0d0d0]/77 outline-none"
                  />
                  <button className="w-12 h-12 bg-btc-orange rounded-full flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.71 20.29L21.04 12.55C21.47 12.36 21.47 11.75 21.04 11.55L3.71 3.82C3.33 3.65 2.91 3.91 2.91 4.32L2.91 9.23C2.91 9.52 3.12 9.77 3.41 9.81L16.41 11.75L3.41 13.69C3.12 13.73 2.91 13.98 2.91 14.27L2.91 19.79C2.91 20.2 3.33 20.46 3.71 20.29Z" fill="white"/>
                    </svg>
                  </button>
                </div>
                {/* Social icons */}
                <div className="flex items-center gap-6 mt-2">
                  {["facebook", "twitter", "reddit", "telegram"].map((social) => (
                    <div key={social} className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-[#121212] rounded-sm" />
                    </div>
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
