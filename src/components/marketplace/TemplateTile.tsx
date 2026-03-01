import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";

interface TemplateTileProps {
  id: string;
  name: string;
  series: string;
  cardNumber: string;
  image: string;
  availableCount: number;
  floorPriceBTC: number | null;
  offersAcceptedCount: number;
  isNewSupply?: boolean;
  isLowPop?: boolean;
}

const TemplateTile = ({
  id,
  name,
  series,
  cardNumber,
  image,
  availableCount,
  floorPriceBTC,
  offersAcceptedCount,
  isNewSupply,
  isLowPop,
}: TemplateTileProps) => {
  const navigate = useNavigate();
  const hasListings = availableCount > 0;

  return (
    <div
      onClick={() => navigate(`/marketplace/templates/${id}`)}
      className={`group cursor-pointer transition-all duration-200 ${
        hasListings 
          ? "hover:-translate-y-0.5" 
          : "opacity-60"
      }`}
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] bg-muted border border-border overflow-hidden group-hover:border-foreground/20 transition-colors">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        

      </div>

      {/* Content */}
      <div className="pt-3 space-y-2">
        {/* Title Block */}
        <div>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-foreground/80 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {series} • #{cardNumber}
          </p>
        </div>

        {/* Market Signal Block - THE VISUAL ANCHOR */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className={`text-sm font-medium ${hasListings ? "text-foreground" : "text-muted-foreground"}`}>
            {availableCount} available
          </span>
          <span className={`text-sm font-display font-medium ${hasListings ? "text-foreground" : "text-muted-foreground"}`}>
            {floorPriceBTC !== null 
              ? `From ${floorPriceBTC} BTC` 
              : "—"
            }
          </span>
        </div>


        {/* No listings state */}
        {!hasListings && (
          <p className="text-[11px] text-muted-foreground">
            No active listings
          </p>
        )}
      </div>
    </div>
  );
};

export default TemplateTile;
