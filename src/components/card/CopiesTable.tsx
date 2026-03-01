import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, ExternalLink, MapPin, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import CopiesTableFilters, { SortOption } from "./CopiesTableFilters";
import MakeOfferModal from "./MakeOfferModal";

interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerReputation?: number;
  sellerVerified?: boolean;
  grade: string;
  gradingCompany: string;
  certNumber: string;
  priceBTC: number | null;
  priceUSD: number | null;
  acceptsOffers: boolean;
  minOfferBTC?: number;
  shipsFromRegion: string;
  createdAt: Date;
  slabPhotos?: string[];
}

interface CardData {
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  frontImage: string;
}

interface CopiesTableProps {
  listings: Listing[];
  card: CardData;
  onMetricsUpdate?: (metrics: { floorBTC: number | null; availableCount: number; offersAcceptedCount: number }) => void;
}

const CopiesTable = ({ listings, card, onMetricsUpdate }: CopiesTableProps) => {
  const navigate = useNavigate();
  
  // Filter state
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedGradingCompanies, setSelectedGradingCompanies] = useState<string[]>([]);
  const [buyNowOnly, setBuyNowOnly] = useState(false);
  const [offersAccepted, setOffersAccepted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  
  // Expansion state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Modal state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const toggleRowExpansion = (listingId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedGrades([]);
    setSelectedGradingCompanies([]);
    setBuyNowOnly(false);
    setOffersAccepted(false);
  };

  const handleMakeOffer = (listing: Listing) => {
    setSelectedListing(listing);
    setIsOfferModalOpen(true);
  };

  // Filter and sort
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Grade filter
    if (selectedGrades.length > 0) {
      result = result.filter((l) => selectedGrades.includes(l.grade));
    }

    // Grading company filter
    if (selectedGradingCompanies.length > 0) {
      result = result.filter((l) => selectedGradingCompanies.includes(l.gradingCompany));
    }

    // Buy now only
    if (buyNowOnly) {
      result = result.filter((l) => l.priceBTC !== null);
    }

    // Offers accepted
    if (offersAccepted) {
      result = result.filter((l) => l.acceptsOffers);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          if (a.priceBTC === null) return 1;
          if (b.priceBTC === null) return -1;
          return a.priceBTC - b.priceBTC;
        });
        break;
      case "grade-desc":
        result.sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade));
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return result;
  }, [listings, selectedGrades, selectedGradingCompanies, buyNowOnly, offersAccepted, sortBy]);

  // Mask cert number
  const maskCertNumber = (cert: string) => {
    if (cert.length <= 4) return cert;
    return cert.slice(0, 4) + "••••";
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Convert listing to modal format
  const convertListingForModal = (listing: Listing) => ({
    id: listing.id,
    sellerId: listing.sellerId,
    sellerName: listing.sellerName,
    grade: listing.grade,
    gradingCompany: listing.gradingCompany,
    certNumber: listing.certNumber,
    price: listing.priceUSD || 0,
    offersEnabled: listing.acceptsOffers,
  });

  return (
    <div className="space-y-6">
      {/* Table */}
      <div>
        {/* Table */}
        {filteredListings.length === 0 ? (
          <div className="border border-border py-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No copies match your filters.
            </p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="rounded-none"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="border border-border">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border">
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Grade
              </span>
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Price (BTC)
              </span>
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Offers
              </span>
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Seller
              </span>
              <span className="col-span-1 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Ships From
              </span>
              <span className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-[0.1em] text-right">
                Actions
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {filteredListings.map((listing) => (
                <div key={listing.id}>
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="text-xl font-mono font-bold text-foreground">
                        {listing.grade}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">
                        {listing.gradingCompany}
                      </span>
                    </div>
                    <div className="col-span-2">
                      {listing.priceBTC !== null ? (
                        <span className="text-base font-mono font-medium text-foreground">
                          {listing.priceBTC} BTC
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      {listing.acceptsOffers ? (
                        <span className="text-sm text-foreground">
                          Yes
                          {listing.minOfferBTC && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (min {listing.minOfferBTC})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">No</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-foreground truncate block text-left">
                        {listing.sellerName}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-xs text-muted-foreground">
                        {listing.shipsFromRegion}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <Button size="sm" className="bg-foreground text-background text-xs h-8 px-4 rounded-none">
                        Buy Now
                      </Button>
                      {listing.acceptsOffers && (
                        <Button size="sm" variant="outline" className="bg-accent text-accent-foreground border-accent text-xs h-8 px-4 rounded-none">
                          Make Offer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopiesTable;
