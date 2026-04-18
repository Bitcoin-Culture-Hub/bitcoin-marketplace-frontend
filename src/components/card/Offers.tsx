import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/hooks/medusa/useListings";

interface OffersProps {
  listings: Listing[];
  /** Called when a row's "Buy Now" button is clicked. */
  onBuyNow?: (listing: Listing) => void;
  /** Called when a row's "Make Offer" button is clicked. */
  onMakeOffer?: (listing: Listing) => void;
  /** Called when the "Explore More" link is clicked. */
  onExploreMore?: () => void;
  /** Max rows to show. Defaults to 4 to match the design. */
  limit?: number;
}

// TODO: Replace with real seller avatar URLs when the backend stores them
//       on customer / seller metadata. For now we generate a deterministic
//       colored circle + initial from the seller name so every seller has
//       a stable placeholder avatar.
const AVATAR_PALETTE = [
  "#fca5a5", // red-300
  "#fbbf24", // amber-400
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
  "#fb923c", // orange-400
  "#22d3ee", // cyan-400
];

const hashString = (s: string) =>
  s.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);

const pickAvatarColor = (seed: string) =>
  AVATAR_PALETTE[hashString(seed) % AVATAR_PALETTE.length];

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "?";
};

const formatPriceUSD = (priceBTC: number | null, priceUSD: number | null) => {
  if (priceUSD !== null) {
    return priceUSD.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });
  }
  // Fallback: display the BTC value with a $ sign so the UI stays in USD.
  // Conversion to real USD happens when BTC pricing is wired up end-to-end.
  if (priceBTC !== null) return `$${priceBTC} USD`;
  return "—";
};

const Offers = ({
  listings,
  onBuyNow,
  onMakeOffer,
  onExploreMore,
  limit = 4,
}: OffersProps) => {
  const rows = useMemo(() => {
    return listings
      .filter((l) => !l.isSold)
      .slice(0, limit);
  }, [listings, limit]);

  if (rows.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
          Offers
        </h2>
        {onExploreMore && (
          <button
            type="button"
            onClick={onExploreMore}
            className="text-sm font-semibold text-btc-orange hover:underline"
          >
            Explore More
          </button>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-4 px-2 pb-3 border-b border-gray-100">
        <span className="col-span-3 text-xs text-gray-400 font-medium">Name</span>
        <span className="col-span-2 text-xs text-gray-400 font-medium">Grade</span>
        <span className="col-span-2 text-xs text-gray-400 font-medium">
          Price (USD)
        </span>
        <span className="col-span-2 text-xs text-gray-400 font-medium">
          Location
        </span>
        <span className="col-span-3 text-xs text-gray-400 font-medium text-right">
          Actions
        </span>
      </div>

      {/* Rows */}
      <div>
        {rows.map((listing) => {
          const avatarColor = pickAvatarColor(listing.sellerId || listing.sellerName);
          const avatarInitials = initials(listing.sellerName);

          const hasBuyNow =
            listing.priceBTC !== null || listing.priceUSD !== null;
          const showBuy = hasBuyNow && typeof onBuyNow === "function";
          const showOffer =
            listing.acceptsOffers && typeof onMakeOffer === "function";

          return (
            <div
              key={listing.id}
              className="grid grid-cols-12 gap-4 px-2 py-4 items-center border-b border-gray-100 last:border-b-0"
            >
              {/* Seller */}
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                  style={{ backgroundColor: avatarColor }}
                  aria-hidden="true"
                >
                  {avatarInitials}
                </div>
                <span className="text-sm text-gray-900 font-medium truncate">
                  {listing.sellerName}
                </span>
              </div>

              {/* Grade */}
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900">
                  {listing.grade}
                </span>
                {listing.gradingCompany && listing.gradingCompany !== "—" && (
                  <span className="inline-flex items-center h-6 px-2 rounded-md border border-gray-200 text-[11px] font-semibold text-gray-600">
                    {listing.gradingCompany}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="col-span-2">
                <span className="text-sm text-gray-700 font-medium">
                  {formatPriceUSD(listing.priceBTC, listing.priceUSD)}
                </span>
              </div>

              {/* Location */}
              <div className="col-span-2">
                <span className="text-sm text-gray-600">
                  {listing.shipsFromRegion && listing.shipsFromRegion !== "—"
                    ? listing.shipsFromRegion
                    : "—"}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                {showBuy && (
                  <Button
                    size="sm"
                    className="h-8 px-4 rounded-full bg-btc-orange hover:bg-btc-orange/90 text-white text-xs font-semibold shadow-none"
                    onClick={() => onBuyNow!(listing)}
                  >
                    Buy Now
                  </Button>
                )}
                {showOffer && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-4 rounded-full border-btc-orange text-btc-orange hover:bg-btc-orange/5 hover:text-btc-orange text-xs font-semibold bg-white"
                    onClick={() => onMakeOffer!(listing)}
                  >
                    Make Offer
                  </Button>
                )}
                {!showBuy && !showOffer && (
                  <span className="text-xs text-gray-400">Unavailable</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Offers;
