import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

interface CardTemplate {
  id: string;
  name: string;
  series: string;
  availableCount: number;
  fromPriceBTC: string;
  offersAccepted: boolean;
}

const featuredTemplates: CardTemplate[] = [
  {
    id: "1",
    name: "Satoshi Nakamoto Genesis",
    series: "Series 1 OPP",
    availableCount: 12,
    fromPriceBTC: "0.85",
    offersAccepted: true,
  },
  {
    id: "2",
    name: "Bitcoin Whitepaper",
    series: "Commemorative",
    availableCount: 8,
    fromPriceBTC: "1.2",
    offersAccepted: true,
  },
  {
    id: "3",
    name: "Block 0 Genesis",
    series: "Series 1 OPP",
    availableCount: 5,
    fromPriceBTC: "0.45",
    offersAccepted: true,
  },
  {
    id: "4",
    name: "Hal Finney Tribute",
    series: "Series 2 OPP",
    availableCount: 18,
    fromPriceBTC: "0.32",
    offersAccepted: false,
  },
  {
    id: "5",
    name: "Lightning Network Launch",
    series: "Commemorative",
    availableCount: 9,
    fromPriceBTC: "0.28",
    offersAccepted: true,
  },
  {
    id: "6",
    name: "Bitcoin Pizza Day",
    series: "Commemorative",
    availableCount: 14,
    fromPriceBTC: "0.55",
    offersAccepted: true,
  },
];

const FeaturedTemplates = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-display text-xl font-medium text-foreground mb-8">
          Featured Cards
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredTemplates.map((template) => (
            <Link
              key={template.id}
              to={`/card/${template.id}`}
              className="group border border-border bg-card hover:bg-muted/50 transition-colors p-4"
            >
              {/* Card Info */}
              <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1">
                {template.name}
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">
                {template.series}
              </p>

              {/* Availability */}
              <div className="text-xs text-muted-foreground mb-1">
                {template.availableCount} available
              </div>

              {/* Price + Offer Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-foreground">
                  From {template.fromPriceBTC} BTC
                </span>
                {template.offersAccepted && (
                  <MessageSquare className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTemplates;
