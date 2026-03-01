import { TrendingUp } from "lucide-react";

interface MarketSignal {
  id: string;
  message: string;
}

interface MarketSignalsProps {
  signals: MarketSignal[];
}

const MarketSignals = ({ signals }: MarketSignalsProps) => {
  if (signals.length === 0) return null;

  return (
    <section className="border border-border bg-card/30 p-4 space-y-3">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5" />
        Market Signals
      </h2>
      
      <ul className="space-y-2">
        {signals.map((signal) => (
          <li 
            key={signal.id}
            className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-3"
          >
            {signal.message}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MarketSignals;
