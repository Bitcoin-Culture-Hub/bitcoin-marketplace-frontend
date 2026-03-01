import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ActivityOffer {
  id: string;
  cardName: string;
  cardGrade: string;
  type: "received" | "sent";
  amount: string;
  counterparty: string;
  timestamp: string;
}

interface CollectionActivityPanelProps {
  offers: ActivityOffer[];
  totalCount: number;
}

const CollectionActivityPanel = ({
  offers,
  totalCount,
}: CollectionActivityPanelProps) => {
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="mb-6 border border-border bg-muted/20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Activity — Action Required
          </span>
          <Badge className="bg-foreground text-background text-[10px] px-1.5 py-0">
            {totalCount}
          </Badge>
        </div>
        <Link
          to="/storefront/manage"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View on Dashboard
        </Link>
      </div>

      <div className="border-t border-border/50 divide-y divide-border/50">
        {offers.slice(0, 3).map((offer) => (
          <div
            key={offer.id}
            className="px-4 py-3 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2 min-w-0">
              {offer.type === "received" ? (
                <ArrowDownLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm truncate">
                  {offer.cardName} · {offer.cardGrade}
                </p>
                <p className="text-xs text-muted-foreground">
                  {offer.type === "received" ? "from" : "to"} {offer.counterparty} · {offer.timestamp}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-medium">{offer.amount}</span>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                View
              </Button>
            </div>
          </div>
        ))}
        {totalCount > 3 && (
          <div className="px-4 py-2 text-center">
            <Link
              to="/storefront/manage"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all {totalCount} items →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionActivityPanel;
