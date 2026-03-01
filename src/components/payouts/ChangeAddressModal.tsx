import { useState } from "react";
import { Wallet, AlertTriangle, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

interface ChangeAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAddress: string | null;
  onAddressChanged: (newAddress: string) => void;
  isNewAddress?: boolean;
}

type Step = "address" | "verify" | "success";

const ChangeAddressModal = ({
  open,
  onOpenChange,
  currentAddress,
  onAddressChanged,
  isNewAddress = false,
}: ChangeAddressModalProps) => {
  const [step, setStep] = useState<Step>("address");
  const [newAddress, setNewAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  // Basic BTC address validation
  const isValidBTCAddress = (addr: string): boolean => {
    if (!addr) return false;
    const patterns = [
      /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      /^bc1[a-z0-9]{39,59}$/,
    ];
    return patterns.some((p) => p.test(addr));
  };

  const handleAddressSubmit = () => {
    setError("");

    if (!newAddress.trim()) {
      setError("BTC address is required");
      return;
    }

    if (!isValidBTCAddress(newAddress.trim())) {
      setError("Enter a valid Bitcoin address");
      return;
    }

    if (!confirmed) {
      setError("Please confirm the address is correct");
      return;
    }

    // Move to verification step
    setStep("verify");
    toast.info("Verification code sent to your email");
  };

  const handleVerification = () => {
    if (verificationCode.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }

    // Simulate verification (in real app, validate with backend)
    if (verificationCode === "123456" || verificationCode.length === 6) {
      setStep("success");
      onAddressChanged(newAddress.trim());
    } else {
      setError("Invalid verification code");
    }
  };

  const handleClose = () => {
    setStep("address");
    setNewAddress("");
    setConfirmed(false);
    setVerificationCode("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "address" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                {isNewAddress ? "Add payout address" : "Change payout address"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {isNewAddress
                  ? "Add a BTC address to receive payouts."
                  : "Enter a new BTC address for payouts."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {currentAddress && (
                <div className="p-3 bg-muted/50 rounded-sm">
                  <p className="text-xs text-muted-foreground mb-1">
                    Current address
                  </p>
                  <code className="text-xs font-mono break-all">
                    {currentAddress}
                  </code>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="newAddress" className="text-xs">
                  New Bitcoin address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="newAddress"
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                    setError("");
                  }}
                  placeholder="bc1q... or 1... or 3..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Double-check—payouts can't be reversed.</span>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="confirmAddress"
                  checked={confirmed}
                  onCheckedChange={(checked) => {
                    setConfirmed(!!checked);
                    if (checked) setError("");
                  }}
                />
                <Label
                  htmlFor="confirmAddress"
                  className="text-sm text-muted-foreground cursor-pointer leading-tight"
                >
                  I confirm this address is correct and I control the private keys.
                </Label>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleAddressSubmit}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verify your identity
              </DialogTitle>
              <DialogDescription className="text-sm">
                Enter the 6-digit code sent to your email.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-sm text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>Code sent to your registered email</span>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={(value) => {
                    setVerificationCode(value);
                    setError("");
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
              )}

              <p className="text-[10px] text-muted-foreground text-center">
                This security step protects your funds from unauthorized changes.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("address")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleVerification}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90"
              >
                Verify
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-center">
                Destination updated ✓
              </DialogTitle>
              <DialogDescription className="text-sm text-center">
                Your payout address has been changed.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
              <code className="text-sm font-mono bg-muted/50 px-3 py-1.5 rounded-sm break-all">
                {newAddress}
              </code>
              <p className="text-xs text-muted-foreground mt-3">
                Future payouts will be sent to this address.
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAddressModal;
