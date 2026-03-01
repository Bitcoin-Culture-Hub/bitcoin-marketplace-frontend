import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import MakeOfferModal from "./MakeOfferModal";

interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  grade: string;
  gradingCompany: string;
  certNumber: string;
  price: number;
  offersEnabled: boolean;
}

interface CardData {
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  frontImage: string;
}

interface CardActionPanelProps {
  lowestListing: Listing | null;
  allListings: Listing[];
  card: CardData;
  totalSalesCount: number;
}

const CardActionPanel = ({
  lowestListing,
  allListings,
  card,
  totalSalesCount,
}: CardActionPanelProps) => {
  const navigate = useNavigate();
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Price Section */}
      {lowestListing ? (
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-muted-foreground">Listed from:</span>
            <span className="text-3xl font-display font-medium text-foreground">
              ${lowestListing.price.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">
              {allListings.length} listing{allListings.length !== 1 ? "s" : ""} available
            </span>
          </div>
        </div>
      ) : (
        <div>
          <span className="text-muted-foreground">No active listings</span>
        </div>
      )}

      {/* Grading Info */}
      {lowestListing && (
        <div className="flex items-center gap-3 py-4 border-y border-border">
          <span className="text-[10px] font-mono text-muted-foreground border border-border px-2 py-1">
            {lowestListing.gradingCompany}
          </span>
          <span className="text-lg font-mono font-medium text-foreground">
            {lowestListing.grade}
          </span>
          <span className="text-sm text-muted-foreground ml-auto">
            Cert #{lowestListing.certNumber}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {lowestListing && (
          <>
            <Button
              className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background font-display font-medium text-sm uppercase tracking-wider rounded-none"
            >
              Buy Now
            </Button>
            <Button
              onClick={() => setIsOfferModalOpen(true)}
              className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-medium text-sm uppercase tracking-wider rounded-none"
            >
              Make Offer
            </Button>
          </>
        )}
        <Button
          variant="outline"
          className="w-full h-12 border-border text-sm rounded-none"
        >
          <Heart className="h-4 w-4 mr-2" strokeWidth={1.5} />
          Add to Wishlist
        </Button>
      </div>

      {/* Sales History Link */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-2">Sales History:</p>
        <p className="text-sm text-muted-foreground mb-4">
          View recent sales history and market data for this card.
        </p>
        <Button
          variant="outline"
          className="w-full h-12 border-border text-sm rounded-none justify-between"
        >
          <span>View Sales History</span>
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {totalSalesCount} recorded transaction{totalSalesCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* All Listings */}
      {allListings.length > 1 && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-4">All Listings:</p>
          <div className="space-y-3">
            {allListings.slice(0, 4).map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-4 p-4 border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/store/${listing.sellerId}`)}
              >
                {/* Card Image Thumbnail */}
                <div className="w-16 h-20 flex-shrink-0 border border-border overflow-hidden bg-muted/30">
                  <img
                    src={card.frontImage}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Grade Info */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">
                    {listing.gradingCompany}
                  </span>
                  <span className="text-lg font-mono font-medium text-foreground">{listing.grade}</span>
                </div>
                
                {/* Price & Seller */}
                <div className="text-right">
                  <span className="text-base font-mono font-medium text-foreground block">
                    ${listing.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {listing.sellerName}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {allListings.length > 4 && (
            <button className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all {allListings.length} listings →
            </button>
          )}
        </div>
      )}

      {/* Card Description */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">About this Card</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          First edition commemorating Bitcoin's anonymous creator. This card from the {card.series} features premium holographic printing and is part of a limited production run. Each graded copy has been authenticated and encapsulated by a professional grading service.
        </p>
      </div>

      {/* Make Offer Modal */}
      {lowestListing && (
        <MakeOfferModal
          open={isOfferModalOpen}
          onOpenChange={setIsOfferModalOpen}
          listing={lowestListing}
          card={card}
        />
      )}
    </div>
  );
};

export default CardActionPanel;
