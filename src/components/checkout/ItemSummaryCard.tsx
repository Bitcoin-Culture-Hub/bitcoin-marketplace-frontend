import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type CheckoutMode = "BUY_NOW" | "OFFER";

interface ItemSummaryCardProps {
  item: {
    templateName: string;
    series: string;
    year: string;
    cardNumber: string;
    gradingCompany: string;
    grade: string;
    certNumber: string;
    image?: string;
  };
  seller: {
    name: string;
    verified: boolean;
  };
  mode: CheckoutMode;
  offerAmountBTC?: string;
  offerExpiry?: string;
}

const ItemSummaryCard = ({
  item,
  seller,
  mode,
  offerAmountBTC,
  offerExpiry,
}: ItemSummaryCardProps) => {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="w-16 h-20 bg-muted border border-border shrink-0 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.templateName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
              Card
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-foreground truncate">{item.templateName}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.series} · {item.year} · {item.cardNumber}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {item.gradingCompany}
            </Badge>
            <Badge variant="outline" className="text-sm font-mono font-bold">
              {item.grade}
            </Badge>
          </div>
        </div>
      </div>

      {/* Seller info */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Seller:</span>
          <span className="text-sm text-foreground">{seller.name}</span>
          {seller.verified && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              <Shield className="h-2.5 w-2.5 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {mode === "BUY_NOW" ? "Buy now" : "Offer on this copy"}
        </Badge>
      </div>

      {/* Offer details (if OFFER mode) */}
      {mode === "OFFER" && offerAmountBTC && (
        <div className="mt-4 p-3 bg-muted/30 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Your offer</span>
            <span className="font-mono font-medium">{offerAmountBTC} BTC</span>
          </div>
          {offerExpiry && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Expires in</span>
              <span className="text-sm">{offerExpiry}</span>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground pt-1">
            Offer will only be delivered to seller after escrow is funded.
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemSummaryCard;
