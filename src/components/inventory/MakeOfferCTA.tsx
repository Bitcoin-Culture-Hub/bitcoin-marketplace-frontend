import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MakeOfferCTA = () => {
  return (
    <section className="mb-8">
      <Link 
        to="/marketplace"
        className="block group"
      >
        <div className="border border-border bg-muted/20 hover:bg-muted/40 transition-colors px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80">
                Make an Offer
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse the marketplace and submit offers on graded cards.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </Link>
    </section>
  );
};

export default MakeOfferCTA;
