import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ListingData {
  priceBTC: number;
  acceptsOffers: boolean;
  minOfferBTC: number;
}

interface EditListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: ListingData;
  cardName: string;
  grade: string;
  gradingCompany: string;
  onSave: (data: ListingData) => void;
}

const EditListingModal = ({
  open,
  onOpenChange,
  listing,
  cardName,
  grade,
  gradingCompany,
  onSave,
}: EditListingModalProps) => {
  const [priceBTC, setPriceBTC] = useState(listing.priceBTC.toString());
  const [acceptsOffers, setAcceptsOffers] = useState(listing.acceptsOffers);
  const [minOfferBTC, setMinOfferBTC] = useState(listing.minOfferBTC.toString());

  const estimatedUSD = (parseFloat(priceBTC) || 0) * 104000;
  const minOfferUSD = (parseFloat(minOfferBTC) || 0) * 104000;

  const handleSave = () => {
    onSave({
      priceBTC: parseFloat(priceBTC) || 0,
      acceptsOffers,
      minOfferBTC: parseFloat(minOfferBTC) || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-display">Edit Listing</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Card Identity */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-sm border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{cardName}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="outline" className="font-mono font-bold text-sm px-2 py-0.5">
                {grade}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {gradingCompany}
              </Badge>
            </div>
          </div>

          {/* Ask Price */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">
              Ask Price
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.001"
                min="0"
                value={priceBTC}
                onChange={(e) => setPriceBTC(e.target.value)}
                className="font-mono"
                placeholder="0.000"
              />
              <span className="text-sm text-muted-foreground shrink-0">BTC</span>
            </div>
            {parseFloat(priceBTC) > 0 && (
              <p className="text-xs text-muted-foreground">
                ≈ ${estimatedUSD.toLocaleString()} USD
              </p>
            )}
          </div>

          {/* Accepts Offers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">
                Accept Offers
              </label>
              <Switch checked={acceptsOffers} onCheckedChange={setAcceptsOffers} />
            </div>

          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!parseFloat(priceBTC)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingModal;
