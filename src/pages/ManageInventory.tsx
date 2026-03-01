import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import CollectionHeader from "@/components/collection/CollectionHeader";

import CollectionStateTabs, { CollectionState } from "@/components/collection/CollectionStateTabs";
import CollectionFilters from "@/components/collection/CollectionFilters";
import CollectionRow, { CollectionTemplate, CopyState } from "@/components/collection/CollectionRow";
import CollectionEmptyState from "@/components/collection/CollectionEmptyState";



// Mock inventory data with proper state structure
const mockTemplates: CollectionTemplate[] = [
  {
    id: "reg-1",
    name: "Satoshi Nakamoto Genesis Card",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#001",
    copies: [
      {
        id: "c1",
        gradingCompany: "PSA",
        grade: "10",
        certNumber: "87654321",
        state: "listed",
        isPublic: true,
        priceBTC: 0.125,
        acceptsOffers: true,
      },
      {
        id: "c2",
        gradingCompany: "PSA",
        grade: "9",
        certNumber: "87654322",
        state: "in_collection",
        isPublic: false,
      },
      {
        id: "c3",
        gradingCompany: "BGS",
        grade: "9.5",
        certNumber: "12345678",
        state: "in_escrow",
        isPublic: true,
        orderId: "order-123",
      },
    ],
  },
  {
    id: "reg-2",
    name: "Hal Finney First Transaction",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#002",
    copies: [
      {
        id: "c4",
        gradingCompany: "PSA",
        grade: "10",
        certNumber: "11223344",
        state: "in_collection",
        isPublic: false,
      },
    ],
  },
  {
    id: "reg-3",
    name: "The Genesis Block",
    series: "Commemorative",
    year: "2024",
    cardNumber: "#001",
    copies: [
      {
        id: "c5",
        gradingCompany: "TAG",
        grade: "10",
        certNumber: "99887766",
        state: "listed",
        isPublic: true,
        priceBTC: 0.089,
        acceptsOffers: false,
      },
      {
        id: "c6",
        gradingCompany: "PSA",
        grade: "9",
        certNumber: "55443322",
        state: "sold",
        isPublic: false,
        soldDate: "Jan 15, 2024",
        soldPriceBTC: 0.075,
      },
    ],
  },
  {
    id: "reg-4",
    name: "Lightning Network Launch",
    series: "Series 3 OPP",
    year: "2024",
    cardNumber: "#015",
    copies: [
      {
        id: "c7",
        gradingCompany: "BGS",
        grade: "10",
        certNumber: "66778899",
        state: "in_collection",
        isPublic: false,
      },
    ],
  },
];

const ManageInventory = () => {
  const { toast } = useToast();

  // State management
  const [activeState, setActiveState] = useState<CollectionState>("in_collection");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [selectedGrader, setSelectedGrader] = useState("all");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Compute counts for each state
  const stateCounts = useMemo(() => {
    const counts = { in_collection: 0, wish_list: 0, listed: 0, in_escrow: 0, sold: 0 };
    mockTemplates.forEach((template) => {
      template.copies.forEach((copy) => {
        counts[copy.state]++;
      });
    });
    return counts;
  }, []);

  // Total counts
  const totalCopies = Object.values(stateCounts).reduce((a, b) => a + b, 0);

  // Extract unique series options
  const seriesOptions = useMemo(
    () => [...new Set(mockTemplates.map((t) => t.series))].sort(),
    []
  );

  // Build active filters for chips
  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; value: string }[] = [];
    if (selectedSeries !== "all") {
      filters.push({ key: "series", label: "Series", value: selectedSeries });
    }
    if (selectedGrader !== "all") {
      filters.push({ key: "grader", label: "Grader", value: selectedGrader });
    }
    if (searchQuery) {
      filters.push({ key: "search", label: "Search", value: searchQuery });
    }
    return filters;
  }, [selectedSeries, selectedGrader, searchQuery]);

  // Filter templates based on active state and filters
  const filteredTemplates = useMemo(() => {
    return mockTemplates
      .map((template) => {
        // Filter copies by state
        let filteredCopies = template.copies.filter(
          (copy) => copy.state === activeState
        );

        // Filter by grader
        if (selectedGrader !== "all") {
          filteredCopies = filteredCopies.filter(
            (copy) => copy.gradingCompany === selectedGrader
          );
        }

        return { ...template, copies: filteredCopies };
      })
      .filter((template) => {
        // Must have at least one copy after filtering
        if (template.copies.length === 0) return false;

        // Filter by series
        if (selectedSeries !== "all" && template.series !== selectedSeries) {
          return false;
        }

        // Filter by search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesTemplate =
            template.name.toLowerCase().includes(query) ||
            template.series.toLowerCase().includes(query) ||
            template.cardNumber.toLowerCase().includes(query);
          const matchesCopy = template.copies.some(
            (copy) =>
              copy.gradingCompany.toLowerCase().includes(query) ||
              copy.grade.toLowerCase().includes(query) ||
              copy.certNumber.includes(query)
          );
          return matchesTemplate || matchesCopy;
        }

        return true;
      });
  }, [activeState, selectedSeries, selectedGrader, searchQuery]);

  const handleClearFilter = (key: string) => {
    if (key === "series") setSelectedSeries("all");
    if (key === "grader") setSelectedGrader("all");
    if (key === "search") setSearchQuery("");
  };

  const handleClearAll = () => {
    setSelectedSeries("all");
    setSelectedGrader("all");
    setSearchQuery("");
  };

  const handleToggleExpand = (templateId: string) => {
    setExpandedRowId((prev) => (prev === templateId ? null : templateId));
  };

  const handleListCopy = (copyId: string) => {
    toast({
      title: "List for Sale",
      description: "Opening listing flow...",
    });
  };

  const handleEditListing = (copyId: string) => {
    toast({
      title: "Edit Listing",
      description: "Opening listing editor...",
    });
  };

  const handlePauseListing = (copyId: string) => {
    toast({
      title: "Listing Paused",
      description: "This card is now hidden from your storefront.",
    });
  };

  const handleToggleVisibility = (copyId: string, isPublic: boolean) => {
    toast({
      title: isPublic ? "Card is now public" : "Card is now private",
      description: isPublic
        ? "This card will appear on your storefront."
        : "This card is hidden from your storefront.",
    });
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "View Order",
      description: `Opening order ${orderId}...`,
    });
  };

  const hasFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <DashboardHeader
          storefrontName="Premium Cards Co"
          isVerified={false}
        />


        {/* Quick Actions */}
        <QuickActions isVerified={false} />

        {/* Collection Header */}
        <CollectionHeader
          totalCopies={totalCopies}
          listedCount={stateCounts.listed}
          inEscrowCount={stateCounts.in_escrow}
          soldCount={stateCounts.sold}
          hasStorefront={true}
        />

        {/* State Tabs */}
        <CollectionStateTabs
          activeState={activeState}
          onStateChange={setActiveState}
          counts={stateCounts}
        />

        {/* Filters */}
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

        {/* Collection Table */}
        <section className="border border-border bg-card">
          {/* Table Header */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-muted/30 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
            <div className="w-4" />
            <div className="flex-1">Card</div>
            <div className="min-w-[180px] text-right">Copies</div>
            <div className="hidden md:block min-w-[160px] text-right">High Grade</div>
            <div className="w-20" />
          </div>

          {/* Rows */}
          {filteredTemplates.length > 0 ? (
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
              hasFilters={hasFilters}
              onClearFilters={handleClearAll}
            />
          )}
        </section>

        {/* Each graded copy tracked note */}
        <p className="text-[10px] text-muted-foreground text-center mt-4">
          Each graded copy is tracked by certification number.
        </p>
      </main>
    </div>
  );
};

export default ManageInventory;
