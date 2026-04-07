import { Link } from "react-router-dom";
import {
  Layers,
  Plus,
  Upload,
  Tag,
  MessageSquare,
  Package,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  isVerified: boolean;
}

const QuickActions = ({ isVerified }: QuickActionsProps) => {
  const mainActions = [
    { label: "My Collection", icon: Layers, href: "/inventory" },
    { label: "Add Card", icon: Plus, href: "/submit" },
    { label: "Bulk Import", icon: Upload, href: "/import" },
    { label: "Offers", icon: MessageSquare, href: "/dashboard/offers" },
  ];

  const comingSoonActions = [
    { label: "Create Listing", icon: Tag, href: "/submit?step=listing" },
    { label: "Orders", icon: Package, href: "/orders" },
    { label: "Wallet", icon: Wallet, href: "/wallet" },
  ];

  return (
    <section className="mb-8">
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-2 items-center">
        {mainActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            asChild
          >
            <Link to={action.href}>
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          </Button>
        ))}

        <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-2">Coming soon:</span>

        {comingSoonActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 opacity-50 cursor-default"
            disabled
          >
            <action.icon className="h-3.5 w-3.5" />
            {action.label}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-green-300 text-green-700"
          disabled
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified Storefront
        </Button>
      </div>
    </section>
  );
};

export default QuickActions;
