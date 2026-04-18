import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, Heart, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TemplateImageGallery from "@/components/card/TemplateImageGallery";
import Offers from "@/components/card/Offers";
import MoreFromCollection from "@/components/card/MoreFromCollection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useListings, type Listing } from "@/hooks/medusa/useListings";
import {
  OfferModal,
  type OfferModalCard,
  type OfferModalListing,
} from "@/components/marketplace/OfferModal";

// TODO: Replace with real engagement metrics once the backend tracks
//       likes and views per product/listing. For now these are fixed
//       placeholders that render on every card.
const PLACEHOLDER_LIKE_COUNT = 142;
const PLACEHOLDER_VIEW_COUNT_LABEL = "132.4k";

const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

/** Pick the featured listing: lowest USD price among available copies. */
function pickFeatured(listings: Listing[]): Listing | null {
  const available = listings.filter((l) => !l.isSold);
  if (available.length === 0) return null;

  const withPrice = available.filter((l) => l.priceUSD !== null);
  const pool = withPrice.length > 0 ? withPrice : available;

  return [...pool].sort((a, b) => {
    const ap = a.priceUSD ?? Number.POSITIVE_INFINITY;
    const bp = b.priceUSD ?? Number.POSITIVE_INFINITY;
    return ap - bp;
  })[0];
}

const CardPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sellerFilter = searchParams.get("seller");

  const { data, isLoading, isError } = useListings(templateId ?? "");

  const filteredListings = useMemo(() => {
    if (!data) return [];
    if (!sellerFilter) return data.listings;
    return data.listings.filter((l) => l.sellerId === sellerFilter);
  }, [data, sellerFilter]);

  const featured = useMemo(() => pickFeatured(filteredListings), [filteredListings]);

  const [offerListing, setOfferListingState] = useState<Listing | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);

  /** Mirrors CopiesTable: open the OfferModal for a specific listing. */
  const openOffer = (listing: Listing) => {
    setOfferListingState(listing);
    setOfferOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex flex-col">
        <Header variant="light" />
        <div className="max-w-6xl mx-auto px-6 py-8 w-full space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex flex-col">
        <Header variant="light" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Failed to load card details.</p>
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-none">
              Go back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { template } = data;

  const priceUSD = featured?.priceUSD ?? null;
  const grade = featured?.grade && featured.grade !== "—" ? featured.grade : null;
  const gradingCompany =
    featured?.gradingCompany && featured.gradingCompany !== "—"
      ? featured.gradingCompany
      : null;
  const certNumber =
    featured?.certNumber && featured.certNumber !== "—" ? featured.certNumber : null;

  const availableCount = filteredListings.filter((l) => !l.isSold).length;

  const canBuyNow = !!featured && priceUSD !== null;
  const canMakeOffer = !!featured && featured.acceptsOffers;

  const offerCard: OfferModalCard = {
    name: template.name,
    series: template.series,
    year: template.year,
    cardNumber: template.cardNumber,
    frontImage: template.images[0] ?? "",
  };

  const offerModalListing: OfferModalListing | null = offerListing
    ? {
        id: offerListing.id,
        sellerId: offerListing.sellerId,
        sellerName: offerListing.sellerName,
        grade: offerListing.grade,
        gradingCompany: offerListing.gradingCompany,
        certNumber: offerListing.certNumber,
        priceUsd: offerListing.priceUSD ?? 0,
        acceptsOffers: offerListing.acceptsOffers,
      }
    : null;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: template.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Listing URL copied to clipboard." });
    } catch {
      // user dismissed share sheet — no-op
    }
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {sellerFilter ? "Back to Store" : "Back to Marketplace"}
        </button>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-32 lg:mb-40">
          <TemplateImageGallery images={template.images} name={template.name} />

          <div className="flex flex-col">
            {/* Engagement row */}
            <div className="flex items-center gap-2 mb-5">
              <button
                type="button"
                aria-label="Like"
                className="h-10 pl-3 pr-4 rounded-full border border-gray-200 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
              >
                <Heart className="h-[18px] w-[18px] text-gray-600" strokeWidth={1.75} />
                <span className="text-sm font-medium text-gray-700">
                  {PLACEHOLDER_LIKE_COUNT}
                </span>
              </button>

              <button
                type="button"
                aria-label="Views"
                className="h-10 pl-3 pr-4 rounded-full border border-gray-200 flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-default"
              >
                <Eye className="h-[18px] w-[18px] text-gray-600" strokeWidth={1.75} />
                <span className="text-sm font-medium text-gray-700">
                  {PLACEHOLDER_VIEW_COUNT_LABEL}
                </span>
              </button>

              <button
                type="button"
                aria-label="Share"
                onClick={handleShare}
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-[18px] w-[18px] text-gray-600" strokeWidth={1.75} />
              </button>
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-gray-900 leading-[1.05] tracking-tight text-4xl md:text-5xl lg:text-[56px] mb-5">
              {template.name}
            </h1>

            {/* Pills row — USD + grader/grade + cert */}
            <div className="flex flex-wrap items-center gap-2 mb-7">
              {priceUSD !== null && (
                <span className="h-9 px-4 rounded-lg border border-gray-200 text-gray-800 text-sm font-semibold inline-flex items-center">
                  {formatCurrency(priceUSD)}
                </span>
              )}
              {grade && (
                <span className="h-9 px-4 rounded-xl border border-gray-400 text-gray-800 text-sm font-semibold inline-flex items-center">
                  {gradingCompany ? `${gradingCompany} - ${grade}` : grade}
                </span>
              )}
              {certNumber && (
                <span className="text-sm text-gray-400 ml-1">
                  Cert #{certNumber}
                </span>
              )}
            </div>

            {/* About */}
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              About This Card
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-[520px]">
              {template.designNotes ||
                "No description available for this card."}
            </p>

            {/* Social proof */}
            {availableCount > 0 && (
              <div className="inline-flex w-fit items-center gap-3 pl-2 pr-5 h-12 rounded-full border border-gray-200 bg-white mb-6">
                <div className="flex -space-x-2">
                  {["#fbbf24", "#f97316", "#ef4444"].map((bg, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-semibold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {["A", "B", "C"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-700">
                  {availableCount} {availableCount === 1 ? "person" : "people"}{" "}
                  listed similar card
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 mt-2 max-w-[420px]">
              <Button
                className="w-full h-12 rounded-2xl bg-btc-orange hover:bg-btc-orange/90 text-white font-medium text-base shadow-none"
                disabled={!featured}
                onClick={() => {
                  toast({
                    title: "Checkout coming soon",
                    description: "Direct purchase is not yet available.",
                  });
                }}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-btc-orange text-btc-orange hover:bg-btc-orange/5 hover:text-btc-orange font-medium text-base bg-white"
                disabled={!canMakeOffer}
                onClick={() => featured && openOffer(featured)}
              >
                Make Offer
              </Button>
            </div>
          </div>
        </div>


        {/* Offers from available listings */}
        <div className="mb-32 lg:mb-40">
          <Offers
            listings={filteredListings}
            onBuyNow={() => {
              toast({
                title: "Checkout coming soon",
                description: "Direct purchase is not yet available.",
              });
            }}
            onMakeOffer={(listing) => openOffer(listing)}
            onExploreMore={() => navigate("/marketplace")}
          />
        </div>

        {/* More from the same Medusa collection (series) */}
        <div className="mb-32 lg:mb-38">
          <MoreFromCollection
            collectionId={template.collectionId}
            series={template.series}
            currentTemplateId={template.id}
          />
        </div>
      </div>
      {offerModalListing && (
        <OfferModal
          open={offerOpen}
          onOpenChange={(o) => {
            setOfferOpen(o);
            if (!o) setOfferListingState(null);
          }}
          listing={offerModalListing}
          card={offerCard}
        />
      )}
    <Footer variant="marketplace"/>
    </div>
  );
};

export default CardPage;
