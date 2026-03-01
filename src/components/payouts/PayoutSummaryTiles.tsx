import { CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

interface PayoutSummaryTilesProps {
  eligible: string;
  pending: string;
  released: string;
  failedCount: number;
  activeFilter: string | null;
  onFilterClick: (filter: string | null) => void;
}

const PayoutSummaryTiles = ({
  eligible,
  pending,
  released,
  failedCount,
  activeFilter,
  onFilterClick,
}: PayoutSummaryTilesProps) => {
  const tiles = [
    {
      key: "eligible",
      label: "Eligible",
      value: eligible,
      icon: CheckCircle2,
      description: "Ready to send",
      color: "text-emerald-600",
      bgActive: "bg-emerald-50 border-emerald-200",
    },
    {
      key: "pending",
      label: "Pending",
      value: pending,
      icon: Clock,
      description: "Processing",
      color: "text-amber-600",
      bgActive: "bg-amber-50 border-amber-200",
    },
    {
      key: "released",
      label: "Released",
      value: released,
      icon: ArrowUpRight,
      description: "Sent successfully",
      color: "text-blue-600",
      bgActive: "bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          const isActive = activeFilter === tile.key;
          return (
            <button
              key={tile.key}
              onClick={() => onFilterClick(isActive ? null : tile.key)}
              className={`p-4 border rounded-sm text-left transition-all hover:border-foreground/20 ${
                isActive ? tile.bgActive : "border-border bg-card/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-3.5 w-3.5 ${tile.color}`} />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {tile.label}
                </span>
              </div>
              <p className="font-display text-lg font-medium">
                {tile.key === "failed" ? tile.value : `${tile.value} BTC`}
              </p>
              <p className="text-[10px] text-muted-foreground">{tile.description}</p>
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground">
        Eligible means escrow is released and payout is ready.
      </p>
    </div>
  );
};

export default PayoutSummaryTiles;
