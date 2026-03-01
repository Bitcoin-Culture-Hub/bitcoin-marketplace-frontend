import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type StatusFilter = "owned" | "listed" | "wishlist";

interface InventoryLedgerFiltersProps {
  selectedSeries: string;
  onSeriesChange: (series: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedStatuses: StatusFilter[];
  onStatusToggle: (status: StatusFilter) => void;
  seriesOptions: string[];
  yearOptions: string[];
}

const InventoryLedgerFilters = ({
  selectedSeries,
  onSeriesChange,
  selectedYear,
  onYearChange,
  selectedStatuses,
  onStatusToggle,
  seriesOptions,
  yearOptions,
}: InventoryLedgerFiltersProps) => {
  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "owned", label: "Owned" },
    { value: "listed", label: "Listed" },
    { value: "wishlist", label: "Wishlist" },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status Toggle Boxes */}
      <div className="flex items-center gap-1.5">
        {statusOptions.map((status) => {
          const isSelected = selectedStatuses.includes(status.value);
          return (
            <button
              key={status.value}
              onClick={() => onStatusToggle(status.value)}
              className={cn(
                "px-3 py-1.5 text-xs border transition-colors",
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/50"
              )}
            >
              {status.label}
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-border" />

      {/* Series */}
      <Select value={selectedSeries} onValueChange={onSeriesChange}>
        <SelectTrigger className="w-[150px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="All Series" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="all">All Series</SelectItem>
          {seriesOptions.map((series) => (
            <SelectItem key={series} value={series}>
              {series}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-[100px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="All Years" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          <SelectItem value="all">All Years</SelectItem>
          {yearOptions.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InventoryLedgerFilters;
