import { ChevronDown, ChevronRight, Lock, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type CopyState = "in_collection" | "wish_list" | "listed" | "in_escrow" | "sold";

export interface CollectionCopy {
  id: string;
  gradingCompany: string;
  grade: string;
  certNumber: string;
  state: CopyState;
  isPublic: boolean;
  priceBTC?: number;
  acceptsOffers?: boolean;
  orderId?: string;
  soldDate?: string;
  soldPriceBTC?: number;
}

export interface CollectionTemplate {
  id: string;
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  copies: CollectionCopy[];
}

interface CollectionRowProps {
  template: CollectionTemplate;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onListCopy?: (copyId: string) => void;
  onEditListing?: (copyId: string) => void;
  onPauseListing?: (copyId: string) => void;
  onToggleVisibility?: (copyId: string, isPublic: boolean) => void;
  onViewOrder?: (orderId: string) => void;
}

const CollectionRow = ({
  template,
  isExpanded,
  onToggleExpand,
  onListCopy,
  onEditListing,
  onPauseListing,
  onToggleVisibility,
  onViewOrder,
}: CollectionRowProps) => {
  const copies = template.copies;
  const copyCount = copies.length;

  // State summary
  const inCollectionCount = copies.filter((c) => c.state === "in_collection").length;
  const listedCount = copies.filter((c) => c.state === "listed").length;
  const inEscrowCount = copies.filter((c) => c.state === "in_escrow").length;

  const getStateSummary = () => {
    const parts: string[] = [];
    if (listedCount > 0) parts.push(`${listedCount} listed`);
    if (inEscrowCount > 0) parts.push(`${inEscrowCount} in escrow`);
    if (inCollectionCount > 0) parts.push(`${inCollectionCount} private`);
    return parts.join(" · ");
  };

  // Grade summary
  const getGradeSummary = () => {
    const gradeGroups: Record<string, number> = {};
    copies.forEach((copy) => {
      const key = `${copy.gradingCompany} ${copy.grade}`;
      gradeGroups[key] = (gradeGroups[key] || 0) + 1;
    });
    return Object.entries(gradeGroups)
      .slice(0, 3)
      .map(([grade, count]) => (count > 1 ? `${grade} (${count})` : grade))
      .join(", ");
  };

  const copyStateBadge = (state: CopyState) => {
    const variants: Record<CopyState, { label: string; className: string }> = {
      in_collection: {
        label: "Private",
        className: "bg-muted text-muted-foreground border-border",
      },
      wish_list: {
        label: "Wish List",
        className: "bg-muted text-muted-foreground border-border",
      },
      listed: {
        label: "Listed",
        className: "bg-green-50 text-green-700 border-green-200",
      },
      in_escrow: {
        label: "In Escrow",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      sold: {
        label: "Sold",
        className: "bg-muted/50 text-muted-foreground/60 border-border",
      },
    };
    const v = variants[state];
    return (
      <Badge variant="outline" className={cn("text-[10px] font-normal", v.className)}>
        {v.label}
      </Badge>
    );
  };

  const maskCert = (cert: string) => {
    if (cert.length <= 4) return cert;
    return `${cert.slice(0, 4)}••••`;
  };

  return (
    <div className="border-b border-border">
      {/* Template Row */}
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

        {/* Template Identity */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{template.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {template.series} · {template.year} · {template.cardNumber}
          </p>
        </div>

        {/* Copies */}
        <div className="hidden sm:block text-right min-w-[180px]">
          <p className="text-xs text-foreground">
            {copyCount} {copyCount === 1 ? "copy" : "copies"}
          </p>
        </div>

        {/* High Grade */}
        <div className="hidden md:block text-right min-w-[160px]">
          <p className="text-xs text-foreground">
            {copies.length > 0
              ? Math.max(...copies.map((c) => parseFloat(c.grade))).toString()
              : "—"}
          </p>
        </div>

        {/* Actions */}
        <div className="w-20 text-right">
          <a
            href={`/card/${template.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            View
          </a>
        </div>
      </div>

      {/* Expanded Copies */}
      {isExpanded && (
        <div className="bg-muted/10 border-t border-border/50">
          {/* Sub-header */}
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 ml-8 text-[10px] text-muted-foreground uppercase tracking-wider bg-muted/20">
            <div className="min-w-[100px]">Grade</div>
            <div className="flex-1">Cert #</div>
            <div className="min-w-[80px]">State</div>
            <div className="min-w-[100px] text-right">Price</div>
            <div className="min-w-[60px] text-center">Visible</div>
            <div className="min-w-[120px] text-right">Actions</div>
          </div>

          <div className="divide-y divide-border/50">
            {copies.map((copy) => (
              <div
                key={copy.id}
                className={cn(
                  "px-4 py-3 flex items-center gap-4 ml-8",
                  copy.state === "in_escrow" && "bg-amber-50/30"
                )}
              >
                {/* Grade */}
                <div className="min-w-[100px]">
                  <span className="text-sm font-medium">
                    {copy.gradingCompany} {copy.grade}
                  </span>
                </div>

                {/* Cert # */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">
                    {maskCert(copy.certNumber)}
                  </p>
                </div>

                {/* State Badge */}
                <div className="min-w-[80px]">{copyStateBadge(copy.state)}</div>

                {/* Price */}
                <div className="min-w-[100px] text-right">
                  {copy.state === "listed" && copy.priceBTC && (
                    <div>
                      <p className="text-sm font-mono font-medium">
                        {copy.priceBTC} BTC
                      </p>
                      {copy.acceptsOffers && (
                        <p className="text-[10px] text-muted-foreground">
                          Offers: Yes
                        </p>
                      )}
                    </div>
                  )}
                  {copy.state === "in_escrow" && (
                    <div className="flex items-center justify-end gap-1 text-amber-600">
                      <Lock className="h-3 w-3" />
                      <span className="text-xs">Locked</span>
                    </div>
                  )}
                  {copy.state === "sold" && copy.soldPriceBTC && (
                    <p className="text-sm font-mono text-muted-foreground">
                      {copy.soldPriceBTC} BTC
                    </p>
                  )}
                </div>

                {/* Visibility Toggle */}
                <div className="min-w-[60px] flex justify-center">
                  {copy.state !== "sold" && copy.state !== "in_escrow" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5">
                            <Switch
                              checked={copy.isPublic}
                              onCheckedChange={(checked) =>
                                onToggleVisibility?.(copy.id, checked)
                              }
                              className="h-4 w-7"
                              disabled={copy.state === "listed"}
                            />
                            {copy.isPublic ? (
                              <Eye className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            Public items appear on your storefront.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Actions */}
                <div className="min-w-[120px] text-right">
                  {copy.state === "in_collection" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onListCopy?.(copy.id);
                      }}
                    >
                      List for Sale
                    </Button>
                  )}
                  {copy.state === "listed" && (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditListing?.(copy.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPauseListing?.(copy.id);
                        }}
                      >
                        Pause
                      </Button>
                    </div>
                  )}
                  {copy.state === "in_escrow" && copy.orderId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-amber-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewOrder?.(copy.orderId!);
                      }}
                    >
                      View Order
                    </Button>
                  )}
                  {copy.state === "sold" && (
                    <span className="text-xs text-muted-foreground">
                      {copy.soldDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionRow;
