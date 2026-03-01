import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ListingMode = "fixed" | "offers" | "both";

interface ListingModeSelectorProps {
  value: ListingMode;
  onChange: (mode: ListingMode) => void;
}

const modes: { value: ListingMode; label: string; description: string }[] = [
  {
    value: "fixed",
    label: "Fixed price only",
    description: "Buyer can purchase immediately at your ask.",
  },
  {
    value: "both",
    label: "Fixed price + Offers",
    description: "Buyers can buy now or place an escrow-backed offer.",
  },
];

const ListingModeSelector = ({ value, onChange }: ListingModeSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
        Listing Mode
      </h3>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as ListingMode)}
        className="space-y-2"
      >
        {modes.map((mode) => (
          <label
            key={mode.value}
            className={cn(
              "flex items-start gap-3 p-4 border border-border bg-card/30 cursor-pointer transition-colors",
              value === mode.value && "border-foreground bg-card"
            )}
          >
            <RadioGroupItem value={mode.value} id={mode.value} className="mt-0.5" />
            <div className="flex-1">
              <Label
                htmlFor={mode.value}
                className="text-sm font-medium cursor-pointer"
              >
                {mode.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mode.description}
              </p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ListingModeSelector;
