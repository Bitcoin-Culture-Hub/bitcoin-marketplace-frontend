import { X } from "lucide-react";

export interface FilterChip {
  id: string;
  label: string;
  category: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const FilterChips = ({ chips, onRemove, onClearAll }: FilterChipsProps) => {
  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onRemove(chip.id)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border text-xs text-foreground hover:bg-muted/80 transition-colors group"
        >
          <span>{chip.label}</span>
          <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
};

export default FilterChips;
