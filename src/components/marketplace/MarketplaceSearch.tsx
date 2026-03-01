import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MarketplaceSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const MarketplaceSearch = ({ value, onChange, onClear }: MarketplaceSearchProps) => {
  return (
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search card name, set/series, card #, topic…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-10 bg-background border-border text-sm rounded-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MarketplaceSearch;
