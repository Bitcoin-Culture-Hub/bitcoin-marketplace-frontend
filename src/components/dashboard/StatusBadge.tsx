import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatusVariant {
  label: string;
  className: string;
}

interface StatusBadgeProps {
  status: string;
  variants: Record<string, StatusVariant>;
}

const StatusBadge = ({ status, variants }: StatusBadgeProps) => {
  const variant = variants[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm", variant.className)}>
      {variant.label}
    </Badge>
  );
};

export const orderStatusVariants: Record<string, StatusVariant> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-800" },
  paid: { label: "Paid", className: "bg-green-50 text-green-800" },
  failed: { label: "Failed", className: "bg-red-50 text-red-800" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-600" },
};

export const offerStatusVariants: Record<string, StatusVariant> = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-800" },
  accepted: { label: "Accepted", className: "bg-green-50 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-800" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
};

export const listingStateVariants: Record<string, StatusVariant> = {
  in_collection: { label: "Collection", className: "bg-blue-50 text-blue-800" },
  listed: { label: "Listed", className: "bg-green-50 text-green-800" },
  in_escrow: { label: "In Escrow", className: "bg-amber-50 text-amber-800" },
  sold: { label: "Sold", className: "bg-purple-50 text-purple-800" },
  wish_list: { label: "Wish List", className: "bg-pink-50 text-pink-800" },
};

export default StatusBadge;
