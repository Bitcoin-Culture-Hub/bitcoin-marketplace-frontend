import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, CheckCircle, Clock, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ListingData {
  id: string;
  sellerId: string;
  sellerName: string;
  grade: string;
  gradingCompany: string;
  certNumber: string;
  price: number;
  offersEnabled: boolean;
}

interface CardData {
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  frontImage: string;
}

interface MakeOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: ListingData;
  card: CardData;
}

const MakeOfferModal = ({ open, onOpenChange, listing, card }: MakeOfferModalProps) => {
  const navigate = useNavigate();
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNotes, setOfferNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock BTC conversion rate
  const btcRate = 97500;
  const askingPriceInBtc = (listing.price / btcRate).toFixed(6);
  const offerAmountNum = parseFloat(offerAmount) || 0;
  const offerInUsd = offerAmountNum * btcRate;

  const isValidOffer = offerAmountNum > 0;
  const expirationHours = 48;

  const handleSubmit = async () => {
    if (!isValidOffer) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setOfferAmount("");
    setOfferNotes("");
    setIsSubmitted(false);
    onOpenChange(false);
  };

  // Post-submission confirmation state
  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md p-0 gap-0 bg-background border-border overflow-hidden">
          {/* Success State */}
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-accent" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-xl font-display font-medium text-foreground mb-2">
              Offer Submitted
            </h2>
            
            <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
              The seller has been notified and will respond within {expirationHours} hours.
            </p>

            {/* Offer Summary */}
            <div className="bg-muted/30 border border-border p-6 mb-8 text-left">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Your Offer
                </span>
                <div className="text-right">
                  <span className="font-mono text-lg font-medium text-foreground">
                    {offerAmount} BTC
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    ≈ ${offerInUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-amber-600">
                  <Clock className="h-3.5 w-3.5" />
                  Awaiting Response
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  handleClose();
                  navigate("/inventory");
                }}
                className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-display text-sm uppercase tracking-wider rounded-none"
              >
                View My Offers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="w-full h-10 text-sm text-muted-foreground hover:text-foreground"
              >
                Return to Listing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-background border-border overflow-hidden">
        {/* Minimal Header */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-xl font-display font-medium text-foreground">
            Make an Offer
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Submit a private offer to the seller
          </p>
        </div>

        {/* Card Summary - Compact */}
        <div className="px-8 pb-6">
          <div className="flex gap-5 p-5 bg-muted/30 border border-border">
            {/* Card Image */}
            <div className="flex-shrink-0">
              <img
                src={card.frontImage}
                alt={card.name}
                className="w-20 h-28 object-cover"
              />
            </div>

            {/* Card Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-sm font-medium text-foreground leading-tight">
                  {card.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {card.series} • {card.year}
                </p>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  {/* Grade Badge */}
                  <div className="bg-foreground text-background px-2 py-0.5 text-[10px] font-mono font-medium inline-block mb-1.5">
                    {listing.gradingCompany} {listing.grade}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Asking
                    </span>
                    <span className="font-mono text-base font-medium text-foreground">
                      ${listing.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleClose();
                    navigate(`/store/${listing.sellerId}`);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {listing.sellerName}
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-8" />

        {/* Offer Input Section */}
        <div className="px-8 py-6 space-y-5">
          {/* Offer Amount */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
              Your Offer
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.000001"
                min="0"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="0.000000"
                className="h-14 text-xl font-mono pr-16 rounded-none border-border bg-transparent focus:ring-1 focus:ring-accent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-muted-foreground">
                BTC
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              {offerAmountNum > 0 ? (
                <p className="text-xs text-muted-foreground font-mono">
                  ≈ ${offerInUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Asking: {askingPriceInBtc} BTC
                </p>
              )}
              {offerAmountNum > 0 && offerAmountNum * btcRate < listing.price && (
                <span className="text-[10px] text-muted-foreground">
                  {(((listing.price - offerInUsd) / listing.price) * 100).toFixed(0)}% below asking
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Terms - Minimal */}
        <div className="px-8 py-4 bg-muted/20 border-t border-border">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Offers are binding upon acceptance. Expires in {expirationHours}h if no response. 
            Settlement in BTC is required immediately upon acceptance.
          </p>
        </div>

        {/* Actions */}
        <div className="px-8 py-5 border-t border-border flex gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1 h-12 text-sm text-muted-foreground hover:text-foreground rounded-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidOffer || isSubmitting}
            className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display text-sm uppercase tracking-wider rounded-none disabled:opacity-40"
          >
            {isSubmitting ? "Submitting..." : "Submit Offer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
