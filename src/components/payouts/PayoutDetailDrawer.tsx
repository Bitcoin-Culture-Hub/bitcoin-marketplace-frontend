import { Copy, ExternalLink, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import PayoutStatusBadge from "./PayoutStatusBadge";
import { Payout } from "./PayoutRow";
import { toast } from "sonner";

interface PayoutDetailDrawerProps {
  payout: Payout | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PayoutDetailDrawer = ({
  payout,
  open,
  onOpenChange,
}: PayoutDetailDrawerProps) => {
  if (!payout) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const copyPayoutDetails = () => {
    const details = `
Payout ID: ${payout.id}
Amount: ${payout.amountBTC} BTC
Status: ${payout.status}
Card: ${payout.templateName} (${payout.grader} ${payout.grade})
Order: ${payout.orderId}
Destination: ${payout.destinationAddress}
${payout.txid ? `TXID: ${payout.txid}` : ""}
${payout.eligibleAt ? `Eligible: ${formatDate(payout.eligibleAt)}` : ""}
${payout.sentAt ? `Sent: ${formatDate(payout.sentAt)}` : ""}
    `.trim();
    navigator.clipboard.writeText(details);
    toast.success("Payout details copied");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-display">Payout Details</DrawerTitle>
              <PayoutStatusBadge status={payout.status} />
            </div>
            <DrawerDescription className="text-xs">
              Payout #{payout.id.slice(0, 8)}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-6">
            {/* Amount */}
            <div className="text-center py-4 border border-border rounded-sm bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className="font-mono text-2xl font-semibold">
                {payout.amountBTC} BTC
              </p>
            </div>

            {/* Failed reason */}
            {payout.status === "failed" && payout.failureReason && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Payout failed</p>
                  <p>{payout.failureReason}</p>
                </div>
              </div>
            )}

            {/* Destination */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Destination
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono bg-muted/50 px-2 py-1.5 rounded-sm break-all">
                  {payout.destinationAddress}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(payout.destinationAddress, "Address")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* TXID */}
            {payout.txid && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Transaction ID
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-muted/50 px-2 py-1.5 rounded-sm truncate">
                    {payout.txid}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => copyToClipboard(payout.txid!, "TXID")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Order link */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Related Order
              </p>
              <div className="flex items-center justify-between p-3 border border-border rounded-sm">
                <div>
                  <p className="text-sm font-medium">{payout.templateName}</p>
                  <p className="text-xs text-muted-foreground">
                    {payout.grader} {payout.grade}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                  <a href={`/orders/${payout.orderId}`}>
                    View Order
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Created
                </p>
                <p>{formatDate(payout.createdAt)}</p>
              </div>
              {payout.eligibleAt && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    Eligible
                  </p>
                  <p>{formatDate(payout.eligibleAt)}</p>
                </div>
              )}
              {payout.sentAt && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    Sent
                  </p>
                  <p>{formatDate(payout.sentAt)}</p>
                </div>
              )}
            </div>
          </div>

          <DrawerFooter className="flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={copyPayoutDetails}
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy details
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost" className="flex-1">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PayoutDetailDrawer;
