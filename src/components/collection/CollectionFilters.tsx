import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface CollectionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSeries: string;
  onSeriesChange: (series: string) => void;
  selectedGrader: string;
  onGraderChange: (grader: string) => void;
  seriesOptions: string[];
  activeFilters: ActiveFilter[];
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
}

const CollectionFilters = ({
  searchQuery,
  onSearchChange,
  selectedSeries,
  onSeriesChange,
  selectedGrader,
  onGraderChange,
  seriesOptions,
  activeFilters,
  onClearFilter,
  onClearAll,
}: CollectionFiltersProps) => {
  return (
    <div className="space-y-3">
      {/* Search + Filters Row */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by template, set, card #, grader, grade, cert #…"
            className="pl-9 pr-9 h-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="pl-2 pr-1 py-1 text-xs font-normal gap-1"
            >
              {filter.label}: {filter.value}
              <button
                onClick={() => onClearFilter(filter.key)}
                className="ml-1 hover:bg-background/50 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-muted-foreground"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionFilters;
