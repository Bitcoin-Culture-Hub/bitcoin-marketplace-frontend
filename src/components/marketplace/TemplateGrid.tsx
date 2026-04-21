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
import type { CardTemplate } from "@/hooks/medusa/useTemplates";
import {
  filterMarketplaceTemplates,
  getMarketplaceYearFilterLabel,
  type MarketplaceFilterState,
  type MarketplaceSortOption,
  type MarketplaceFilterType,
  type MarketplaceFilterOption,
} from "@/lib/marketplace-filters";

interface TemplateGridProps {
  templates: CardTemplate[];
  isLoading: boolean;
  isError: boolean;
  seriesOptions: MarketplaceFilterOption[];
  selectedSeries: string[];
  selectedGradingCompanies: string[];
  selectedGrades: string[];
  yearFrom: string;
  yearTo: string;
  availableOnly: boolean;
  onRemoveFilter: (type: MarketplaceFilterType, value: string) => void;
  onClearAllFilters: () => void;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 12;

const TemplateGrid = ({
  templates,
  isLoading,
  isError,
  seriesOptions,
  selectedSeries,
  selectedGradingCompanies,
  selectedGrades,
  yearFrom,
  yearTo,
  availableOnly,
  onRemoveFilter,
  onClearAllFilters,
  searchQuery,
}: TemplateGridProps) => {
  const [sortBy, setSortBy] = useState<MarketplaceSortOption>("floor-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const filterState = useMemo<MarketplaceFilterState>(
    () => ({
      availableOnly,
      searchQuery,
      selectedGrades,
      selectedGradingCompanies,
      selectedSeries,
      sortBy,
      yearFrom,
      yearTo,
    }),
    [
      availableOnly,
      searchQuery,
      selectedGrades,
      selectedGradingCompanies,
      selectedSeries,
      sortBy,
      yearFrom,
      yearTo,
    ]
  );
  const seriesLabelLookup = useMemo(
    () =>
      Object.fromEntries(
        seriesOptions.map((seriesOption) => [seriesOption.value, seriesOption.label])
      ) as Record<string, string>,
    [seriesOptions]
  );

  // Build filter chips
  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    selectedSeries.forEach((s) =>
      chips.push({
        id: `series-${s}`,
        label: seriesLabelLookup[s] ?? s,
        category: "series",
      })
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
    const yearLabel = getMarketplaceYearFilterLabel(yearFrom, yearTo);
    if (yearLabel) {
      chips.push({ id: "year-range", label: yearLabel, category: "year" });
    }
    return chips;
  }, [
    availableOnly,
    selectedGrades,
    selectedGradingCompanies,
    selectedSeries,
    seriesLabelLookup,
    yearFrom,
    yearTo,
  ]);

  const handleRemoveChip = (chipId: string) => {
    if (chipId === "available-only") {
      onRemoveFilter("availability", "available-only");
      return;
    }
    const separatorIndex = chipId.indexOf("-");
    const type = chipId.slice(0, separatorIndex);
    const value = chipId.slice(separatorIndex + 1);

    if (
      type === "series" ||
      type === "grading" ||
      type === "grade" ||
      type === "year"
    ) {
      onRemoveFilter(type, value);
    }
  };

  // ── Filter + sort ────────────────────────────────────────────────────
  const filteredTemplates = useMemo(() => {
    return filterMarketplaceTemplates(templates, filterState);
  }, [filterState, templates]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedSeries,
    selectedGradingCompanies,
    selectedGrades,
    yearFrom,
    yearTo,
    availableOnly,
    sortBy,
  ]);

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
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as MarketplaceSortOption)}
        >
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
