import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Unlock, AlertTriangle } from "lucide-react";

interface ConfirmReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderAmount: string;
  sellerName: string;
}

const ConfirmReceiptModal = ({
  open,
  onOpenChange,
  onConfirm,
  orderAmount,
  sellerName,
}: ConfirmReceiptModalProps) => {
  const [receivedAsDescribed, setReceivedAsDescribed] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInitialConfirm = () => {
    setShowSafetyModal(true);
  };

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onOpenChange(false);
      setShowSafetyModal(false);
      setReceivedAsDescribed(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setReceivedAsDescribed(false);
    setShowSafetyModal(false);
  };

  return (
    <>
      {/* Initial Confirm Dialog */}
      <Dialog open={open && !showSafetyModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Confirm Receipt
            </DialogTitle>
            <DialogDescription>
              Confirming receipt releases escrow to the seller.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seller</span>
                <span className="font-medium text-foreground">{sellerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-foreground">{orderAmount} BTC</span>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
              <Checkbox
                id="received-as-described"
                checked={receivedAsDescribed}
                onCheckedChange={(checked) => setReceivedAsDescribed(checked === true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="received-as-described" className="text-sm font-medium cursor-pointer">
                  Item received as described
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  I've inspected the card and confirm it matches the listing.
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p>If there's an issue with your order, file a dispute instead.</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleInitialConfirm} 
              className="w-full sm:w-auto gap-2"
              disabled={!receivedAsDescribed}
            >
              <CheckCircle className="h-4 w-4" />
              Confirm Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safety Confirmation Modal */}
      <AlertDialog open={showSafetyModal} onOpenChange={setShowSafetyModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-amber-500" />
              Release escrow to seller?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This will release <strong>{orderAmount} BTC</strong> to <strong>{sellerName}</strong> and complete the order.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-sm text-amber-600">
                  ⚠️ This action cannot be undone. If there's an issue with your order, file a dispute instead.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSafetyModal(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleFinalConfirm}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {isSubmitting ? "Releasing..." : "Yes, release escrow"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfirmReceiptModal;
