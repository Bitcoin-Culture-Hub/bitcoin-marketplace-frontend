import { useState } from "react";
import { X, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PublishListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: {
    id: string;
    title: string;
    grade: string;
    image: string;
  };
  onPublish: (data: PublishData) => void;
  isPublishing?: boolean;
}

interface PublishData {
  frontImage: string;
  backImage: string;
  price: string;
  offersEnabled: boolean;
}

const PublishListingModal = ({
  open,
  onOpenChange,
  card,
  onPublish,
  isPublishing = false,
}: PublishListingModalProps) => {
  const [formData, setFormData] = useState<PublishData>({
    frontImage: "",
    backImage: "",
    price: "",
    offersEnabled: true,
  });

  const handleImageUpload = (field: "frontImage" | "backImage") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field: "frontImage" | "backImage") => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const isValid =
    formData.frontImage && formData.backImage && formData.price.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onPublish(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Publish Listing
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Publishing makes this card publicly visible and available for purchase.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Card Preview */}
          <div className="flex items-center gap-3 p-3 bg-card border border-border">
            <div className="w-12 h-16 bg-muted border border-border flex-shrink-0">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{card.title}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {card.grade}
              </p>
            </div>
          </div>

          {/* Required Notice */}
          <div className="flex items-start gap-2 p-3 bg-warning/5 border border-warning/20 text-warning text-xs">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Images and price are required to publish a listing publicly.
            </span>
          </div>

          {/* Images - Required */}
          <div className="space-y-3">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block">
              Card Images <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Front</p>
                {formData.frontImage ? (
                  <div className="relative aspect-[3/4] bg-muted border border-border">
                    <img
                      src={formData.frontImage}
                      alt="Front"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("frontImage")}
                      className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-[3/4] bg-card border-2 border-dashed border-border hover:border-muted-foreground cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload("frontImage")}
                    />
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Upload
                      </span>
                    </div>
                  </label>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Back</p>
                {formData.backImage ? (
                  <div className="relative aspect-[3/4] bg-muted border border-border">
                    <img
                      src={formData.backImage}
                      alt="Back"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("backImage")}
                      className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-[3/4] bg-card border-2 border-dashed border-border hover:border-muted-foreground cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload("backImage")}
                    />
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Upload
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Price - Required */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Price <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="bg-card border-border h-11 pl-7 font-mono"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Offers Toggle */}
          <div className="flex items-center justify-between p-3 bg-card border border-border">
            <div>
              <p className="text-sm font-medium">Accept Offers</p>
              <p className="text-xs text-muted-foreground">
                Allow buyers to submit offers below your asking price
              </p>
            </div>
            <Switch
              checked={formData.offersEnabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, offersEnabled: checked }))
              }
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isPublishing}
              className="flex-1 bg-foreground hover:bg-foreground/90 text-background font-display font-medium uppercase tracking-wider"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PublishListingModal;
