import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CardCopy {
  id: string;
  gradingCompany: string;
  grade: string;
  certNumber: string;
  status: "listed" | "private" | "archived";
  acquisitionType: "purchased" | "trade" | "gift";
  listedPrice?: number;
}

export interface InventoryCardDesign {
  id: string;
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  type: "owned" | "wishlist";
  copies?: CardCopy[];
  // For wishlist items
  desiredGrade?: string;
  wishlistNote?: string;
  // Aggregated data
  hasListings?: boolean;
  lowestListedPrice?: number;
}

interface InventoryRowProps {
  card: InventoryCardDesign;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onListCopy?: (copyId: string) => void;
  onArchiveCopy?: (copyId: string) => void;
  onRestoreCopy?: (copyId: string) => void;
  onUpdateWishlist?: (cardId: string, desiredGrade: string, note: string) => void;
}

const InventoryRow = ({
  card,
  isExpanded,
  onToggleExpand,
  onListCopy,
  onArchiveCopy,
  onRestoreCopy,
  onUpdateWishlist,
}: InventoryRowProps) => {
  const isWishlist = card.type === "wishlist";
  const copies = card.copies || [];
  const ownedCount = copies.length;

  // Build ownership summary
  const getOwnershipSummary = () => {
    if (isWishlist) {
      return `Seeking ${card.desiredGrade || "Any"}`;
    }
    if (ownedCount === 0) return "No copies";
    
    // Group by grade
    const gradeGroups: Record<string, number> = {};
    copies.forEach((copy) => {
      const key = `${copy.gradingCompany} ${copy.grade}`;
      gradeGroups[key] = (gradeGroups[key] || 0) + 1;
    });
    
    const gradeSummary = Object.entries(gradeGroups)
      .map(([grade, count]) => `${grade} (${count})`)
      .join(", ");
    
    return `Owns ${ownedCount} ${ownedCount === 1 ? "copy" : "copies"} · ${gradeSummary}`;
  };

  // Build economic signal
  const getEconomicSignal = () => {
    if (isWishlist) return null;
    if (card.hasListings && card.lowestListedPrice) {
      return `Listed from $${card.lowestListedPrice.toLocaleString()}`;
    }
    return "Not listed";
  };

  const statusBadge = (status: CardCopy["status"]) => {
    const variants: Record<CardCopy["status"], { label: string; className: string }> = {
      listed: { label: "Listed", className: "bg-success/10 text-success border-success/20" },
      private: { label: "Private", className: "bg-muted text-muted-foreground border-border" },
      archived: { label: "Archived", className: "bg-muted/50 text-muted-foreground/60 border-border" },
    };
    const v = variants[status];
    return (
      <Badge variant="outline" className={cn("text-[10px] font-normal", v.className)}>
        {v.label}
      </Badge>
    );
  };

  return (
    <div className="border-b border-border">
      {/* Main Row */}
      <div
        onClick={onToggleExpand}
        className="w-full flex items-center gap-4 px-4 py-4 transition-colors text-left cursor-pointer hover:bg-muted/30"
      >
        {/* Expand Icon */}
        <div className="w-4 text-muted-foreground">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>

        {/* Card Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {card.name}
            </span>
            {isWishlist && (
              <Badge variant="outline" className="text-[10px] font-normal bg-muted/50 text-muted-foreground border-border">
                Wishlist
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {card.series} · {card.year} · {card.cardNumber}
          </p>
        </div>

        {/* Ownership Summary */}
        <div className="hidden sm:block text-right min-w-[200px]">
          <p className="text-xs text-foreground">
            {getOwnershipSummary()}
          </p>
        </div>

        {/* Market Signal */}
        <div className="hidden md:block text-right min-w-[140px]">
          {getEconomicSignal() && (
            <p className={cn(
              "text-xs",
              card.hasListings ? "text-foreground" : "text-muted-foreground"
            )}>
              {getEconomicSignal()}
            </p>
          )}
        </div>

        {/* View Action */}
        <div className="w-16 text-right">
          <a 
            href={`/card/${card.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            View
          </a>
        </div>
      </div>

      {/* Expanded Content - Owned Cards */}
      {isExpanded && !isWishlist && (
        <div className="bg-muted/10 border-t border-border/50">
          <div className="divide-y divide-border/50">
            {copies.map((copy) => (
              <div key={copy.id} className="px-4 py-3 flex items-center gap-4 ml-8">
                {/* Grade (anchor) */}
                <div className="min-w-[100px]">
                  <span className="text-sm font-medium">
                    {copy.gradingCompany} {copy.grade}
                  </span>
                </div>

                {/* Cert Number */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Cert #{copy.certNumber}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {copy.acquisitionType.charAt(0).toUpperCase() + copy.acquisitionType.slice(1)}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="min-w-[80px]">
                  {statusBadge(copy.status)}
                </div>

                {/* Listed Price (if applicable) */}
                {copy.status === "listed" && copy.listedPrice && (
                  <div className="min-w-[100px] text-right">
                    <p className="text-sm font-medium">
                      ${copy.listedPrice.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Actions (right-aligned) */}
                <div className="min-w-[80px] text-right">
                  {copy.status === "listed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onListCopy?.(copy.id);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {copy.status === "private" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onListCopy?.(copy.id);
                      }}
                    >
                      List
                    </Button>
                  )}
                  {copy.status === "archived" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestoreCopy?.(copy.id);
                      }}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {copies.length === 0 && (
              <div className="px-4 py-4 ml-8">
                <p className="text-xs text-muted-foreground">No copies recorded.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Content - Wishlist Cards */}
      {isExpanded && isWishlist && (
        <div className="bg-muted/10 border-t border-border/50">
          <div className="px-4 py-4 ml-8 flex items-center gap-6">
            {/* Desired Grade */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Desired Grade:</span>
              <Select 
                defaultValue={card.desiredGrade || "any"}
                onValueChange={(value) => onUpdateWishlist?.(card.id, value, card.wishlistNote || "")}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="PSA 10">PSA 10</SelectItem>
                  <SelectItem value="PSA 9">PSA 9</SelectItem>
                  <SelectItem value="BGS 10">BGS 10</SelectItem>
                  <SelectItem value="BGS 9.5">BGS 9.5</SelectItem>
                  <SelectItem value="SGC 10">SGC 10</SelectItem>
                  <SelectItem value="TAG 10">TAG 10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Note:</span>
              <Input
                defaultValue={card.wishlistNote || ""}
                placeholder="Add a note (optional)"
                className="h-8 text-xs bg-card border-border max-w-[300px]"
                onBlur={(e) => onUpdateWishlist?.(card.id, card.desiredGrade || "any", e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  // Convert to owned
                }}
              >
                Mark as Owned
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  // Remove from wishlist
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryRow;
