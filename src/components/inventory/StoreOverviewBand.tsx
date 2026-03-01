import { useState } from "react";
import { Shield, Check, X, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StoreOverviewBandProps {
  storeName: string;
  isVerified: boolean;
  location: string;
  memberSince: string;
  available: string;
  clearing: string;
  lifetimeSettled: string;
  onUpdateStoreName?: (name: string) => void;
  onUpdateLocation?: (location: string) => void;
}

const StoreOverviewBand = ({
  storeName,
  isVerified,
  location,
  memberSince,
  available,
  clearing,
  lifetimeSettled,
  onUpdateStoreName,
  onUpdateLocation,
}: StoreOverviewBandProps) => {
  const [editingField, setEditingField] = useState<"name" | "location" | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (field: "name" | "location") => {
    setEditingField(field);
    setEditValue(field === "name" ? storeName : location);
  };

  const saveEdit = () => {
    if (editingField === "name" && onUpdateStoreName) {
      onUpdateStoreName(editValue);
    } else if (editingField === "location" && onUpdateLocation) {
      onUpdateLocation(editValue);
    }
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <section className="border-t border-border pt-6 mt-10 space-y-8">

      {/* Settlement Status */}
      <div>
        <h2 className="text-lg font-display font-medium mb-3">Settlement Status</h2>
          
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-muted-foreground block mb-0.5">
                Available
              </span>
              <span className="text-sm font-mono text-foreground">{available}</span>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div>
              <span className="text-[10px] text-muted-foreground block mb-0.5">
                Clearing
              </span>
              <span className="text-sm font-mono text-muted-foreground">{clearing}</span>
            </div>
            <div className="h-8 w-px bg-border/50" />
            <div>
              <span className="text-[10px] text-muted-foreground block mb-0.5">
                Lifetime settled
              </span>
              <span className="text-sm font-mono text-muted-foreground">{lifetimeSettled}</span>
            </div>
          </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
          <button className="hover:text-foreground transition-colors">
            View history
          </button>
          <span className="text-border">·</span>
          <button className="hover:text-foreground transition-colors">
            Withdraw
          </button>
        </div>
      </div>

      {/* How Settlement Works */}
      <div className="border border-border bg-muted/30 p-6">
        <h3 className="font-display text-base font-medium text-foreground mb-4">
          How Settlement Works
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-4">
            <span className="text-foreground font-medium w-5">1.</span>
            <p>List a card for sale with your asking price</p>
          </div>
          <div className="flex gap-4">
            <span className="text-foreground font-medium w-5">2.</span>
            <p>Buyer commits to purchase—funds move to clearing</p>
          </div>
          <div className="flex gap-4">
            <span className="text-foreground font-medium w-5">3.</span>
            <p>Ship the card and confirm delivery</p>
          </div>
          <div className="flex gap-4">
            <span className="text-foreground font-medium w-5">4.</span>
            <p>Funds settle to your account after confirmation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreOverviewBand;
