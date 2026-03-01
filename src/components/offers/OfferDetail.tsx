import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bitcoin, ExternalLink } from "lucide-react";
import { EscrowBadge, OfferStatusBadge, EscrowStatus, OfferStatus } from "./OfferStatusBadges";

interface OfferDetailProps {
  offer: {
    id: string;
    templateName: string;
    setName: string;
    cardNumber: string;
    grader: string;
    grade: string;
    buyerName: string;
    sellerName: string;
    amountBTC: string;
    listPriceBTC?: string;
    createdAt: string;
    expiresAt?: string;
    acceptedAt?: string;
    declinedAt?: string;
    expiredAt?: string;
    escrowStatus: EscrowStatus;
    offerStatus: OfferStatus;
    escrowInvoiceId?: string;
    orderId?: string;
  };
  mode: "inbox" | "outbox";
  onBack: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onWithdraw?: () => void;
  onViewOrder?: () => void;
}

const OfferDetail = ({
  offer,
  mode,
  onBack,
  onAccept,
  onDecline,
  onWithdraw,
  onViewOrder,
}: OfferDetailProps) => {
  const canAccept = mode === "inbox" && offer.offerStatus === "pending" && offer.escrowStatus === "locked";
  const canDecline = mode === "inbox" && offer.offerStatus === "pending";
  const canWithdraw = mode === "outbox" && offer.offerStatus === "pending" && offer.escrowStatus === "locked";
  const showViewOrder = offer.offerStatus === "accepted" && offer.orderId;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Offers
      </Button>

      {/* Header with Status */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Offer #{offer.id.slice(0, 8)}</h2>
          <p className="text-muted-foreground mt-1">
            {mode === "inbox" ? `From ${offer.buyerName}` : `To ${offer.sellerName}`}
          </p>
        </div>
        <div className="flex gap-2">
          <EscrowBadge status={offer.escrowStatus} />
          <OfferStatusBadge status={offer.offerStatus} />
        </div>
      </div>

      <Separator />

      {/* Card Info */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Card Details</h3>
        <div className="flex items-center gap-3">
          <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Card</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{offer.templateName}</p>
            <p className="text-sm text-muted-foreground">{offer.setName} #{offer.cardNumber}</p>
            <Badge variant="outline" className="mt-1">
              {offer.grader} {offer.grade}
            </Badge>
          </div>
        </div>
      </div>

      {/* Offer Amount */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Offer Amount</h3>
        <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Bitcoin className="h-6 w-6 text-amber-500" />
          {offer.amountBTC} BTC
        </div>
        {offer.listPriceBTC && (
          <p className="text-sm text-muted-foreground mt-1">
            List price: {offer.listPriceBTC} BTC
          </p>
        )}
      </div>

      {/* Timestamps */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Timeline</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">{offer.createdAt}</span>
          </div>
          {offer.expiresAt && offer.offerStatus === "pending" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires</span>
              <span className="text-amber-600">{offer.expiresAt}</span>
            </div>
          )}
          {offer.acceptedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accepted</span>
              <span className="text-emerald-600">{offer.acceptedAt}</span>
            </div>
          )}
          {offer.declinedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Declined</span>
              <span className="text-destructive">{offer.declinedAt}</span>
            </div>
          )}
          {offer.expiredAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expired</span>
              <span className="text-muted-foreground">{offer.expiredAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Escrow Reference */}
      {offer.escrowInvoiceId && (
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Escrow Reference</h3>
          <code className="text-xs text-muted-foreground">{offer.escrowInvoiceId}</code>
        </div>
      )}

      {/* Order Link */}
      {showViewOrder && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-emerald-600">Order Created</h3>
              <p className="text-sm text-muted-foreground">Order #{offer.orderId?.slice(0, 8)}</p>
            </div>
            <Button onClick={onViewOrder} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View Order
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      {(canAccept || canDecline || canWithdraw) && (
        <div className="flex gap-3 pt-4">
          {canAccept && (
            <Button onClick={onAccept} className="flex-1">
              Accept Offer
            </Button>
          )}
          {canDecline && (
            <Button variant="outline" onClick={onDecline} className="flex-1">
              Decline
            </Button>
          )}
          {canWithdraw && (
            <Button variant="outline" onClick={onWithdraw} className="flex-1">
              Withdraw Offer
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferDetail;
