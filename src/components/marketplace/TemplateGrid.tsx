import { useState, useMemo, useEffect } from "react";
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
import Pagination from "./Pagination";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/medusa/useTemplates";

interface TemplateGridProps {
  selectedSeries: string[];
  selectedGradingCompanies: string[];
  selectedGrades: string[];
  availableOnly: boolean;
  onRemoveFilter: (type: string, value: string) => void;
  onClearAllFilters: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const ITEMS_PER_PAGE = 12;

const TemplateGrid = ({
  selectedSeries,
  selectedGradingCompanies,
  selectedGrades,
  availableOnly,
  onRemoveFilter,
  onClearAllFilters,
  searchQuery,
  onSearchChange,
}: TemplateGridProps) => {
  const [sortBy, setSortBy] = useState("floor-asc");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Live data from Medusa ─────────────────────────────────────────────
  const { data: allTemplates = [], isLoading, isError } = useTemplates({
    fetchAll: true,
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSeries, selectedGradingCompanies, selectedGrades, availableOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE));
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Sort Bar */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-[20px] font-semibold tracking-[0.014em] text-btc-orange">
            {filteredTemplates.length} Collectibles found
          </span>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[261px] h-[44px] bg-[#fefefe] border-0 rounded-btn text-base tracking-[0.014em] text-[#121212]/70">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-btn">
            <SelectItem value="floor-asc">Floor: Low to High</SelectItem>
            <SelectItem value="floor-desc">Floor: High to Low</SelectItem>
            <SelectItem value="available">Most Available</SelectItem>
            <SelectItem value="newest">Newest Supply</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filterChips.length > 0 && (
        <div className="mb-4">
          <FilterChips chips={filterChips} onRemove={handleRemoveChip} onClearAll={onClearAllFilters} />
        </div>
      )}

      <div className="flex-1">
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-destructive mb-2">Failed to load templates.</p>
            <p className="text-xs text-[#121212]/60">
              Ensure your Medusa backend is running and <code className="bg-[#fafafa] px-1">VITE_MEDUSA_BACKEND_URL</code> is set.
            </p>
          </div>
        )}

        {isLoading && !isError && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[38px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <TemplateTileSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-medium text-[#121212] mb-2">No templates match your filters</h3>
            <p className="text-sm text-[#121212]/60 mb-6 max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClearAllFilters} className="rounded-btn">
                Clear filters
              </Button>
              {availableOnly && (
                <Button variant="outline" onClick={() => onRemoveFilter("availability", "available-only")} className="rounded-btn">
                  Show unavailable
                </Button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !isError && paginatedTemplates.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[38px]">
              {paginatedTemplates.map((template) => (
                <TemplateTile key={template.id} {...template} />
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
    </div>
  );
};

export default TemplateGrid;
