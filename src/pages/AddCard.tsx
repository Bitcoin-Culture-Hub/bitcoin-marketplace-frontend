import { useState } from "react";
import { useSubmitCard } from "@/hooks/medusa/useSubmitCard";
import { useCardCatalog } from "@/hooks/medusa/useCardCatalog";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";


type VerificationState = "idle" | "checking" | "verified" | "not_found" | "exists";

const AddCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const submitCard = useSubmitCard();

  // Form state
  const [cardSet, setCardSet] = useState("");
  const [cardName, setCardName] = useState("");
  const [gradingCompany, setGradingCompany] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [grade, setGrade] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [listingIntent, setListingIntent] = useState<"private" | "fixed" | "both">("private");
  const [askPrice, setAskPrice] = useState("");

  // Card catalog loaded from the database
  const { data: cardSets = {}, isLoading: isCatalogLoading } = useCardCatalog();

  const availableCards = cardSet ? cardSets[cardSet] || [] : [];

  // Verification state
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock verification lookup
  const handleCertLookup = () => {
    if (!certNumber || !gradingCompany) return;

    setVerificationState("checking");

    // Simulate API call
    setTimeout(() => {
      // Mock logic: cert starting with "999" = already exists, "888" = not found
      if (certNumber.startsWith("999")) {
        setVerificationState("exists");
      } else if (certNumber.startsWith("888")) {
        setVerificationState("not_found");
      } else {
        setVerificationState("verified");
        // Auto-fill grade if verified
        if (!grade) setGrade("10");
      }
    }, 1000);
  };

  // Photo upload excluded per design

  // Form validation
  const isFormValid =
    gradingCompany &&
    certNumber &&
    grade &&
    ownershipConfirmed;

  // Submit handler
  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await submitCard.mutateAsync({
        cardSet,
        cardName,
        gradingCompany,
        certNumber,
        grade,
        serialNumber,
        listingIntent,
        askPrice: listingIntent !== "private" ? askPrice : undefined,
      });
      toast({
        title: "Added to your collection ✓",
        description: `${gradingCompany} ${grade} · Cert #${certNumber}`,
      });
      navigate("/inventory");
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err?.message || "Could not add card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-medium text-foreground">
            Add Card to Collection
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a graded card using its certification number. Private by default.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Section 1: Grading Details (Primary) */}
          <section className="space-y-4 p-6 border-2 border-foreground bg-card">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Grading Details
            </h2>

            {/* Grading Company */}
            <div className="space-y-2">
              <Label htmlFor="grading-company">Grading Company *</Label>
              <Select value={gradingCompany} onValueChange={setGradingCompany}>
                <SelectTrigger id="grading-company" className="w-full">
                  <SelectValue placeholder="Select grading company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PSA">PSA</SelectItem>
                  <SelectItem value="BGS">BGS (Beckett)</SelectItem>
                  <SelectItem value="SGC">SGC</SelectItem>
                  <SelectItem value="TAG">TAG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certification Number */}
            <div className="space-y-2">
              <Label htmlFor="cert-number">Certification Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="cert-number"
                  value={certNumber}
                  onChange={(e) => {
                    setCertNumber(e.target.value);
                  }}
                  placeholder="e.g., 87654321"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade" className="w-full">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 (Gem Mint)</SelectItem>
                  <SelectItem value="9.5">9.5</SelectItem>
                  <SelectItem value="9">9 (Mint)</SelectItem>
                  <SelectItem value="8.5">8.5</SelectItem>
                  <SelectItem value="8">8 (NM-MT)</SelectItem>
                  <SelectItem value="7.5">7.5</SelectItem>
                  <SelectItem value="7">7 (NM)</SelectItem>
                  <SelectItem value="6.5">6.5</SelectItem>
                  <SelectItem value="6">6 (EX-MT)</SelectItem>
                  <SelectItem value="5.5">5.5</SelectItem>
                  <SelectItem value="5">5 (EX)</SelectItem>
                  <SelectItem value="4">4 (VG-EX)</SelectItem>
                  <SelectItem value="3">3 (VG)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Serial Number (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="serial-number">
                Serial Number <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="serial-number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g., 12/50"
                className="font-mono"
              />
            </div>
          </section>

          {/* Ownership Confirmation */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Ownership
            </h2>

            <div className="flex items-start gap-3 p-4 border border-border bg-muted/30 rounded-sm">
              <Checkbox
                id="ownership"
                checked={ownershipConfirmed}
                onCheckedChange={(checked) => setOwnershipConfirmed(checked === true)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="ownership" className="text-sm font-medium cursor-pointer">
                  I confirm I own this graded card
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This card will be added to your private collection.
                </p>
              </div>
            </div>
          </section>

          {/* Card Identity (Optional) */}
          <section className="space-y-4 p-6 border border-border bg-card">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
              Card Identity <span className="normal-case text-muted-foreground font-normal">(optional)</span>
            </h2>

            <div className="space-y-2">
              <Label htmlFor="card-set">Card Set</Label>
              <Select value={cardSet} onValueChange={(val) => { setCardSet(val); setCardName(""); }} disabled={isCatalogLoading}>
                <SelectTrigger id="card-set" className="w-full">
                  <SelectValue placeholder={isCatalogLoading ? "Loading card sets..." : "Select card set"} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(cardSets).map((set) => (
                    <SelectItem key={set} value={set}>{set}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-name">Card Name</Label>
              <Select value={cardName} onValueChange={setCardName} disabled={!cardSet}>
                <SelectTrigger id="card-name" className="w-full">
                  <SelectValue placeholder={cardSet ? "Select card name" : "Select a set first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCards.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Optional Section */}
          <section className="space-y-6 pt-4 border-t border-border">

            {/* Listing */}
            <div className="space-y-4 opacity-40 pointer-events-none select-none">
              <h3 className="text-sm font-medium text-foreground">
                Listing <span className="text-xs font-normal text-muted-foreground">(Coming Soon)</span>
              </h3>

              <RadioGroup
                value={listingIntent}
                className="space-y-2"
              >
                {[
                  { value: "private", label: "Add to private collection only", description: "Card stays private. You can list it later." },
                  { value: "fixed", label: "Fixed price only", description: "Buyer can purchase immediately at your ask." },
                  { value: "both", label: "Fixed price + Offers", description: "Buyers can buy now or place an escrow-backed offer." },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 border border-border cursor-pointer transition-colors ${
                      listingIntent === option.value ? "border-foreground bg-card" : "bg-card/30"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`listing-${option.value}`} className="mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor={`listing-${option.value}`} className="text-sm font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Pricing */}
            <div className={`space-y-4 transition-opacity ${listingIntent === "private" ? "opacity-40 pointer-events-none" : ""}`}>
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider">
                Pricing
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Ask Price (BTC)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">The price a buyer pays to purchase immediately.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.00000001"
                    min="0"
                    value={askPrice}
                    onChange={(e) => setAskPrice(e.target.value)}
                    placeholder="0.00000000"
                    className="font-mono pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    BTC
                  </span>
                </div>
                {askPrice && (
                  <p className="text-xs text-muted-foreground">
                    ≈ ${(parseFloat(askPrice || "0") * 65000).toLocaleString()} USD
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => navigate("/inventory")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add to Collection"
              )}
            </Button>
          </div>
        </div>

        {/* Trust Footer */}
        <p className="text-[10px] text-muted-foreground text-center mt-8">
          Graded-only. Bitcoin-only. Your collection is private by default.
        </p>
      </main>
    </div>
  );
};

export default AddCard;
