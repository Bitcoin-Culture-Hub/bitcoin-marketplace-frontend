import { ListingMode } from "./ListingModeSelector";

interface ListingSummaryProps {
  mode: ListingMode;
  askPrice: string;
  minOffer: string;
  offerExpiry: string;
  isActive: boolean;
}

const ListingSummary = ({
  mode,
  askPrice,
  minOffer,
  offerExpiry,
  isActive,
}: ListingSummaryProps) => {
  const getModeLabel = () => {
    switch (mode) {
      case "fixed":
        return "Fixed price only";
      case "offers":
        return "Offers only";
      case "both":
        return "Fixed price + Offers";
    }
  };

  const getExpiryLabel = () => {
    switch (offerExpiry) {
      case "24h":
        return "24 hours";
      case "48h":
        return "48 hours";
      case "7d":
        return "7 days";
      default:
        return offerExpiry;
    }
  };

  const showPrice = mode === "fixed" || mode === "both";
  const showOffers = mode === "offers" || mode === "both";

  return (
    <div className="border border-border bg-card/50 p-4 space-y-4">
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
        Listing Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Mode</span>
          <span className="font-medium">{getModeLabel()}</span>
        </div>

        {showPrice && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ask Price</span>
            <span className="font-mono font-medium">
              {askPrice ? `${askPrice} BTC` : "—"}
            </span>
          </div>
        )}

        {showOffers && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Min Offer</span>
              <span className="font-mono">
                {minOffer ? `${minOffer} BTC` : "Any offer"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Offer Expiry</span>
              <span>{getExpiryLabel()}</span>
            </div>
          </>
        )}

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span
              className={
                isActive ? "text-green-600 font-medium" : "text-amber-600 font-medium"
              }
            >
              {isActive ? "Active" : "Paused"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border text-xs text-muted-foreground">
          <p>Appears on: Marketplace + your storefront</p>
        </div>
      </div>
    </div>
  );
};

export default ListingSummary;
