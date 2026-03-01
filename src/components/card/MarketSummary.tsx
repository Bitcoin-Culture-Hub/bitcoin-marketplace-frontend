import { MessageSquare } from "lucide-react";
import TrustPills from "./TrustPills";

interface MarketSummaryProps {
  floorPriceBTC: number | null;
  availableCount: number;
  offersAcceptedCount: number;
  topGrade?: string;
}

const MarketSummary = ({
  floorPriceBTC,
  availableCount,
  offersAcceptedCount,
  topGrade,
}: MarketSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Market Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Floor Price */}
        <div className="p-4 border border-border bg-muted/20">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
            From
          </span>
          <span className="text-xl font-display font-medium text-foreground">
            {floorPriceBTC !== null ? `${floorPriceBTC} BTC` : "—"}
          </span>
        </div>

        {/* Available */}
        <div className="p-4 border border-border bg-muted/20">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
            Available
          </span>
          <span className="text-xl font-display font-medium text-foreground">
            {availableCount} {availableCount === 1 ? "copy" : "copies"}
          </span>
        </div>
      </div>


    </div>
  );
};

export default MarketSummary;
