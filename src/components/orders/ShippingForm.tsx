import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, AlertTriangle, Truck, Copy, CheckCircle, ExternalLink, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderContext {
  templateName: string;
  grader: string;
  grade: string;
  buyerCity: string;
  buyerCountry: string;
  shipByDate?: string;
}

interface ShippingData {
  carrier: string;
  customCarrier?: string;
  trackingNumber: string;
  shippingNotes?: string;
  shippedAt?: string;
}

interface ShippingFormProps {
  orderContext: OrderContext;
  escrowStatus: "locked" | "released" | "frozen";
  orderStatus: "awaiting_shipment" | "shipped" | "delivered" | "disputed" | "completed";
  existingShipping?: ShippingData;
  onSubmit: (data: ShippingData) => Promise<void>;
  onViewDispute?: () => void;
}

const carriers = [
  { value: "usps", label: "USPS" },
  { value: "ups", label: "UPS" },
  { value: "fedex", label: "FedEx" },
  { value: "dhl", label: "DHL" },
  { value: "other", label: "Other" },
];

const getTrackingUrl = (carrier: string, trackingNumber: string): string | null => {
  const cleanTracking = trackingNumber.replace(/\s/g, "");
  switch (carrier) {
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleanTracking}`;
    case "ups":
      return `https://www.ups.com/track?tracknum=${cleanTracking}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${cleanTracking}`;
    case "dhl":
      return `https://www.dhl.com/en/express/tracking.html?AWB=${cleanTracking}`;
    default:
      return null;
  }
};

const ShippingForm = ({
  orderContext,
  escrowStatus,
  orderStatus,
  existingShipping,
  onSubmit,
  onViewDispute,
}: ShippingFormProps) => {
  const [carrier, setCarrier] = useState(existingShipping?.carrier || "");
  const [customCarrier, setCustomCarrier] = useState(existingShipping?.customCarrier || "");
  const [trackingNumber, setTrackingNumber] = useState(existingShipping?.trackingNumber || "");
  const [shippingNotes, setShippingNotes] = useState(existingShipping?.shippingNotes || "");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!existingShipping);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const isDisputed = orderStatus === "disputed" || escrowStatus === "frozen";
  const isAlreadyShipped = orderStatus !== "awaiting_shipment" && existingShipping;
  const canSubmit = escrowStatus === "locked" && orderStatus === "awaiting_shipment";

  const effectiveCarrier = carrier === "other" ? customCarrier : carrier;
  const isFormValid = 
    carrier && 
    (carrier !== "other" || customCarrier.trim()) && 
    trackingNumber.trim().length >= 6 && 
    confirmed;

  const handleSubmit = async () => {
    if (!isFormValid || !canSubmit) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        carrier: effectiveCarrier,
        customCarrier: carrier === "other" ? customCarrier : undefined,
        trackingNumber: trackingNumber.trim(),
        shippingNotes: shippingNotes.trim() || undefined,
        shippedAt: new Date().toISOString(),
      });
      setShowSuccess(true);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber.replace(/\s/g, ""));
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const carrierLabel = carriers.find((c) => c.value === carrier)?.label || customCarrier || carrier;
  const trackingUrl = getTrackingUrl(carrier, trackingNumber);

  // Escrow not locked - block shipping
  if (escrowStatus !== "locked" && orderStatus === "awaiting_shipment") {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Cannot Ship Yet</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Escrow is not locked. Shipping can't be recorded until funds are secured.
        </p>
      </div>
    );
  }

  // Disputed state - read-only
  if (isDisputed) {
    return (
      <div className="space-y-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Dispute Open — Escrow Frozen</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Shipping details are locked during dispute resolution.
          </p>
          {onViewDispute && (
            <Button variant="outline" size="sm" onClick={onViewDispute}>
              View Dispute
            </Button>
          )}
        </div>

        {existingShipping && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Shipping Details (Read-only)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carrier</span>
                <span className="text-foreground">{carrierLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{existingShipping.trackingNumber}</code>
              </div>
              {existingShipping.shippedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipped</span>
                  <span className="text-foreground">{new Date(existingShipping.shippedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Already shipped - show read-only with optional edit
  if (isAlreadyShipped && !isEditing) {
    return (
      <div className="space-y-4">
        {showSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-600">Marked as shipped ✓</p>
              <p className="text-xs text-muted-foreground">Buyer notified</p>
            </div>
          </div>
        )}

        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Tracking Information
            </h4>
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle className="h-3 w-3 mr-1" />
              Shipped
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Carrier</span>
              <Badge variant="secondary">{carrierLabel.toUpperCase()}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tracking #</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {existingShipping.trackingNumber}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleCopyTracking}
                >
                  {copiedTracking ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {existingShipping.shippedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Shipped at</span>
                <span className="text-sm text-foreground">
                  {new Date(existingShipping.shippedAt).toLocaleString()}
                </span>
              </div>
            )}

            {existingShipping.shippingNotes && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Notes:</span>
                <p className="text-sm text-foreground mt-1">{existingShipping.shippingNotes}</p>
              </div>
            )}

            {trackingUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 gap-2"
                onClick={() => window.open(trackingUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Track Package
              </Button>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-muted-foreground hover:text-foreground underline mt-4"
          >
            Update tracking
          </button>
        </div>
      </div>
    );
  }

  // Editable form
  return (
    <div className="space-y-5">
      {/* Order Context Strip */}
      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{orderContext.templateName}</span>
            <Badge variant="outline" className="text-xs">
              {orderContext.grader} {orderContext.grade}
            </Badge>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1",
              escrowStatus === "locked" 
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            )}
          >
            <Lock className="h-3 w-3" />
            Escrow Locked ✓
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Ship to: {orderContext.buyerCity}, {orderContext.buyerCountry}</span>
          {orderContext.shipByDate && (
            <span className="text-amber-600">Ship by: {orderContext.shipByDate}</span>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="carrier">Carrier</Label>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger id="carrier">
              <SelectValue placeholder="Select carrier" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {carriers.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {carrier === "other" && (
          <div className="space-y-2">
            <Label htmlFor="customCarrier">Carrier Name</Label>
            <Input
              id="customCarrier"
              value={customCarrier}
              onChange={(e) => setCustomCarrier(e.target.value)}
              placeholder="Enter carrier name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tracking">Tracking Number</Label>
          <Input
            id="tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g., 9400 1000 0000 0000 0000 00"
            className="font-mono"
          />
          {trackingNumber && trackingNumber.trim().length < 6 && (
            <p className="text-xs text-destructive">Tracking number too short</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Shipping Notes (optional)</Label>
          <Textarea
            id="notes"
            value={shippingNotes}
            onChange={(e) => setShippingNotes(e.target.value)}
            placeholder="Packaging notes, signature required, etc."
            rows={2}
            className="resize-none"
          />
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="space-y-2">
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
          <Checkbox
            id="confirm-tracking"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
            className="mt-0.5"
          />
          <div>
            <Label htmlFor="confirm-tracking" className="text-sm font-medium cursor-pointer">
              I confirm this tracking number is correct
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Buyers will see this tracking immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="flex-1 gap-2"
        >
          <Truck className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Mark Shipped"}
        </Button>
        {isAlreadyShipped && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Mark shipped creates an auditable system event.
      </p>
    </div>
  );
};

export default ShippingForm;
