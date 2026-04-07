import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type CollectionState = "in_collection" | "wish_list" | "listed" | "in_escrow" | "sold";

interface CollectionStateTabsProps {
  activeState: CollectionState;
  onStateChange: (state: CollectionState) => void;
  counts: {
    in_collection: number;
    wish_list: number;
    listed: number;
    in_escrow: number;
    sold: number;
  };
}

const CollectionStateTabs = ({
  activeState,
  onStateChange,
  counts,
}: CollectionStateTabsProps) => {
  const tabs: { key: CollectionState; label: string }[] = [
    { key: "in_collection", label: "In Collection" },
    { key: "wish_list", label: "Wish List" },
    { key: "listed", label: "Listed" },
    { key: "in_escrow", label: "In Escrow" },
    { key: "sold", label: "Sold" },
  ];

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-0">
        {tabs.map((tab, index) => {
          const isActive = activeState === tab.key;
          const count = counts[tab.key];
          const isComingSoon = tab.key !== "in_collection" && tab.key !== "wish_list";

          return (
            <Fragment key={tab.key}>
              {index === 2 && (
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider ml-2 mr-1">Coming soon:</span>
              )}
              <button
                onClick={() => !isComingSoon && onStateChange(tab.key)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors relative",
                  isComingSoon && "opacity-50 cursor-default",
                  !isComingSoon && isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                disabled={isComingSoon}
              >
                <span>{tab.label}</span>
                {isActive && !isComingSoon && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionStateTabs;
