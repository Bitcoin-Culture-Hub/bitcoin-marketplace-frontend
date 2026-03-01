import { useState, useMemo, useEffect } from "react";
import { Grid3X3, LayoutGrid } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TemplateTile from "./TemplateTile";
import TemplateTileSkeleton from "./TemplateTileSkeleton";
import FilterChips, { FilterChip } from "./FilterChips";
import MarketplaceSearch from "./MarketplaceSearch";
import { Button } from "@/components/ui/button";

import bitcoinCard1 from "@/assets/bitcoin-card-1.jpg";
import bitcoinCard2 from "@/assets/bitcoin-card-2.jpg";
import bitcoinCard3 from "@/assets/bitcoin-card-3.jpg";

// Mock CardTemplate data with aggregated market signals
const mockTemplates = [
  {
    id: "1",
    name: "Satoshi Nakamoto Genesis Card",
    series: "Series 1 OPP",
    cardNumber: "001",
    image: bitcoinCard1,
    availableCount: 12,
    floorPriceBTC: 1.85,
    offersAcceptedCount: 8,
    isNewSupply: true,
    isLowPop: false,
    newestSupplyAt: new Date("2024-01-28"),
  },
  {
    id: "2",
    name: "Bitcoin Whitepaper Commemorative",
    series: "Commemorative",
    cardNumber: "WP-01",
    image: bitcoinCard2,
    availableCount: 5,
    floorPriceBTC: 2.15,
    offersAcceptedCount: 3,
    isNewSupply: false,
    isLowPop: false,
    newestSupplyAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Hal Finney Tribute Card",
    series: "Series 2 OPP",
    cardNumber: "007",
    image: bitcoinCard3,
    availableCount: 2,
    floorPriceBTC: 0.95,
    offersAcceptedCount: 2,
    isNewSupply: false,
    isLowPop: true,
    newestSupplyAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    name: "Block 0 Genesis Block Card",
    series: "Series 1 OPP",
    cardNumber: "000",
    image: bitcoinCard1,
    availableCount: 8,
    floorPriceBTC: 3.20,
    offersAcceptedCount: 6,
    isNewSupply: true,
    isLowPop: false,
    newestSupplyAt: new Date("2024-01-27"),
  },
  {
    id: "5",
    name: "Lightning Network Launch Card",
    series: "Commemorative",
    cardNumber: "LN-01",
    image: bitcoinCard2,
    availableCount: 0,
    floorPriceBTC: null,
    offersAcceptedCount: 0,
    isNewSupply: false,
    isLowPop: false,
    newestSupplyAt: null,
  },
  {
    id: "6",
    name: "Bitcoin Pizza Day Commemorative",
    series: "Commemorative",
    cardNumber: "PD-01",
    image: bitcoinCard3,
    availableCount: 15,
    floorPriceBTC: 0.42,
    offersAcceptedCount: 10,
    isNewSupply: false,
    isLowPop: false,
    newestSupplyAt: new Date("2024-01-22"),
  },
  {
    id: "7",
    name: "First Bitcoin Transaction Card",
    series: "Series 1 OPP",
    cardNumber: "002",
    image: bitcoinCard1,
    availableCount: 6,
    floorPriceBTC: 1.25,
    offersAcceptedCount: 4,
    isNewSupply: false,
    isLowPop: false,
    newestSupplyAt: new Date("2024-01-18"),
  },
  {
    id: "8",
    name: "El Salvador Legal Tender Card",
    series: "Series 3 OPP",
    cardNumber: "ES-01",
    image: bitcoinCard2,
    availableCount: 1,
    floorPriceBTC: 0.65,
    offersAcceptedCount: 1,
    isNewSupply: true,
    isLowPop: true,
    newestSupplyAt: new Date("2024-01-29"),
  },
  {
    id: "9",
    name: "Bitcoin ATH November 2021 Card",
    series: "Commemorative",
    cardNumber: "ATH-21",
    image: bitcoinCard3,
    availableCount: 0,
    floorPriceBTC: null,
    offersAcceptedCount: 0,
    isNewSupply: false,
    isLowPop: false,
    newestSupplyAt: null,
  },
  {
    id: "10",
    name: "MicroStrategy Acquisition Card",
    series: "Series 4 OPP",
    cardNumber: "MS-01",
    image: bitcoinCard1,
    availableCount: 4,
    floorPriceBTC: 0.88,
    offersAcceptedCount: 2,
    isNewSupply: false,
    isLowPop: false,
    newestSupplyAt: new Date("2024-01-10"),
  },
];

interface TemplateGridProps {
  selectedSeries: string[];
  selectedGradingCompanies: string[];
  selectedGrades: string[];
  availableOnly: boolean;
  onRemoveFilter: (type: string, value: string) => void;
  onClearAllFilters: () => void;
}

const TemplateGrid = ({
  selectedSeries,
  selectedGradingCompanies,
  selectedGrades,
  availableOnly,
  onRemoveFilter,
  onClearAllFilters,
}: TemplateGridProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("floor-asc");
  const [viewDensity, setViewDensity] = useState<"compact" | "comfortable">("comfortable");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Build filter chips
  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    
    selectedSeries.forEach((s) => {
      chips.push({ id: `series-${s}`, label: s, category: "series" });
    });
    
    selectedGradingCompanies.forEach((c) => {
      chips.push({ id: `grading-${c}`, label: c, category: "grading" });
    });
    
    selectedGrades.forEach((g) => {
      chips.push({ id: `grade-${g}`, label: `Grade ${g}`, category: "grade" });
    });
    
    if (availableOnly) {
      chips.push({ id: "available-only", label: "Available only", category: "availability" });
    }
    
    return chips;
  }, [selectedSeries, selectedGradingCompanies, selectedGrades, availableOnly]);

  const handleRemoveChip = (chipId: string) => {
    if (chipId === "available-only") {
      onRemoveFilter("availability", "available-only");
      return;
    }
    
    const [type, ...valueParts] = chipId.split("-");
    const value = valueParts.join("-");
    onRemoveFilter(type, value);
  };

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = [...mockTemplates];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.series.toLowerCase().includes(query) ||
          t.cardNumber.toLowerCase().includes(query)
      );
    }

    // Series filter
    if (selectedSeries.length > 0) {
      result = result.filter((t) => selectedSeries.includes(t.series));
    }

    // Available only filter
    if (availableOnly) {
      result = result.filter((t) => t.availableCount > 0);
    }

    // Sort
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
  }, [searchQuery, selectedSeries, availableOnly, sortBy]);

  const gridCols = viewDensity === "compact" 
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6";

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Row */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <MarketplaceSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 border-border bg-background h-10 text-xs rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floor-asc">Floor: Low to High</SelectItem>
              <SelectItem value="floor-desc">Floor: High to Low</SelectItem>
              <SelectItem value="available">Most Available</SelectItem>
              <SelectItem value="newest">Newest Supply</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Grid Content */}
      <div className="flex-1 p-6">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{filteredTemplates.length}</span> Templates
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={`grid ${gridCols}`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <TemplateTileSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              No templates match your filters
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClearAllFilters}
                className="rounded-none"
              >
                Clear filters
              </Button>
              {availableOnly && (
                <Button
                  variant="outline"
                  onClick={() => onRemoveFilter("availability", "available-only")}
                  className="rounded-none"
                >
                  Show unavailable
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Try searching by set or card #
            </p>
          </div>
        )}

        {/* Template Grid */}
        {!isLoading && filteredTemplates.length > 0 && (
          <div className={`grid ${gridCols}`}>
            {filteredTemplates.map((template) => (
              <TemplateTile key={template.id} {...template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGrid;
