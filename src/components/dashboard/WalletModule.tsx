import { Wallet, Lock, History, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface WalletModuleProps {
  availableBTC: string;
  lockedBTC: string;
  clearingBTC?: string;
  lifetimeSettled?: string;
  onWithdraw?: () => void;
  onViewHistory?: () => void;
  onViewWallet?: () => void;
}

const WalletModule = ({
  availableBTC,
  lockedBTC,
  clearingBTC,
  lifetimeSettled,
  onWithdraw,
  onViewHistory,
  onViewWallet,
}: WalletModuleProps) => {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  return (
    <section className="border border-border bg-card/30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">
            Escrow & Wallet
          </h2>
        </div>
      </div>

      {/* Balances */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
              Available
            </span>
            <span className="text-lg font-mono font-medium text-foreground">
              {availableBTC}
            </span>
            <span className="text-xs text-muted-foreground ml-1">BTC</span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Locked in Escrow
              </span>
            </div>
            <span className="text-lg font-mono font-medium text-muted-foreground mt-1 block">
              {lockedBTC}
            </span>
            <span className="text-xs text-muted-foreground ml-1">BTC</span>
          </div>

          {clearingBTC && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Clearing
              </span>
              <span className="text-lg font-mono font-medium text-muted-foreground">
                {clearingBTC}
              </span>
              <span className="text-xs text-muted-foreground ml-1">BTC</span>
            </div>
          )}

          {lifetimeSettled && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Lifetime Settled
              </span>
              <span className="text-lg font-mono font-medium text-muted-foreground">
                {lifetimeSettled}
              </span>
              <span className="text-xs text-muted-foreground ml-1">BTC</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground mt-3">
          Available can be withdrawn. Locked is reserved for escrow.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground h-7 gap-1.5"
            onClick={onViewWallet}
          >
            <Wallet className="h-3.5 w-3.5" />
            View Wallet
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground h-7 gap-1.5"
            onClick={onWithdraw}
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Withdraw
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground h-7 gap-1.5"
            onClick={onViewHistory}
          >
            <History className="h-3.5 w-3.5" />
            View History
          </Button>
        </div>
      </div>

      {/* How Escrow Works - Collapsible */}
      <Collapsible open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
        <CollapsibleTrigger className="w-full px-4 py-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors">
          <span>How escrow works</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              howItWorksOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex gap-3">
              <span className="text-foreground font-medium w-4">1.</span>
              <p>Buyer's funds lock in escrow when offer is submitted</p>
            </div>
            <div className="flex gap-3">
              <span className="text-foreground font-medium w-4">2.</span>
              <p>Seller ships card after accepting offer</p>
            </div>
            <div className="flex gap-3">
              <span className="text-foreground font-medium w-4">3.</span>
              <p>Buyer confirms receipt or dispute is opened</p>
            </div>
            <div className="flex gap-3">
              <span className="text-foreground font-medium w-4">4.</span>
              <p>Funds release to seller after confirmation</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export default WalletModule;
