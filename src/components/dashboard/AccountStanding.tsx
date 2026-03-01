import { CheckCircle, ShieldCheck, AlertTriangle } from "lucide-react";

interface AccountStandingProps {
  isGoodStanding: boolean;
  storefrontVerified: boolean;
  listingsCompliant: boolean;
  hasDisputes: boolean;
}

const AccountStanding = ({ 
  isGoodStanding, 
  storefrontVerified, 
  listingsCompliant, 
  hasDisputes 
}: AccountStandingProps) => {
  return (
    <div className="flex items-start gap-4 p-4 border border-border bg-card/30">
      <div className="flex-shrink-0">
        {isGoodStanding ? (
          <ShieldCheck className="h-5 w-5 text-success" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-warning" />
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Account Standing:
          </span>
          <span className={`text-xs font-medium ${isGoodStanding ? 'text-success' : 'text-warning'}`}>
            {isGoodStanding ? 'In good standing' : 'Attention needed'}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className={`flex items-center gap-1.5 ${storefrontVerified ? 'text-muted-foreground' : 'text-warning'}`}>
            <CheckCircle className="h-3 w-3" />
            {storefrontVerified ? 'Storefront verified' : 'Storefront pending'}
          </span>
          
          <span className={`flex items-center gap-1.5 ${listingsCompliant ? 'text-muted-foreground' : 'text-warning'}`}>
            <CheckCircle className="h-3 w-3" />
            {listingsCompliant ? 'Listings compliant' : 'Review listings'}
          </span>
          
          <span className={`flex items-center gap-1.5 ${!hasDisputes ? 'text-muted-foreground' : 'text-warning'}`}>
            <CheckCircle className="h-3 w-3" />
            {!hasDisputes ? 'No unresolved disputes' : 'Disputes pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountStanding;
