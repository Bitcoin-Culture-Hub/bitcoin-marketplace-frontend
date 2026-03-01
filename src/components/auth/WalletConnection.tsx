import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletConnectionProps {
  onConnect?: () => void;
}

const WalletConnection = ({ onConnect }: WalletConnectionProps) => {
  return (
    <div className="border border-dashed border-border p-4 bg-muted/20">
      <div className="flex items-start gap-3">
        <Wallet className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Wallet connection is optional.</span>
            {" "}You can connect later when you buy, make offers, or set up payouts.
          </p>
          {onConnect && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onConnect}
              className="mt-2 h-8 text-xs text-muted-foreground hover:text-foreground px-0"
            >
              Connect wallet (optional)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
