import { ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import PayoutStatusBadge, { PayoutStatus } from "./PayoutStatusBadge";
import { toast } from "sonner";

export interface Payout {
  id: string;
  orderId: string;
  templateName: string;
  grader: string;
  grade: string;
  amountBTC: string;
  status: PayoutStatus;
  destinationAddress: string;
  createdAt: string;
  eligibleAt?: string;
  sentAt?: string;
  txid?: string;
  failureReason?: string;
}

interface PayoutRowProps {
  payout: Payout;
  onViewDetails: (payout: Payout) => void;
}

const PayoutRow = ({ payout, onViewDetails }: PayoutRowProps) => {
  const maskAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(payout.destinationAddress);
    toast.success("Address copied");
  };

  return (
    <tr
      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
      onClick={() => onViewDetails(payout)}
    >
      <td className="py-3 px-4">
        <span className="text-sm text-muted-foreground">
          {formatDate(payout.createdAt)}
        </span>
      </td>
      <td className="py-3 px-4">
        <div>
          <p className="text-sm font-medium">{payout.templateName}</p>
          <p className="text-xs text-muted-foreground">
            {payout.grader} {payout.grade} · #{payout.orderId.slice(0, 8)}
          </p>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-mono text-sm font-semibold">{payout.amountBTC} BTC</span>
      </td>
      <td className="py-3 px-4">
        <PayoutStatusBadge status={payout.status} />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-muted-foreground">
            {maskAddress(payout.destinationAddress)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={copyAddress}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          View
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </td>
    </tr>
  );
};

export default PayoutRow;
