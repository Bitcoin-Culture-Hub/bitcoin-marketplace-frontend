import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Header from "@/components/layout/Header";
import TemplateImageGallery from "@/components/card/TemplateImageGallery";
import TemplateHeader from "@/components/card/TemplateHeader";
import MarketSummary from "@/components/card/MarketSummary";
import CopiesTable from "@/components/card/CopiesTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListings } from "@/hooks/medusa/useListings";

const CardPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useListings(templateId ?? "");

  // Derive market metrics from live listings
  const metrics = useMemo(() => {
    if (!data) return { floorBTC: null, availableCount: 0, offersAcceptedCount: 0 };
    const available = data.listings.filter((l) => l.priceBTC !== null);
    const floorBTC =
      available.length > 0
        ? Math.min(...available.map((l) => l.priceBTC as number))
        : null;
    return {
      floorBTC,
      availableCount: available.length,
      offersAcceptedCount: data.listings.filter((l) => l.acceptsOffers).length,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
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

  const { template, listings } = data;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Marketplace
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
          listings={listings}
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
