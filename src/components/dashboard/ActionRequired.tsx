import { Package, MessageSquare, AlertTriangle, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrderStatus = "awaiting_shipment" | "shipped" | "delivered" | "awaiting_confirmation" | "disputed";
type OfferStatus = "pending" | "countered" | "accepted" | "declined" | "expired";

interface OrderAction {
  id: string;
  type: "order";
  templateName: string;
  grade: string;
  grader: string;
  counterparty: string;
  role: "buyer" | "seller";
  status: OrderStatus;
  shipByDate?: string;
  trackingNumber?: string;
}

interface OfferAction {
  id: string;
  type: "offer";
  templateName: string;
  grade: string;
  grader: string;
  counterparty: string;
  direction: "incoming" | "outgoing";
  amountBTC: string;
  escrowLocked: boolean;
  status: OfferStatus;
  expiresAt?: string;
}

type ActionItem = OrderAction | OfferAction;

interface ActionRequiredProps {
  items: ActionItem[];
  onOrderAction?: (orderId: string, action: string) => void;
  onOfferAction?: (offerId: string, action: string) => void;
}

const statusLabels: Record<OrderStatus | OfferStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  shipped: "Shipped",
  delivered: "Delivered",
  awaiting_confirmation: "Awaiting Confirmation",
  disputed: "Disputed",
  pending: "Pending",
  countered: "Countered",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

const ActionRequired = ({ items, onOrderAction, onOfferAction }: ActionRequiredProps) => {
  const orders = items.filter((i): i is OrderAction => i.type === "order");
  const incomingOffers = items.filter(
    (i): i is OfferAction => i.type === "offer" && i.direction === "incoming"
  );
  const outgoingOffers = items.filter(
    (i): i is OfferAction => i.type === "offer" && i.direction === "outgoing"
  );

  const totalCount = items.length;

  const getOrderCTA = (order: OrderAction) => {
    if (order.role === "seller") {
      if (order.status === "awaiting_shipment") return "Add Tracking";
      if (order.status === "disputed") return "View Dispute";
    }
    if (order.role === "buyer") {
      if (order.status === "delivered") return "Confirm Receipt";
      if (order.status === "disputed") return "View Dispute";
    }
    return "View Order";
  };

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-display font-medium text-foreground">
          Action Required
        </h2>
        {totalCount > 0 && (
          <Badge className="bg-foreground text-background text-xs px-2 py-0.5">
            {totalCount}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Items here can block shipping, escrow release, or payout.
      </p>

      {totalCount > 0 ? (
        <div className="border border-border bg-card/30 divide-y divide-border">
          {/* Orders Section */}
          {orders.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="h-3 w-3" />
                  Orders ({orders.length})
                </p>
              </div>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="px-4 py-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {order.templateName} · {order.grade} · {order.grader}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.role === "seller" ? "to" : "from"} {order.counterparty}
                      {order.shipByDate && ` · Ship by ${order.shipByDate}`}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] shrink-0",
                      order.status === "disputed" && "border-destructive text-destructive",
                      order.status === "awaiting_shipment" && "border-amber-500 text-amber-600",
                      order.status === "delivered" && "border-green-500 text-green-600"
                    )}
                  >
                    {statusLabels[order.status]}
                  </Badge>

                  <Button
                    size="sm"
                    className="h-8 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
                    onClick={() => onOrderAction?.(order.id, getOrderCTA(order))}
                  >
                    {getOrderCTA(order)}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Incoming Offers Section */}
          {incomingOffers.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3 w-3" />
                  Incoming Offers ({incomingOffers.length})
                </p>
              </div>
              {incomingOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="px-4 py-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {offer.templateName} · {offer.grade} · {offer.grader}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      from {offer.counterparty}
                    </p>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-sm font-mono font-medium">{offer.amountBTC} BTC</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {offer.escrowLocked ? (
                        <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0">
                          Escrow locked ✓
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                          Not funded
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-4 border-l border-border/50">
                    <Button
                      size="sm"
                      className="h-8 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => onOfferAction?.(offer.id, "Accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      onClick={() => onOfferAction?.(offer.id, "Counter")}
                    >
                      Counter
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => onOfferAction?.(offer.id, "Decline")}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Outgoing Offers Section */}
          {outgoingOffers.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Your Offers ({outgoingOffers.length})
                </p>
              </div>
              {outgoingOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="px-4 py-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {offer.templateName} · {offer.grade} · {offer.grader}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      to {offer.counterparty}
                    </p>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-sm font-mono font-medium">{offer.amountBTC} BTC</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] mt-0.5",
                        offer.status === "pending" && "text-amber-600 border-amber-300",
                        offer.status === "countered" && "text-blue-600 border-blue-300",
                        offer.status === "accepted" && "text-green-600 border-green-300",
                        offer.status === "declined" && "text-destructive border-destructive/30",
                        offer.status === "expired" && "text-muted-foreground"
                      )}
                    >
                      {statusLabels[offer.status]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 pl-4 border-l border-border/50">
                    {offer.status === "countered" && (
                      <Button
                        size="sm"
                        className="h-8 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => onOfferAction?.(offer.id, "View Counter")}
                      >
                        View Counter
                      </Button>
                    )}
                    {(offer.status === "pending" || offer.status === "countered") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-xs text-muted-foreground"
                        onClick={() => onOfferAction?.(offer.id, "Withdraw")}
                      >
                        Withdraw
                      </Button>
                    )}
                    {offer.status === "accepted" && (
                      <Button
                        size="sm"
                        className="h-8 px-4 text-xs bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => onOfferAction?.(offer.id, "Complete Purchase")}
                      >
                        Complete Purchase
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="border border-border bg-muted/20 p-8 text-center">
          <CheckCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">All caught up.</p>
          <p className="text-xs text-muted-foreground mt-1">
            No orders or offers require your attention.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Button variant="outline" size="sm" className="text-xs">
              Browse Marketplace
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Add a Card
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ActionRequired;
