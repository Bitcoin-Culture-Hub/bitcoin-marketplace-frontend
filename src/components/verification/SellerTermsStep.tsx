import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SellerTermsStepProps {
  onAccept: () => void;
  onBack: () => void;
}

const terms = [
  {
    id: "shipping-time",
    label: "I will ship within stated handling time.",
  },
  {
    id: "escrow-disputes",
    label: "I understand offers are escrow-backed and disputes may freeze payout.",
  },
  {
    id: "accept-terms",
    label: "I accept the Seller Terms.",
    isMain: true,
  },
];

const SellerTermsStep = ({ onAccept, onBack }: SellerTermsStepProps) => {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const allAccepted = terms.every((t) => accepted[t.id]);

  const handleToggle = (id: string, checked: boolean) => {
    setAccepted((prev) => ({ ...prev, [id]: checked }));
    setError("");
  };

  const handleAccept = () => {
    if (!allAccepted) {
      setError("Please accept all terms to continue.");
      return;
    }
    onAccept();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-display font-medium">Seller terms</h2>
        <p className="text-sm text-muted-foreground">
          To keep the marketplace safe for buyers and sellers.
        </p>
      </div>

      <div className="space-y-3 bg-card border border-border p-4">
        {terms.map((term) => (
          <div key={term.id} className="flex items-start gap-3">
            <Checkbox
              id={term.id}
              checked={!!accepted[term.id]}
              onCheckedChange={(checked) => handleToggle(term.id, !!checked)}
            />
            <Label
              htmlFor={term.id}
              className={`text-sm cursor-pointer leading-tight ${
                term.isMain ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {term.label}
            </Label>
          </div>
        ))}

        {error && <p className="text-xs text-destructive pt-2">{error}</p>}
      </div>

      {/* Links */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <a href="/terms#verification" className="flex items-center gap-1 hover:text-foreground">
          <ExternalLink className="h-3 w-3" />
          Seller Terms
        </a>
        <a href="/terms#rules" className="flex items-center gap-1 hover:text-foreground">
          <ExternalLink className="h-3 w-3" />
          Platform Rules
        </a>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleAccept}
          disabled={!allAccepted}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90"
        >
          Finish Verification
        </Button>
      </div>
    </div>
  );
};

export default SellerTermsStep;
