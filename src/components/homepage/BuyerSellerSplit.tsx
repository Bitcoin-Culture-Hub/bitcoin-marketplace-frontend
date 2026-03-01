import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const BuyerSellerSplit = () => {
  return (
    <section className="bg-muted/30 border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* For Sellers / Collectors */}
          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-lg font-medium text-foreground mb-4">
              For Sellers & Collectors
            </h3>
            <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
              <li>Track your collection</li>
              <li>List graded cards with offer rules</li>
              <li>Sell through a verified storefront</li>
            </ul>
            <Button asChild className="w-full font-medium bg-[hsl(25,65%,52%)] hover:bg-[hsl(25,65%,45%)] text-white">
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

export default BuyerSellerSplit;
