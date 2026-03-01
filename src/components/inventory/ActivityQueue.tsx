import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OfferStatus = "pending" | "countered" | "accepted" | "rejected";

interface Offer {
  id: string;
  cardName: string;
  cardGrade: string;
  type: "received" | "sent";
  amount: string;
  listPrice: string;
  counterparty: string;
  timestamp: string;
  status: OfferStatus;
  counterAmount?: string;
}

interface ActivityQueueProps {
  offers: Offer[];
  onAccept?: (offerId: string) => void;
  onCounter?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  onWithdraw?: (offerId: string) => void;
}

const ActivityQueue = ({
  offers,
  onAccept,
  onCounter,
  onReject,
  onWithdraw,
}: ActivityQueueProps) => {
  const pendingOffers = offers.filter(o => o.status === "pending" || o.status === "countered");
  const receivedOffers = pendingOffers.filter(o => o.type === "received");
  const sentOffers = pendingOffers.filter(o => o.type === "sent");
  const totalCount = pendingOffers.length;

  return (
    <section className="mb-8">
      {/* Section Container - Subtle distinction */}
      <div className="bg-muted/30 border-t-2 border-border">
        {/* Header - Bold, Static, Never Hidden */}
        <div className="px-4 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-foreground">
                  Activity — Action Required
                </h2>
                {totalCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="text-[10px] px-1.5 py-0 h-5 font-mono bg-foreground text-background"
                  >
                    {totalCount}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Offers, counters, and settlements awaiting your response.
              </p>
            </div>
          </div>
        </div>

        {/* Content - Always Visible */}
        {totalCount > 0 ? (
          <div>
            {/* Received Offers */}
            {receivedOffers.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-muted/20 border-b border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowDownLeft className="h-3 w-3" />
                    Received ({receivedOffers.length})
                  </p>
                </div>
                {receivedOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="px-4 py-4 border-b border-border/30 last:border-b-0 bg-background/50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Primary: Card + Grade */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {offer.cardName} · {offer.cardGrade}
                        </p>
                        {/* Secondary: Counterparty + Time */}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          from {offer.counterparty} · {offer.timestamp}
                        </p>
                      </div>
                      
                      {/* Context: Offer Amount + Reference */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm font-mono font-medium">{offer.amount}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {offer.status === "countered" ? (
                            <span className="text-amber-600">Countered {offer.counterAmount}</span>
                          ) : (
                            `List: ${offer.listPrice}`
                          )}
                        </p>
                      </div>
                      
                      {/* Actions - Visually Prominent */}
                      <div className="flex items-center gap-2 pl-4 border-l border-border/50">
                        <Button
                          size="sm"
                          className="h-8 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
                          onClick={() => onAccept?.(offer.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={() => onCounter?.(offer.id)}
                        >
                          Counter
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => onReject?.(offer.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sent Offers */}
            {sentOffers.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-muted/20 border-b border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowUpRight className="h-3 w-3" />
                    Sent ({sentOffers.length})
                  </p>
                </div>
                {sentOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="px-4 py-4 border-b border-border/30 last:border-b-0 bg-background/50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Primary: Card + Grade */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {offer.cardName} · {offer.cardGrade}
                        </p>
                        {/* Secondary: Counterparty + Time */}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          to {offer.counterparty} · {offer.timestamp}
                        </p>
                      </div>
                      
                      {/* Context: Offer Amount + Status */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm font-mono font-medium">{offer.amount}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {offer.status === "countered" ? (
                            <span className="text-amber-600">Counter: {offer.counterAmount}</span>
                          ) : (
                            "Awaiting response"
                          )}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 pl-4 border-l border-border/50">
                        {offer.status === "countered" && (
                          <Button
                            size="sm"
                            className="h-8 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
                            onClick={() => onAccept?.(offer.id)}
                          >
                            Accept
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs text-muted-foreground"
                          onClick={() => onWithdraw?.(offer.id)}
                        >
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer - Reassurance Copy */}
            <div className="px-4 py-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground text-center">
                No action is taken unless you explicitly accept, counter, or withdraw.
              </p>
            </div>
          </div>
        ) : (
          /* Empty State - Calm, Layout-Stable */
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No actions required</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Offers and settlement activity will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityQueue;
