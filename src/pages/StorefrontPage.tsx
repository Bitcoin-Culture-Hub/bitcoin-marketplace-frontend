import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Store, ArrowLeft } from "lucide-react";
import { getVendorBySlug, type VendorRecord } from "@/services/store.api";
import { getCardImages } from "@/services/cardImageLookup";
import { listAllStoreProducts } from "@/services/medusa-products";
import type { CardTemplate } from "@/hooks/medusa/useTemplates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TemplateTile from "@/components/marketplace/TemplateTile";
import TemplateTileSkeleton from "@/components/marketplace/TemplateTileSkeleton";
import Pagination from "@/components/marketplace/Pagination";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ITEMS_PER_PAGE = 12;

function toCardTemplate(product: any): CardTemplate {
  const variants: any[] = product.variants ?? [];

  const availableVariants = variants.filter((v) => {
    const vm = v.metadata ?? {};
    const sold = vm.is_sold === true || vm.sold === true || vm.state === "sold";
    return !sold;
  });

  const prices = availableVariants
    .map((v) => v.metadata?.price_btc as number | undefined)
    .filter((p): p is number => typeof p === "number");
  const floorPriceBTC = prices.length > 0 ? Math.min(...prices) : null;

  const availableCount = availableVariants.length;

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newestVariantDate = variants.reduce<Date | null>((latest, v) => {
    const d = v.created_at ? new Date(v.created_at) : null;
    if (!d) return latest;
    return !latest || d > latest ? d : latest;
  }, null);
  const isNewSupply = newestVariantDate
    ? newestVariantDate.getTime() > sevenDaysAgo
    : false;

  const isLowPop = availableCount > 0 && availableCount < 3;

  const offersAcceptedCount = variants.filter(
    (v) => v.metadata?.accepts_offers === true
  ).length;

  const series =
    (product.collection?.title as string) ??
    (product.metadata?.series_name as string) ??
    "—";
  const cardNumber =
    (product.metadata?.card_number as string) ?? product.handle ?? "—";

  const meta = product.metadata ?? {};
  let image = product.thumbnail ?? "";
  let backImage: string | null = null;

  const imgMatch = getCardImages(product.title, cardNumber, series);
  if (imgMatch) {
    image = imgMatch.frontImageThumb;
    backImage = imgMatch.backImageThumb;
  } else if (meta.front_image_thumb) {
    image = meta.front_image_thumb as string;
    backImage = (meta.back_image_thumb as string) || null;
  }

  return {
    id: product.id,
    name: product.title,
    series,
    cardNumber,
    image,
    backImage,
    availableCount,
    floorPriceBTC,
    offersAcceptedCount,
    isNewSupply,
    isLowPop,
    newestSupplyAt: newestVariantDate,
  };
}

const StorefrontPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState("floor-asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vendor
  const {
    data: vendorData,
    isLoading: vendorLoading,
    isError: vendorError,
  } = useQuery<VendorRecord | null>({
    queryKey: ["vendor", "slug", slug],
    queryFn: async () => {
      const res = await getVendorBySlug(slug!);
      return res.vendor;
    },
    enabled: !!slug,
  });

  const vendor = vendorData ?? null;
  const sellerId = vendor?.seller_id;

  // Fetch products that have at least one variant from this seller.
  // Scope variant stats (price, count) to this seller's variants only.
  const { data: allTemplates = [], isLoading: productsLoading } = useQuery({
    queryKey: ["storefront-products", sellerId],
    queryFn: async () => {
      const products = await listAllStoreProducts({
        fields:
          "id,title,handle,thumbnail,collection.*,metadata,variants.*,variants.prices.*",
      });

      // Scope each product's variants to this seller only, keep products with matches
      const scoped = (products as any[])
        .map((p) => ({
          ...p,
          variants: (p.variants ?? []).filter(
            (v: any) => v.metadata?.seller_id === sellerId
          ),
        }))
        .filter((p) => p.variants.length > 0);

      return scoped.map(toCardTemplate);
    },
    enabled: !!sellerId,
    staleTime: 30_000,
  });

  // Sort
  const sortedTemplates = useMemo(() => {
    const result = [...allTemplates];
    switch (sortBy) {
      case "floor-asc":
        result.sort((a, b) => {
          if (a.floorPriceBTC === null) return 1;
          if (b.floorPriceBTC === null) return -1;
          return a.floorPriceBTC - b.floorPriceBTC;
        });
        break;
      case "floor-desc":
        result.sort((a, b) => {
          if (a.floorPriceBTC === null) return 1;
          if (b.floorPriceBTC === null) return -1;
          return b.floorPriceBTC - a.floorPriceBTC;
        });
        break;
      case "available":
        result.sort((a, b) => b.availableCount - a.availableCount);
        break;
      case "newest":
        result.sort((a, b) => {
          if (!a.newestSupplyAt) return 1;
          if (!b.newestSupplyAt) return -1;
          return b.newestSupplyAt.getTime() - a.newestSupplyAt.getTime();
        });
        break;
    }
    return result;
  }, [allTemplates, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTemplates.length / ITEMS_PER_PAGE)
  );
  const paginatedTemplates = sortedTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isLoading = vendorLoading || productsLoading;

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      {/* Back link */}
      <div className="max-w-[1052px] mx-auto w-full px-6 pt-6">
        <Link
          to="/storefronts"
          className="inline-flex items-center gap-1.5 text-[14px] text-[#121212]/60 hover:text-[#121212] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Storefronts
        </Link>
      </div>

      {/* Vendor Header */}
      <section className="px-6 py-8">
        <div className="max-w-[1052px] mx-auto">
          {vendorLoading ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ) : vendorError || !vendor ? (
            <div className="text-center py-20">
              <Store className="h-12 w-12 text-[#121212]/20 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-[#121212] mb-2">
                Storefront not found
              </h2>
              <p className="text-sm text-[#121212]/60">
                This store doesn't exist or has been removed.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F7931A]/10 rounded-full flex items-center justify-center shrink-0">
                <Store className="h-7 w-7 text-[#F7931A]" />
              </div>
              <div>
                <h1 className="text-[24px] font-display font-semibold text-[#121212] tracking-[0.014em]">
                  {vendor.name}
                </h1>
                <p className="text-[14px] text-[#121212]/60">
                  @{vendor.slug} · Member since{" "}
                  {new Date(vendor.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cards Grid */}
      {vendor && (
        <section className="flex-1 px-6 pb-16">
          <div className="max-w-[1052px] mx-auto">
            {/* Sort bar */}
            <div className="flex items-center justify-between py-4 border-t border-[rgba(175,175,175,0.2)]">
              <span className="text-[20px] font-semibold tracking-[0.014em] text-btc-orange">
                {sortedTemplates.length} Collectible
                {sortedTemplates.length !== 1 ? "s" : ""} for sale
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[261px] h-[44px] bg-[#fefefe] border-0 rounded-btn text-base tracking-[0.014em] text-[#121212]/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-btn">
                  <SelectItem value="floor-asc">Floor: Low to High</SelectItem>
                  <SelectItem value="floor-desc">
                    Floor: High to Low
                  </SelectItem>
                  <SelectItem value="available">Most Available</SelectItem>
                  <SelectItem value="newest">Newest Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[38px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <TemplateTileSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && sortedTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-lg font-medium text-[#121212] mb-2">
                  No cards listed yet
                </h3>
                <p className="text-sm text-[#121212]/60 max-w-sm">
                  This seller hasn't listed any cards for sale yet. Check back
                  later.
                </p>
              </div>
            )}

            {/* Cards */}
            {!isLoading && paginatedTemplates.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[38px]">
                  {paginatedTemplates.map((template) => (
                    <TemplateTile key={template.id} {...template} sellerFilter={sellerId} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-14">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      <Footer variant="marketplace" />
    </div>
  );
};

export default StorefrontPage;
