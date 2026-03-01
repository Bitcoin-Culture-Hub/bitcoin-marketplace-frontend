import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HomepageHero = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Primary Headline */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6">
            Bitcoin Collectibles Marketplace
            <span className="block text-muted-foreground">Graded Only. Escrow Backed.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
            Browse a clean catalog by card template. Make offers backed by Bitcoin escrow. 
            Sell through verified storefronts.
          </p>

          {/* Primary CTA */}
          <div className="mb-6">
            <Button asChild size="lg" className="font-medium bg-[hsl(25,65%,52%)] hover:bg-[hsl(25,65%,45%)] text-white">
              <Link to="/verify">
                Create Storefront
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
