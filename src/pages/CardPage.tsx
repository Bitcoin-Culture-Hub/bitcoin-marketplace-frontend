import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TemplateImageGallery from "@/components/card/TemplateImageGallery";
import TemplateHeader from "@/components/card/TemplateHeader";
import MarketSummary from "@/components/card/MarketSummary";
import CopiesTable from "@/components/card/CopiesTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/hooks/medusa/useListings";

const CardPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sellerFilter = searchParams.get("seller");

  const { data, isLoading, isError } = useListings(templateId ?? "");

  // Filter listings to a specific seller when coming from a storefront page
  const filteredListings = useMemo(() => {
    if (!data) return [];
    if (!sellerFilter) return data.listings;
    return data.listings.filter((l) => l.sellerId === sellerFilter);
  }, [data, sellerFilter]);

  // Derive market metrics from filtered listings
  const metrics = useMemo(() => {
    const available = filteredListings.filter(
      (l) => l.priceBTC !== null && !l.isSold
    );
    const floorBTC =
      available.length > 0
        ? Math.min(...available.map((l) => l.priceBTC as number))
        : null;
    return {
      floorBTC,
      availableCount: available.length,
      offersAcceptedCount: filteredListings.filter((l) => l.acceptsOffers).length,
    };
  }, [filteredListings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex flex-col">
        <Header variant="light" />
        <div className="max-w-6xl mx-auto px-6 py-8 w-full space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
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

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {sellerFilter ? "Back to Store" : "Back to Marketplace"}
        </button>

        {/* Top section: image + header + market summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <TemplateImageGallery images={template.images} name={template.name} />

          <div className="flex flex-col gap-6">
            <TemplateHeader
              name={template.name}
              series={template.series}
              year={template.year}
              cardNumber={template.cardNumber}
              printRun={template.printRun}
            />
            {template.designNotes && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {template.designNotes}
              </p>
            )}

            <MarketSummary
              floorPriceBTC={metrics.floorBTC}
              availableCount={metrics.availableCount}
              offersAcceptedCount={metrics.offersAcceptedCount}
            />
          </div>
        </div>

        {/* Copies / listings table */}
        <CopiesTable
          listings={filteredListings}
          card={{
            name: template.name,
            series: template.series,
            year: template.year,
            cardNumber: template.cardNumber,
            frontImage: template.images[0] ?? "",
          }}
        />
      </div>
    </div>
  );
};

export default CardPage;
