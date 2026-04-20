import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Store, ChevronRight } from "lucide-react";
import { listAllVendors, type VendorRecord } from "@/services/store.api";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const StorefrontDirectory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["vendors", "all"],
    queryFn: async () => {
      const res = await listAllVendors();
      return res.vendors;
    },
    staleTime: 60_000,
  });

  const vendors = data ?? [];

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      {/* Hero */}
      <section className="bg-[#fefefe] px-6 py-12">
        <div className="max-w-[1052px] mx-auto text-center">
          <h1 className="text-[32px] font-display font-semibold text-[#121212] tracking-[0.014em]">
            Storefronts
          </h1>
          <p className="text-[16px] text-[#121212]/60 mt-2 max-w-md mx-auto">
            Browse verified sellers and their graded card collections.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="flex-1 px-6 pb-32 lg:pb-48">
        <div className="max-w-[1052px] mx-auto">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[180px] rounded-card" />
              ))}
            </div>
          )}

          {!isLoading && vendors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Store className="h-12 w-12 text-[#121212]/20 mb-4" />
              <h3 className="text-lg font-medium text-[#121212] mb-2">
                No storefronts yet
              </h3>
              <p className="text-sm text-[#121212]/60 max-w-sm">
                Be the first to create a storefront and start selling your graded cards.
              </p>
            </div>
          )}

          {!isLoading && vendors.length > 0 && (
            <>
              <p className="text-[14px] text-[#121212]/60 mb-6">
                {vendors.length} storefront{vendors.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer variant="marketplace" />
    </div>
  );
};

const VendorCard = ({ vendor }: { vendor: VendorRecord }) => (
  <Link
    to={`/store/${vendor.slug}`}
    className="group block p-6 bg-white shadow-card rounded-card transition-all duration-200 hover:shadow-card-hover"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#F7931A]/10 rounded-full flex items-center justify-center shrink-0">
          <Store className="h-5 w-5 text-[#F7931A]" />
        </div>
        <div>
          <h3 className="font-sans font-medium text-[16px] text-[#121212] group-hover:text-[#F7931A] transition-colors">
            {vendor.name}
          </h3>
          <p className="text-[12px] text-[#121212]/60 mt-0.5">
            @{vendor.slug}
          </p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-[#121212]/30 group-hover:text-[#F7931A] transition-colors shrink-0 mt-1" />
    </div>

    <div className="border-t border-[rgba(175,175,175,0.2)] mt-4 pt-4">
      <div className="flex items-center gap-4 text-[12px] text-[#121212]/60">
        {vendor.email && (
          <span className="truncate max-w-[180px]">{vendor.email}</span>
        )}
        <span>
          Joined {new Date(vendor.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  </Link>
);

export default StorefrontDirectory;
