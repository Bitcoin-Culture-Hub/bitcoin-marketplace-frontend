import { Check, Mail, MapPin, Wallet, FileText, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationCompleteProps {
  onContinue: () => void;
  onDashboard: () => void;
}

const completedItems = [
  { icon: Mail, label: "Email verified" },
  { icon: MapPin, label: "Address saved" },
  { icon: Wallet, label: "Payout address saved" },
  { icon: FileText, label: "Terms accepted" },
  { icon: Store, label: "Storefront created" },
];

const VerificationComplete = ({
  onContinue,
  onDashboard,
}: VerificationCompleteProps) => {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-display font-medium">Storefront verified</h2>
        <p className="text-sm text-muted-foreground">
          You can now list, accept offers, ship, and receive payouts.
        </p>
      </div>

      {/* Completed checklist */}
      <div className="bg-card border border-border p-4 text-left space-y-2">
        {completedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4">
        <Button
          onClick={onContinue}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-display uppercase tracking-wider"
        >
          Continue
        </Button>
        <Button
          variant="ghost"
          onClick={onDashboard}
          className="w-full text-muted-foreground"
        >
          Go to Dashboard
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Graded-only. Bitcoin-only. Offers are escrow-backed.
      </p>
    </div>
  );
};

export default VerificationComplete;
