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
import { Lock, Unlock } from "lucide-react";

interface AcceptOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  offerAmount: string;
}

export const AcceptOfferModal = ({
  open,
  onOpenChange,
  onConfirm,
  offerAmount,
}: AcceptOfferModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            Accept Offer?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              You are about to accept an offer for <strong>{offerAmount} BTC</strong>.
            </p>
            <p>
              Funds are already locked in escrow. An order will be created immediately 
              and you'll need to ship the card.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Accept & Create Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface DeclineOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeclineOfferModal = ({
  open,
  onOpenChange,
  onConfirm,
}: DeclineOfferModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-muted-foreground" />
            Decline Offer?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              The buyer's escrow will be refunded immediately. This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Decline Offer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface WithdrawOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const WithdrawOfferModal = ({
  open,
  onOpenChange,
  onConfirm,
}: WithdrawOfferModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-muted-foreground" />
            Withdraw Offer?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              Your escrow will be refunded immediately. You can place a new offer anytime.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Withdraw & Refund
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
