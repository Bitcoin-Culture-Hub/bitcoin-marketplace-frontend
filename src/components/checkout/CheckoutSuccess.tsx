import { Check, ShoppingBag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutMode } from "./ItemSummaryCard";

interface CheckoutSuccessProps {
  mode: CheckoutMode;
  orderId?: string;
  offerId?: string;
  onViewOrder: () => void;
  onViewOffers: () => void;
  onBackToMarketplace: () => void;
}

const CheckoutSuccess = ({
  mode,
  orderId,
  offerId,
  onViewOrder,
  onViewOffers,
  onBackToMarketplace,
}: CheckoutSuccessProps) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-display font-medium">
          {mode === "BUY_NOW" ? "Order created" : "Offer submitted"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === "BUY_NOW"
            ? "Your order has been created. The seller will ship your card soon."
            : "Your offer has been sent to the seller. Funds are locked in escrow."}
        </p>
      </div>

      {/* Status details */}
      <div className="bg-card border border-border p-4 text-left space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm text-muted-foreground">Escrow funded</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="text-sm text-muted-foreground">
            {mode === "BUY_NOW" ? "Order created" : "Offer submitted"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
            {mode === "BUY_NOW" ? (
              <ShoppingBag className="h-3 w-3 text-muted-foreground" />
            ) : (
              <MessageSquare className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {mode === "BUY_NOW" ? "Awaiting shipment" : "Awaiting seller response"}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          onClick={mode === "BUY_NOW" ? onViewOrder : onViewOffers}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-display uppercase tracking-wider"
        >
          {mode === "BUY_NOW" ? "View Order" : "View Offers"}
        </Button>
        <Button
          variant="ghost"
          onClick={onBackToMarketplace}
          className="w-full text-muted-foreground"
        >
          Back to marketplace
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Graded-only. Bitcoin-only. Offers are escrow-backed.
      </p>
    </div>
  );
};

export default CheckoutSuccess;
