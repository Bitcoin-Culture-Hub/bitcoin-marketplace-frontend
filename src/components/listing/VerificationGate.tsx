import { ShieldCheck, Mail, MapPin, Wallet, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VerificationGateProps {
  returnTo?: string;
  itemId?: string;
  returnPath?: string;
}

const VerificationGate = ({
  returnTo = "publish_listing",
  itemId,
  returnPath = "/inventory",
}: VerificationGateProps) => {
  const navigate = useNavigate();

  const requirements = [
    { icon: Mail, label: "Email verified" },
    { icon: MapPin, label: "Ship-from address confirmed" },
    { icon: Wallet, label: "Bitcoin payout address set" },
    { icon: FileText, label: "Seller terms accepted" },
  ];

  const handleStartVerification = () => {
    const params = new URLSearchParams();
    params.set("returnTo", returnTo);
    if (itemId) params.set("itemId", itemId);
    navigate(`/verify?${params.toString()}`);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-muted border border-border rounded-full flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-display font-medium text-foreground">
            Verify your storefront to sell
          </h1>
          <p className="text-sm text-muted-foreground">
            Verification is required to publish listings, accept offers, ship, and receive payouts.
          </p>
        </div>

        <div className="bg-card border border-border p-4 text-left space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Requirements
          </p>
          <ul className="space-y-2">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                <req.icon className="h-4 w-4 shrink-0" />
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleStartVerification}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-display uppercase tracking-wider"
          >
            Start Verification
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(returnPath)}
            className="w-full text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collection
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Your listing draft will be preserved.
        </p>
      </div>
    </div>
  );
};

export default VerificationGate;
