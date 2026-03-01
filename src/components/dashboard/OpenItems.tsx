import { useState } from "react";
import { ChevronDown, ChevronRight, Shield } from "lucide-react";

interface OpenItem {
  id: string;
  title: string;
  status: string;
}

interface OpenItemsProps {
  items: OpenItem[];
}

const OpenItems = ({ items }: OpenItemsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasItems = items.length > 0;

  return (
    <section className="border border-border bg-card/30">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Open Items
          </span>
          {hasItems && (
            <span className="text-xs text-warning">
              {items.length} pending
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="border-t border-border p-4">
          {hasItems ? (
            <ul className="space-y-2">
              {items.map((item) => (
                <li 
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{item.title}</span>
                  <span className="text-xs text-warning">{item.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No disputes or unresolved issues.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default OpenItems;
