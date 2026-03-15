import { useState, useMemo } from "react";
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
import { useTemplates } from "@/hooks/medusa/useTemplates";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("floor-asc");
  const [viewDensity] = useState<"compact" | "comfortable">("comfortable");

  // ── Live data from Medusa ─────────────────────────────────────────────
  const { data: allTemplates = [], isLoading, isError } = useTemplates({
    limit: 100,
    availableOnly,
  });

  // Build filter chips
  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    selectedSeries.forEach((s) =>
      chips.push({ id: `series-${s}`, label: s, category: "series" })
    );
    selectedGradingCompanies.forEach((c) =>
      chips.push({ id: `grading-${c}`, label: c, category: "grading" })
    );
    selectedGrades.forEach((g) =>
      chips.push({ id: `grade-${g}`, label: `Grade ${g}`, category: "grade" })
    );
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
    onRemoveFilter(type, valueParts.join("-"));
  };

  // ── Filter + sort ────────────────────────────────────────────────────
  const filteredTemplates = useMemo(() => {
    let result = [...allTemplates];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.series.toLowerCase().includes(q) ||
          t.cardNumber.toLowerCase().includes(q)
      );
    }

    if (selectedSeries.length > 0) {
      result = result.filter((t) => selectedSeries.includes(t.series));
    }

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
  }, [allTemplates, searchQuery, selectedSeries, sortBy]);

  const gridCols =
    viewDensity === "compact"
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6";

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Row */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <MarketplaceSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
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

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{filteredTemplates.length}</span> Templates
          </span>
        </div>

        {filterChips.length > 0 && (
          <FilterChips chips={filterChips} onRemove={handleRemoveChip} onClearAll={onClearAllFilters} />
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-destructive mb-2">Failed to load templates.</p>
            <p className="text-xs text-muted-foreground">
              Ensure your Medusa backend is running and <code className="bg-muted px-1">VITE_MEDUSA_BACKEND_URL</code> is set.
            </p>
          </div>
        )}

        {isLoading && !isError && (
          <div className={`grid ${gridCols}`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <TemplateTileSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No templates match your filters</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClearAllFilters} className="rounded-none">
                Clear filters
              </Button>
              {availableOnly && (
                <Button variant="outline" onClick={() => onRemoveFilter("availability", "available-only")} className="rounded-none">
                  Show unavailable
                </Button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !isError && filteredTemplates.length > 0 && (
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
