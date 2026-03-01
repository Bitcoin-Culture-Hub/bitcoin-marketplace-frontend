import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Bitcoin } from "lucide-react";
import { OrderStatusBadge, OrderEscrowBadge, OrderStatus, OrderEscrowStatus } from "./OrderStatusBadges";

export interface OrderData {
  id: string;
  templateName: string;
  grader: string;
  grade: string;
  counterpartyName: string;
  counterpartyRole: "buyer" | "seller";
  amountBTC: string;
  status: OrderStatus;
  escrowStatus: OrderEscrowStatus;
  createdAt: string;
  needsAction?: boolean;
  actionLabel?: string;
}

interface OrderRowProps {
  order: OrderData;
  role: "buyer" | "seller";
  onAction?: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const OrderRow = ({ order, role, onAction, onViewDetails }: OrderRowProps) => {
  return (
    <div 
      className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onViewDetails(order.id)}
    >
      {/* Card Identity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-foreground truncate">{order.templateName}</span>
          <Badge variant="outline" className="text-xs shrink-0">
            {order.grader} {order.grade}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {order.counterpartyRole === "seller" ? "Seller:" : "Buyer:"} {order.counterpartyName}
        </div>
      </div>

      {/* Amount + Timing */}
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 justify-end font-semibold text-foreground">
          <Bitcoin className="h-4 w-4 text-amber-500" />
          {order.amountBTC} BTC
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {order.createdAt}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-col gap-1 shrink-0">
        <OrderStatusBadge status={order.status} />
        <OrderEscrowBadge status={order.escrowStatus} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {order.needsAction && onAction && (
          <Button size="sm" onClick={() => onAction(order.id)}>
            {order.actionLabel || "Action"}
          </Button>
        )}
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default OrderRow;
