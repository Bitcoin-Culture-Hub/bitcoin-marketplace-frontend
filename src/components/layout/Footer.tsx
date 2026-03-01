import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="text-sm font-display font-medium">
            Bitcoin Card Market
          </div>

          {/* Links */}
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

          {/* Copyright */}
          <div className="text-xs text-background/40">
            © 2026
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
