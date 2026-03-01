import { Link } from "react-router-dom";
import {
  Layers,
  Tag,
  MessageSquare,
  Package,
  Wallet,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIWidgetsProps {
  collectionCount: number;
  activeListings: number;
  pendingOffers: number;
  ordersNeedingAction: number;
  walletAvailable: string;
  walletLocked: string;
  isVerified: boolean;
}

const KPIWidgets = ({
  collectionCount,
  activeListings,
  pendingOffers,
  ordersNeedingAction,
  walletAvailable,
  walletLocked,
  isVerified,
}: KPIWidgetsProps) => {
  const widgets = [
    {
      label: "Collection",
      value: `${collectionCount} cards`,
      icon: Layers,
      href: "/inventory",
      highlight: false,
    },
    {
      label: "Active Listings",
      value: "Coming soon",
      icon: Tag,
      href: "/inventory",
      highlight: false,
    },
    {
      label: "Offers",
      value: "Coming soon",
      icon: MessageSquare,
      href: "/inventory",
      highlight: false,
    },
    {
      label: "Orders",
      value: "Coming soon",
      icon: Package,
      href: "/inventory",
      highlight: false,
    },
    {
      label: "Wallet",
      value: "Coming soon",
      icon: Wallet,
      href: "/inventory",
      highlight: false,
    },
    {
      label: "Verification",
      value: isVerified ? "Verified" : "Not verified",
      icon: isVerified ? ShieldCheck : ShieldAlert,
      href: "/verify",
      highlight: !isVerified,
      verified: isVerified,
    },
  ];

  return (
    <section className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {widgets.map((widget) => (
          <Link
            key={widget.label}
            to={widget.href}
            className={cn(
              "block p-4 border border-border bg-card/30 hover:bg-card/60 transition-colors group",
              widget.highlight && "border-amber-300 bg-amber-50/50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <widget.icon
                className={cn(
                  "h-4 w-4 text-muted-foreground",
                  widget.highlight && "text-amber-600",
                  widget.verified && "text-green-600"
                )}
              />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {widget.label}
              </span>
            </div>
            <p
              className={cn(
                "text-sm font-medium text-foreground",
                widget.verified && "text-green-700",
                widget.highlight && !widget.verified && "text-amber-700"
              )}
            >
              {widget.value}
            </p>
            {'subValue' in widget && widget.subValue && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {String(widget.subValue)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default KPIWidgets;
