import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, AlertTriangle, Clock, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "awaiting_shipment" | "shipped" | "delivered" | "disputed" | "completed";
export type OrderEscrowStatus = "locked" | "released" | "frozen";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const config = {
    awaiting_shipment: {
      label: "Awaiting Shipment",
      icon: Package,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    shipped: {
      label: "Shipped",
      icon: Truck,
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    disputed: {
      label: "Disputed",
      icon: AlertTriangle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle,
      className: "bg-muted text-muted-foreground border-border",
    },
  };

  const { label, icon: Icon, className: badgeClass } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", badgeClass, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

interface OrderEscrowBadgeProps {
  status: OrderEscrowStatus;
  className?: string;
}

export const OrderEscrowBadge = ({ status, className }: OrderEscrowBadgeProps) => {
  const config = {
    locked: {
      label: "Escrow: Locked",
      icon: Lock,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    released: {
      label: "Escrow: Released",
      icon: Unlock,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    frozen: {
      label: "Escrow: Frozen",
      icon: AlertTriangle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const { label, icon: Icon, className: badgeClass } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", badgeClass, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};
