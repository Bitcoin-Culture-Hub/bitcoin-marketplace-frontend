import { Check, Shield, MapPin, Wallet, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CheckoutMode } from "./ItemSummaryCard";

interface ConfirmationSummaryProps {
  mode: CheckoutMode;
  item: {
    templateName: string;
    gradingCompany: string;
    grade: string;
  };
  seller: {
    name: string;
    verified: boolean;
  };
  shippingAddress: {
    fullName: string;
    city: string;
    state: string;
  };
  totalBTC: number;
  escrowConfirmed: boolean;
}

const ConfirmationSummary = ({
  mode,
  item,
  seller,
  shippingAddress,
  totalBTC,
  escrowConfirmed,
}: ConfirmationSummaryProps) => {
  const formatBTC = (amount: number) => {
    return amount.toFixed(8).replace(/\.?0+$/, (m) => (m.length > 1 ? "" : m));
  };

  const summaryItems = [
    {
      icon: null,
      label: "Item",
      value: `${item.templateName} (${item.gradingCompany} ${item.grade})`,
    },
    {
      icon: Shield,
      label: "Seller",
      value: seller.name,
      badge: seller.verified ? "Verified" : undefined,
    },
    {
      icon: MapPin,
      label: "Ship to",
      value: `${shippingAddress.fullName}, ${shippingAddress.city}, ${shippingAddress.state}`,
    },
    {
      icon: Wallet,
      label: "Total funded",
      value: `${formatBTC(totalBTC)} BTC`,
      isMono: true,
    },
    {
      icon: Lock,
      label: "Escrow status",
      value: escrowConfirmed ? "Locked ✓" : "Pending",
      className: escrowConfirmed ? "text-green-600" : "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-display font-medium">
          {mode === "BUY_NOW" ? "Confirm Purchase" : "Submit Offer"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Review the details before finalizing.
        </p>
      </div>

      <div className="border border-border bg-card divide-y divide-border">
        {summaryItems.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between p-3">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <div className="text-right flex items-center gap-2">
              <span
                className={`text-sm ${item.isMono ? "font-mono" : ""} ${
                  item.className || "text-foreground"
                }`}
              >
                {item.value}
              </span>
              {item.badge && (
                <Badge variant="secondary" className="text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reassurance text */}
      <div className="text-center p-3 bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground">
          {mode === "BUY_NOW"
            ? "Seller will ship after order is created."
            : "Seller can accept instantly because funds are already locked."}
        </p>
      </div>
    </div>
  );
};

export default ConfirmationSummary;
