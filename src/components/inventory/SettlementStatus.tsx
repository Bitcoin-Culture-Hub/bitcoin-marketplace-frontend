interface SettlementStatusProps {
  available: string;
  clearing: string;
  lifetimeSettled: string;
}

const SettlementStatus = ({
  available,
  clearing,
  lifetimeSettled,
}: SettlementStatusProps) => {
  return (
    <section className="border-t border-border pt-6 mt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">
              Available to withdraw
            </span>
            <span className="text-sm font-mono text-foreground">{available}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">
              Clearing
            </span>
            <span className="text-sm font-mono text-muted-foreground">{clearing}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">
              Lifetime settled
            </span>
            <span className="text-sm font-mono text-muted-foreground">{lifetimeSettled}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button className="hover:text-foreground transition-colors">
            View history
          </button>
          <span className="text-border">·</span>
          <button className="hover:text-foreground transition-colors">
            Withdraw
          </button>
        </div>
      </div>
    </section>
  );
};

export default SettlementStatus;
