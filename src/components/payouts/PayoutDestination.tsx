import { useState } from "react";
import { Wallet, Eye, EyeOff, CheckCircle2, AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PayoutDestinationProps {
  address: string | null;
  isVerified: boolean;
  storefrontVerified: boolean;
  onChangeAddress: () => void;
  onAddAddress: () => void;
}

const PayoutDestination = ({
  address,
  isVerified,
  storefrontVerified,
  onChangeAddress,
  onAddAddress,
}: PayoutDestinationProps) => {
  const [revealed, setRevealed] = useState(false);

  const maskAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  return (
    <section className="border border-border bg-card/30 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
          Payout Destination
        </h2>
        {address && isVerified && (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
          >
            <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
            Verified destination
          </Badge>
        )}
      </div>

      {!storefrontVerified && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-medium">Verify storefront to receive payouts.</span>
            <div>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-amber-800 underline text-xs"
                asChild
              >
                <a href="/verify">Verify Storefront</a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {address ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-mono text-sm font-medium">
                {revealed ? address : maskAddress(address)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Payouts are sent to this address after escrow release.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setRevealed(!revealed)}
            >
              {revealed ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={onChangeAddress}
          >
            <Pencil className="h-3 w-3 mr-1.5" />
            Change address
          </Button>
        </div>
      ) : (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Wallet className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No payout address set</p>
            <p className="text-xs text-muted-foreground">
              Add a BTC address to receive payouts.
            </p>
          </div>
          <Button onClick={onAddAddress} size="sm">
            Add payout address
          </Button>
        </div>
      )}
    </section>
  );
};

export default PayoutDestination;
