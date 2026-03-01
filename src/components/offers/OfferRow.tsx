import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Bitcoin } from "lucide-react";
import { EscrowBadge, OfferStatusBadge, EscrowStatus, OfferStatus } from "./OfferStatusBadges";

export interface OfferData {
  id: string;
  templateName: string;
  setName: string;
  cardNumber: string;
  grader: string;
  grade: string;
  counterpartyName: string;
  amountBTC: string;
  listPriceBTC?: string;
  createdAt: string;
  expiresIn?: string;
  escrowStatus: EscrowStatus;
  offerStatus: OfferStatus;
  orderId?: string;
}

interface OfferRowProps {
  offer: OfferData;
  mode: "inbox" | "outbox";
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onWithdraw?: (id: string) => void;
  onViewDetails: (id: string) => void;
  onViewOrder?: (orderId: string) => void;
}

const OfferRow = ({
  offer,
  mode,
  onAccept,
  onDecline,
  onWithdraw,
  onViewDetails,
  onViewOrder,
}: OfferRowProps) => {
  const canAccept = mode === "inbox" && offer.offerStatus === "pending" && offer.escrowStatus === "locked";
  const canDecline = mode === "inbox" && offer.offerStatus === "pending";
  const canWithdraw = mode === "outbox" && offer.offerStatus === "pending" && offer.escrowStatus === "locked";
  const showViewOrder = offer.offerStatus === "accepted" && offer.orderId;

  return (
    <div 
      className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onViewDetails(offer.id)}
    >
      {/* Card Identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-foreground truncate">{offer.templateName}</span>
          <Badge variant="outline" className="text-xs shrink-0">
            {offer.grader} {offer.grade}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {offer.setName} #{offer.cardNumber}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {mode === "inbox" ? "From:" : "To:"} {offer.counterpartyName}
        </div>
      </div>

      {/* Amount + Timing */}
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 justify-end font-semibold text-foreground">
          <Bitcoin className="h-4 w-4 text-amber-500" />
          {offer.amountBTC} BTC
        </div>
        {offer.listPriceBTC && (
          <div className="text-xs text-muted-foreground">
            List: {offer.listPriceBTC} BTC
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {offer.createdAt}
        </div>
        {offer.expiresIn && offer.offerStatus === "pending" && (
          <div className="text-xs text-amber-600">
            Expires in {offer.expiresIn}
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-col gap-1 shrink-0">
        <EscrowBadge status={offer.escrowStatus} />
        <OfferStatusBadge status={offer.offerStatus} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {showViewOrder && onViewOrder ? (
          <Button 
            size="sm" 
            onClick={() => onViewOrder(offer.orderId!)}
          >
            View Order
          </Button>
        ) : (
          <>
            {canAccept && onAccept && (
              <Button size="sm" onClick={() => onAccept(offer.id)}>
                Accept
              </Button>
            )}
            {canDecline && onDecline && (
              <Button size="sm" variant="outline" onClick={() => onDecline(offer.id)}>
                Decline
              </Button>
            )}
            {canWithdraw && onWithdraw && (
              <Button size="sm" variant="outline" onClick={() => onWithdraw(offer.id)}>
                Withdraw
              </Button>
            )}
          </>
        )}
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default OfferRow;
