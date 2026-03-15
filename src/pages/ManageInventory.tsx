import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import CollectionHeader from "@/components/collection/CollectionHeader";
import CollectionStateTabs, { CollectionState } from "@/components/collection/CollectionStateTabs";
import CollectionFilters from "@/components/collection/CollectionFilters";
import CollectionRow from "@/components/collection/CollectionRow";
import CollectionEmptyState from "@/components/collection/CollectionEmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory, useUpdateVariantMeta } from "@/hooks/medusa/useInventory";
import { useAuth } from "@/context/AuthContext";
import { useIsVerifiedSeller } from "@/hooks/medusa/useVerification";

const ManageInventory = () => {
  const { toast } = useToast();
  const { customer } = useAuth();
  const isVerified = useIsVerifiedSeller(customer);

  // ── Live data ───────────────────────────────────────────────────────────
  const { data: templates = [], isLoading } = useInventory();
  const { mutateAsync: updateVariant } = useUpdateVariantMeta();

  // ── UI state ────────────────────────────────────────────────────────────
  const [activeState, setActiveState] = useState<CollectionState>("in_collection");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedGrader, setSelectedGrader] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Counts per state
  const stateCounts = useMemo(() => {
    const allCopies = templates.flatMap((t) => t.copies);
    return {
      in_collection: allCopies.filter((c) => c.state === "in_collection").length,
      wish_list: allCopies.filter((c) => c.state === "wish_list").length,
      listed: allCopies.filter((c) => c.state === "listed").length,
      in_escrow: allCopies.filter((c) => c.state === "in_escrow").length,
      sold: allCopies.filter((c) => c.state === "sold").length,
    };
  }, [templates]);

  const totalCopies = templates.flatMap((t) => t.copies).length;

  // Series options for filter
  const seriesOptions = useMemo(
    () => [...new Set(templates.map((t) => t.series))],
    [templates]
  );

  // Active filters list — must match ActiveFilter {key, label, value}
  const activeFilters = useMemo(() => {
    const f: { key: string; label: string; value: string }[] = [];
    if (selectedSeries) f.push({ key: "series", label: selectedSeries, value: selectedSeries });
    if (selectedGrader) f.push({ key: "grader", label: selectedGrader, value: selectedGrader });
    return f;
  }, [selectedSeries, selectedGrader]);

  const handleClearFilter = (key: string) => {
    if (key === "series") setSelectedSeries("");
    if (key === "grader") setSelectedGrader("");
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedSeries("");
    setSelectedGrader("");
  };

  const handleToggleExpand = (id: string) =>
    setExpandedRowId((prev) => (prev === id ? null : id));

  // ── Filtered templates ──────────────────────────────────────────────────
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    result = result
      .map((t) => ({
        ...t,
        copies: t.copies.filter((c) => c.state === activeState),
      }))
      .filter((t) => t.copies.length > 0);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.series.toLowerCase().includes(q) ||
          t.cardNumber.toLowerCase().includes(q) ||
          t.copies.some((c) => c.certNumber.toLowerCase().includes(q))
      );
    }

    if (selectedSeries) {
      result = result.filter((t) => t.series === selectedSeries);
    }

    if (selectedGrader) {
      result = result
        .map((t) => ({
          ...t,
          copies: t.copies.filter((c) => c.gradingCompany === selectedGrader),
        }))
        .filter((t) => t.copies.length > 0);
    }

    return result;
  }, [templates, activeState, searchQuery, selectedSeries, selectedGrader]);

  // ── Action handlers ─────────────────────────────────────────────────────
  const handleListCopy = async (copyId: string) => {
    try {
      await updateVariant({ variantId: copyId, metadata: { state: "listed", listed: true, is_public: true } });
      toast({ title: "Listed", description: "Copy is now visible on the marketplace." });
    } catch {
      toast({ title: "Error", description: "Failed to list copy.", variant: "destructive" });
    }
  };

  const handleEditListing = (copyId: string) => {
    toast({ title: "Edit listing", description: `Opening editor for ${copyId}…` });
  };

  const handlePauseListing = async (copyId: string) => {
    try {
      await updateVariant({ variantId: copyId, metadata: { state: "in_collection", listed: false, is_public: false } });
      toast({ title: "Listing paused", description: "Copy moved back to private collection." });
    } catch {
      toast({ title: "Error", description: "Failed to pause listing.", variant: "destructive" });
    }
  };

  const handleToggleVisibility = async (copyId: string, isPublic: boolean) => {
    try {
      await updateVariant({ variantId: copyId, metadata: { is_public: !isPublic } });
      toast({ title: isPublic ? "Hidden" : "Visible", description: isPublic ? "Copy is now private." : "Copy is now public." });
    } catch {
      toast({ title: "Error", description: "Failed to update visibility.", variant: "destructive" });
    }
  };

  const handleViewOrder = (orderId: string) => {
    toast({ title: "View Order", description: `Opening order ${orderId}…` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <DashboardHeader
          storefrontName={
            (customer?.metadata?.storefront_name as string) ?? customer?.first_name ?? "My Store"
          }
          isVerified={isVerified}
        />

        <QuickActions isVerified={isVerified} />

        <CollectionHeader
          totalCopies={totalCopies}
          listedCount={stateCounts.listed}
          inEscrowCount={stateCounts.in_escrow}
          soldCount={stateCounts.sold}
          hasStorefront={isVerified}
        />

        <CollectionStateTabs
          activeState={activeState}
          onStateChange={setActiveState}
          counts={stateCounts}
        />

        <div className="py-4">
          <CollectionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSeries={selectedSeries}
            onSeriesChange={setSelectedSeries}
            selectedGrader={selectedGrader}
            onGraderChange={setSelectedGrader}
            seriesOptions={seriesOptions}
            activeFilters={activeFilters}
            onClearFilter={handleClearFilter}
            onClearAll={handleClearAll}
          />
        </div>

        <section className="border border-border bg-card">
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-muted/30 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
            <div className="w-4" />
            <div className="flex-1">Card</div>
            <div className="min-w-[180px] text-right">Copies</div>
            <div className="hidden md:block min-w-[160px] text-right">High Grade</div>
            <div className="w-20" />
          </div>

          {isLoading ? (
            <div className="space-y-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-border">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              ))}
            </div>
          ) : filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <CollectionRow
                key={template.id}
                template={template}
                isExpanded={expandedRowId === template.id}
                onToggleExpand={() => handleToggleExpand(template.id)}
                onListCopy={handleListCopy}
                onEditListing={handleEditListing}
                onPauseListing={handlePauseListing}
                onToggleVisibility={handleToggleVisibility}
                onViewOrder={handleViewOrder}
              />
            ))
          ) : (
            <CollectionEmptyState
              state={activeState}
              hasFilters={activeFilters.length > 0}
              onClearFilters={handleClearAll}
            />
          )}
        </section>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          Each graded copy is tracked by certification number.
        </p>
      </main>
    </div>
  );
};

export default ManageInventory;
