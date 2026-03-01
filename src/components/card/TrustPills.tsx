import { Bitcoin, Shield, Award } from "lucide-react";

const TrustPills = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border text-xs text-foreground">
        <Bitcoin className="h-3 w-3" strokeWidth={2} />
        Bitcoin-only
      </span>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border text-xs text-foreground">
        <Shield className="h-3 w-3" strokeWidth={2} />
        Escrow-backed offers
      </span>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border text-xs text-foreground">
        <Award className="h-3 w-3" strokeWidth={2} />
        Graded-only
      </span>
    </div>
  );
};

export default TrustPills;
