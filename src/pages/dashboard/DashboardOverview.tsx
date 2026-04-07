import { Link } from "react-router-dom";
import { Package, ShoppingCart, MessageSquare, Tag, Plus, Upload, ExternalLink } from "lucide-react";
import { useVendorSummary, useVendorProfile } from "@/hooks/medusa/useVendor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/StatCard";
import PageHeader from "@/components/dashboard/PageHeader";

const DashboardOverview = () => {
  const { data: summaryData, isLoading } = useVendorSummary();
  const { data: vendorData } = useVendorProfile();
  const summary = summaryData?.summary;
  const vendor = vendorData?.vendor;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back${vendor?.name ? `, ${vendor.name}` : ""}`}
        description="Here's an overview of your store's performance."
      />

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Active Listings"
            value={summary?.active_listings ?? 0}
            description="Cards currently listed"
            href="/dashboard/products"
          />
          <StatCard
            icon={Tag}
            label="Sold Cards"
            value={summary?.sold_cards ?? 0}
            description="Total cards sold"
          />
          <StatCard
            icon={ShoppingCart}
            label="Orders"
            value={summary?.total_orders ?? 0}
            description="Total marketplace orders"
            href="/dashboard/orders"
          />
          <StatCard
            icon={MessageSquare}
            label="Offers"
            value={summary?.total_offers ?? 0}
            description="Total offers received"
            href="/dashboard/offers"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-3">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-none gap-2">
            <Link to="/submit">
              <Plus className="h-4 w-4" />
              Add Card
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-none gap-2">
            <Link to="/import">
              <Upload className="h-4 w-4" />
              Bulk Import
            </Link>
          </Button>
          {vendor?.slug && (
            <Button asChild variant="outline" size="sm" className="rounded-none gap-2">
              <Link to={`/marketplace`}>
                <ExternalLink className="h-4 w-4" />
                View Marketplace
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Getting Started / Tips */}
      <div className="border border-border bg-card p-5 space-y-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Getting Started
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">1. Add your cards</p>
            <p className="text-xs text-muted-foreground">
              Submit graded cards individually or use bulk import for large collections.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">2. Set prices & list</p>
            <p className="text-xs text-muted-foreground">
              Set BTC prices and toggle cards to "listed" so buyers can find them.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">3. Manage offers & orders</p>
            <p className="text-xs text-muted-foreground">
              Review incoming offers, accept the best ones, and track order fulfillment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
