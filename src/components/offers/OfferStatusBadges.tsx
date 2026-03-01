import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, AlertTriangle, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type EscrowStatus = "locked" | "refunded" | "frozen";
export type OfferStatus = "pending" | "accepted" | "declined" | "expired" | "withdrawn";

interface EscrowBadgeProps {
  status: EscrowStatus;
  className?: string;
}

export const EscrowBadge = ({ status, className }: EscrowBadgeProps) => {
  const config = {
    locked: {
      label: "Escrow: Locked",
      icon: Lock,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    refunded: {
      label: "Escrow: Refunded",
      icon: Unlock,
      className: "bg-muted text-muted-foreground border-border",
    },
    frozen: {
      label: "Escrow: Frozen",
      icon: AlertTriangle,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
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

interface OfferStatusBadgeProps {
  status: OfferStatus;
  className?: string;
}

export const OfferStatusBadge = ({ status, className }: OfferStatusBadgeProps) => {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    accepted: {
      label: "Accepted",
      icon: CheckCircle,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    declined: {
      label: "Declined",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    expired: {
      label: "Expired",
      icon: Clock,
      className: "bg-muted text-muted-foreground border-border",
    },
    withdrawn: {
      label: "Withdrawn",
      icon: RotateCcw,
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
