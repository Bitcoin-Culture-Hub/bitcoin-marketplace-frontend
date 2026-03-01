import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
  activePage: "terms" | "privacy";
}

const LegalPageLayout = ({
  title,
  subtitle,
  lastUpdated,
  sections,
  activePage,
}: LegalPageLayoutProps) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const copyAnchorLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Policy Banner */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <p className="text-xs text-muted-foreground text-center">
            These policies support escrow, verification, and dispute resolution.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to site
        </Button>

        {/* Internal Nav */}
        <nav className="flex items-center gap-4 mb-8 border-b border-border pb-4">
          <Link
            to="/terms"
            className={cn(
              "text-sm font-medium transition-colors",
              activePage === "terms"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Terms
          </Link>
          <Link
            to="/privacy"
            className={cn(
              "text-sm font-medium transition-colors",
              activePage === "privacy"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Privacy
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sticky TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                On this page
              </p>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "block text-left text-sm transition-colors w-full truncate",
                      activeSection === section.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <header className="mb-10">
              <h1 className="text-2xl font-display font-medium mb-2">{title}</h1>
              <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </header>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-4 group">
                    <h2 className="text-lg font-display font-medium">{section.title}</h2>
                    <button
                      onClick={() => copyAnchorLink(section.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      title="Copy link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Bottom Back Button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to site
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPageLayout;
