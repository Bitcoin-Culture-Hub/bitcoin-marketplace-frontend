import { useState } from "react";
import { Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CreateStorefrontStepProps {
  initialName: string;
  onContinue: (name: string) => void;
  onBack: () => void;
}

const CreateStorefrontStep = ({
  initialName,
  onContinue,
  onBack,
}: CreateStorefrontStepProps) => {
  const [storeName, setStoreName] = useState(initialName);
  const [error, setError] = useState("");

  const handleContinue = () => {
    const trimmed = storeName.trim();
    if (!trimmed) {
      setError("Store name is required.");
      return;
    }
    if (trimmed.length < 3) {
      setError("Store name must be at least 3 characters.");
      return;
    }
    setError("");
    onContinue(trimmed);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-display font-medium text-foreground">
            Create your storefront
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose a name for your public storefront. This will appear on your listings and profile.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Store Name <span className="text-destructive">*</span>
        </Label>
        <Input
          type="text"
          placeholder="e.g., Premium Cards Co"
          value={storeName}
          onChange={(e) => {
            setStoreName(e.target.value);
            if (error) setError("");
          }}
          className="rounded-none"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground">
          This will appear on your storefront and listings.
        </p>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {/* Store preview */}
      {storeName.trim() && (
        <div className="bg-card border border-border p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
            Store preview
          </p>
          <div className="space-y-1">
            <p className="text-lg font-display font-medium text-foreground">
              {storeName.trim()}
            </p>
            <p className="text-xs text-muted-foreground">
              Member since {new Date().getFullYear()}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={handleContinue}
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-display uppercase tracking-wider"
        >
          Create Storefront
        </Button>
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full text-muted-foreground"
        >
          ← Back
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        You can edit your store details anytime from your inventory page.
      </p>
    </div>
  );
};

export default CreateStorefrontStep;
