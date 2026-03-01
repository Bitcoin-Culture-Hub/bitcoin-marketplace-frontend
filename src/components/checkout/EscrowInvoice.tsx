import { useState, useEffect } from "react";
import { Copy, Check, Loader2, Bitcoin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type EscrowStatus = "PENDING" | "DETECTED" | "CONFIRMING" | "CONFIRMED" | "EXPIRED";

interface EscrowInvoiceProps {
  amountBTC: number;
  address: string;
  network: "lightning" | "onchain";
  status: EscrowStatus;
  expiresAt?: Date;
  onStatusChange?: (status: EscrowStatus) => void;
}

const EscrowInvoice = ({
  amountBTC,
  address,
  network,
  status,
  expiresAt,
  onStatusChange,
}: EscrowInvoiceProps) => {
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Timer for expiry
  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Expired");
        onStatusChange?.("EXPIRED");
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onStatusChange]);

  const copyToClipboard = async (text: string, type: "address" | "amount") => {
    await navigator.clipboard.writeText(text);
    if (type === "address") {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
    toast({ title: "Copied to clipboard" });
  };

  const formatBTC = (amount: number) => {
    return amount.toFixed(8);
  };

  const statusConfig: Record<EscrowStatus, { label: string; className: string; icon?: React.ReactNode }> = {
    PENDING: {
      label: "Waiting for payment…",
      className: "text-muted-foreground",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    },
    DETECTED: {
      label: "Payment detected…",
      className: "text-amber-600",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    },
    CONFIRMING: {
      label: "Confirming…",
      className: "text-amber-600",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    },
    CONFIRMED: {
      label: "Escrow funded ✓",
      className: "text-green-600 font-medium",
      icon: <Check className="h-4 w-4" />,
    },
    EXPIRED: {
      label: "Invoice expired",
      className: "text-destructive",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-display font-medium">Fund Escrow</h3>
        <p className="text-sm text-muted-foreground">
          Send exactly <strong className="font-mono text-foreground">{formatBTC(amountBTC)} BTC</strong> to lock funds in escrow.
        </p>
      </div>

      {/* Network indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        {network === "lightning" ? (
          <>
            <Zap className="h-3.5 w-3.5" />
            <span>Lightning Network</span>
          </>
        ) : (
          <>
            <Bitcoin className="h-3.5 w-3.5" />
            <span>On-chain</span>
          </>
        )}
        <span className="text-muted-foreground/50">·</span>
        <span>Auto-selected for this amount</span>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="w-48 h-48 bg-white border border-border flex items-center justify-center">
          {/* Placeholder for actual QR code */}
          <div className="w-40 h-40 bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">QR Code</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider text-center">
          {network === "lightning" ? "Lightning Invoice" : "Bitcoin Address"}
        </p>
        <div className="relative">
          <div className="bg-muted/50 border border-border px-4 py-3 pr-12">
            <p className="text-xs font-mono text-foreground break-all select-all">
              {address}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => copyToClipboard(address, "address")}
          >
            {copiedAddress ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Amount with copy */}
      <div className="flex items-center justify-center gap-2">
        <span className="font-mono text-sm">{formatBTC(amountBTC)} BTC</span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={() => copyToClipboard(formatBTC(amountBTC), "amount")}
        >
          {copiedAmount ? (
            <>
              <Check className="h-3 w-3 mr-1 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy amount
            </>
          )}
        </Button>
      </div>

      {/* Expiry timer */}
      {timeLeft && status !== "CONFIRMED" && (
        <p className={cn(
          "text-xs text-center",
          timeLeft === "Expired" ? "text-destructive" : "text-muted-foreground"
        )}>
          {timeLeft === "Expired" ? "Invoice expired" : `Expires in ${timeLeft}`}
        </p>
      )}

      {/* Status indicator */}
      <div className={cn(
        "flex items-center justify-center gap-2 p-3 border rounded-sm",
        status === "CONFIRMED"
          ? "bg-green-50 border-green-200"
          : status === "EXPIRED"
          ? "bg-destructive/5 border-destructive/20"
          : "bg-muted/30 border-border"
      )}>
        {statusConfig[status].icon}
        <span className={statusConfig[status].className}>
          {statusConfig[status].label}
        </span>
      </div>

      {/* Safety copy */}
      <div className="text-center space-y-1 pt-2">
        <p className="text-[10px] text-muted-foreground">
          Funds remain locked until receipt is confirmed or a dispute is resolved.
        </p>
        <p className="text-[10px] text-muted-foreground">
          This action is not reversible.
        </p>
      </div>
    </div>
  );
};

export default EscrowInvoice;
