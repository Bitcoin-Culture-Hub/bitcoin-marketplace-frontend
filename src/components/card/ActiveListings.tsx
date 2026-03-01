import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface ActiveListingsProps {
  listings: Listing[];
  card?: CardData;
}

const ActiveListings = ({ listings, card }: ActiveListingsProps) => {
  const navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const sortedListings = [...listings].sort((a, b) => a.price - b.price);

  const handleMakeOffer = (listing: Listing) => {
    setSelectedListing(listing);
    setIsOfferModalOpen(true);
  };

  // Default card data if not provided
  const defaultCard: CardData = {
    name: "Satoshi Nakamoto Genesis Card",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#001",
    frontImage: "/placeholder.svg",
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Active Listings
        </h2>
        <span className="text-xs text-muted-foreground">
          {listings.length} available
        </span>
      </div>

      {sortedListings.length === 0 ? (
        <div className="border border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No active listings for this card.
          </p>
        </div>
      ) : (
        <div className="border border-border">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border">
            <span className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Seller
            </span>
            <span className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Grade
            </span>
            <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Price
            </span>
            <span className="col-span-4 text-[10px] text-muted-foreground uppercase tracking-[0.1em] text-right">
              Actions
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {sortedListings.map((listing) => (
              <div
                key={listing.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center"
              >
                {/* Seller */}
                <button
                  onClick={() => navigate(`/store/${listing.sellerId}`)}
                  className="col-span-3 text-sm text-foreground hover:text-primary transition-colors text-left truncate"
                >
                  {listing.sellerName}
                </button>

                {/* Grade */}
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">
                    {listing.gradingCompany}
                  </span>
                  <span className="text-base font-mono font-medium text-foreground">
                    {listing.grade}
                  </span>
                </div>

                {/* Price */}
                <span className="col-span-2 text-base font-mono font-medium text-foreground">
                  ${listing.price.toLocaleString()}
                </span>

                {/* Actions */}
                <div className="col-span-4 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-4 rounded-none"
                  >
                    Buy Now
                  </Button>
                  {listing.offersEnabled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMakeOffer(listing)}
                      className="border-border text-xs h-8 px-4 rounded-none"
                    >
                      Make Offer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {selectedListing && (
        <MakeOfferModal
          open={isOfferModalOpen}
          onOpenChange={setIsOfferModalOpen}
          listing={selectedListing}
          card={card || defaultCard}
        />
      )}
    </section>
  );
};

export default ActiveListings;
