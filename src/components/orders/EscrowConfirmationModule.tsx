import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EscrowConfirmationModuleProps {
  escrowStatus: "locked" | "released" | "frozen";
  orderStatus: "awaiting_shipment" | "shipped" | "delivered" | "disputed" | "completed";
  hasTracking: boolean;
  onConfirmReceipt: () => void;
  onFileDispute: () => void;
}

const EscrowConfirmationModule = ({
  escrowStatus,
  orderStatus,
  hasTracking,
  onConfirmReceipt,
  onFileDispute,
}: EscrowConfirmationModuleProps) => {
  const canConfirmReceipt = 
    escrowStatus === "locked" && 
    hasTracking && 
    (orderStatus === "shipped" || orderStatus === "delivered");
  
  const canDispute = 
    escrowStatus === "locked" && 
    (orderStatus === "shipped" || orderStatus === "delivered");

  const isDisputed = orderStatus === "disputed" || escrowStatus === "frozen";
  const isCompleted = orderStatus === "completed" || escrowStatus === "released";

  // Status config
  const escrowConfig = {
    locked: {
      icon: Lock,
      label: "Escrow Locked",
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      explainer: "Funds release after you confirm receipt (or a dispute is resolved).",
    },
    frozen: {
      icon: AlertTriangle,
      label: "Escrow Frozen",
      className: "bg-destructive/10 text-destructive border-destructive/20",
      explainer: "Dispute open — payout paused.",
    },
    released: {
      icon: Unlock,
      label: "Escrow Released",
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      explainer: "Escrow released — seller paid.",
    },
  };

  const currentEscrow = escrowConfig[escrowStatus];
  const EscrowIcon = currentEscrow.icon;

  return (
    <div className="bg-muted/30 rounded-lg border border-border overflow-hidden">
      {/* Escrow Status Banner */}
      <div className={cn("p-4 border-b", currentEscrow.className.replace("text-", "bg-").replace("/10", "/5"))}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("gap-1.5 font-medium", currentEscrow.className)}>
              <EscrowIcon className="h-3.5 w-3.5" />
              {currentEscrow.label}
            </Badge>
            {orderStatus === "delivered" && escrowStatus === "locked" && (
              <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20">
                <CheckCircle className="h-3 w-3" />
                Delivered
              </Badge>
            )}
            {orderStatus === "shipped" && escrowStatus === "locked" && (
              <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20">
                <Clock className="h-3 w-3" />
                In Transit
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{currentEscrow.explainer}</p>
      </div>

      {/* Action Area */}
      <div className="p-4">
        {/* Completed State */}
        {isCompleted && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-600">Receipt confirmed ✓</p>
              <p className="text-sm text-muted-foreground">Escrow released to seller.</p>
            </div>
          </div>
        )}

        {/* Disputed State */}
        {isDisputed && !isCompleted && (
          <div className="flex items-center gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Dispute open — escrow frozen</p>
              <p className="text-sm text-muted-foreground">Payout paused while issue is reviewed.</p>
            </div>
          </div>
        )}

        {/* Active State: Can Confirm or Dispute */}
        {canConfirmReceipt && !isDisputed && !isCompleted && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Received your item?</h4>
              <p className="text-sm text-muted-foreground">
                Confirming receipt releases escrow to the seller. Only confirm after inspecting the item.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onConfirmReceipt} className="gap-2 flex-1">
                <CheckCircle className="h-4 w-4" />
                Confirm Received
              </Button>
              <Button 
                variant="outline" 
                onClick={onFileDispute}
                className="text-destructive hover:text-destructive flex-1"
              >
                Not received / Issue with order
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              If you take no action, escrow may release after the confirmation window.
            </p>
          </div>
        )}

        {/* Pre-shipment: Waiting */}
        {orderStatus === "awaiting_shipment" && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Waiting for seller to ship</p>
              <p className="text-xs text-muted-foreground">You'll be able to confirm receipt once tracking is added.</p>
            </div>
          </div>
        )}

        {/* Escrow Released - Contact Support */}
        {escrowStatus === "released" && orderStatus !== "completed" && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Escrow already released. For issues, please{" "}
              <button className="text-primary underline hover:no-underline">contact support</button>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowConfirmationModule;
