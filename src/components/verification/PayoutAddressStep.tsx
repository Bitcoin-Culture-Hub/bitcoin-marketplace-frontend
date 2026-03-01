import { useState } from "react";
import { Wallet, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PayoutAddressStepProps {
  initialAddress: string;
  onContinue: (address: string) => void;
  onSkip?: () => void;
  onBack: () => void;
}

const PayoutAddressStep = ({
  initialAddress,
  onContinue,
  onSkip,
  onBack,
}: PayoutAddressStepProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  const isValidBTCAddress = (addr: string): boolean => {
    if (!addr) return false;
    const patterns = [
      /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      /^bc1[a-z0-9]{39,59}$/,
    ];
    return patterns.some((p) => p.test(addr));
  };

  const addressTrimmed = address.trim();
  const showFormatWarning = addressTrimmed.length > 0 && !isValidBTCAddress(addressTrimmed);

  const handleContinue = () => {
    if (!addressTrimmed) {
      setError("BTC address is required");
      return;
    }

    if (!confirmed) {
      setError("Please confirm the address is correct");
      return;
    }

    onContinue(addressTrimmed);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-display font-medium">BTC payout address</h2>
        <p className="text-sm text-muted-foreground">
          You can add this now, or later before your first payout.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="btcAddress" className="text-xs">
            Bitcoin address
          </Label>
          <Input
            id="btcAddress"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError("");
            }}
            placeholder="bc1q... or 1... or 3..."
            className="font-mono text-sm"
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          {showFormatWarning && !error && (
            <div className="flex items-start gap-1.5 text-xs text-amber-700">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>This doesn't look like a standard Bitcoin address. You can still continue if you're sure it's correct.</span>
            </div>
          )}
        </div>

        {/* Security warning */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Double-check—payouts can't be reversed.</span>
        </div>

        {/* Confirmation checkbox */}
        <div className="flex items-start gap-2 pt-2">
          <Checkbox
            id="confirmAddress"
            checked={confirmed}
            onCheckedChange={(checked) => {
              setConfirmed(!!checked);
              if (checked && error === "Please confirm the address is correct") {
                setError("");
              }
            }}
          />
          <Label
            htmlFor="confirmAddress"
            className="text-sm text-muted-foreground cursor-pointer leading-tight"
          >
            I confirm this address is correct and I control the private keys.
          </Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90"
        >
          Save & Continue
        </Button>
      </div>

      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Skip for now
          </button>
        </div>
      )}

      <p className="text-[10px] text-center text-muted-foreground">
        You can update this address later in Settings.
      </p>
    </div>
  );
};

export default PayoutAddressStep;
