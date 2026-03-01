import { Wallet, Clock, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountSettlementProps {
  available: string;
  pending: string;
  lifetimeSettled: string;
}

const AccountSettlement = ({ available, pending, lifetimeSettled }: AccountSettlementProps) => {
  return (
    <section className="border border-border bg-card/30 p-6 space-y-4">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
        Account Settlement
      </h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" />
            <span className="text-xs uppercase tracking-wider">Available</span>
          </div>
          <p className="font-display text-xl font-medium text-foreground">{available}</p>
          <p className="text-[10px] text-muted-foreground">Cleared and withdrawable</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs uppercase tracking-wider">Pending</span>
          </div>
          <p className="font-display text-xl font-medium text-foreground">{pending}</p>
          <p className="text-[10px] text-muted-foreground">Awaiting clearance</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <History className="h-3.5 w-3.5" />
            <span className="text-xs uppercase tracking-wider">Lifetime</span>
          </div>
          <p className="font-display text-xl font-medium text-muted-foreground">{lifetimeSettled}</p>
          <p className="text-[10px] text-muted-foreground">Total settled</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-7">
          View settlement history
        </Button>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground h-7">
          Withdraw funds
        </Button>
      </div>
    </section>
  );
};

export default AccountSettlement;
