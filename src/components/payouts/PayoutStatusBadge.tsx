import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

export type PayoutStatus = "eligible" | "pending" | "released" | "failed";

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
  size?: "sm" | "default";
}

const statusConfig: Record<
  PayoutStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  eligible: {
    label: "Eligible",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  released: {
    label: "Released",
    icon: CheckCircle2,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const PayoutStatusBadge = ({
  status,
  size = "default",
}: PayoutStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${
        size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5"
      } font-medium`}
    >
      <Icon className={size === "sm" ? "h-2.5 w-2.5 mr-1" : "h-3 w-3 mr-1"} />
      {config.label}
    </Badge>
  );
};

export default PayoutStatusBadge;
