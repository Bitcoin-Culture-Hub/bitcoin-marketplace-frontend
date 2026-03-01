import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";

interface MarketplaceCardProps {
  id: string;
  listingNumber: number;
  title: string;
  series: string;
  year: string;
  grade: string;
  certification: string;
  price: string;
  offersEnabled: boolean;
  image: string;
}

const MarketplaceCard = ({
  id,
  listingNumber,
  title,
  series,
  year,
  grade,
  certification,
  price,
  offersEnabled,
  image,
}: MarketplaceCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/card/${id}`)}
      className="group cursor-pointer"
    >
      {/* Card Image */}
      <div className="aspect-[3/4] bg-muted border border-border overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Info */}
      <div className="pt-3 space-y-1.5">
        {/* Card Name */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {title}
        </h3>
        
        {/* Metadata Line: Series • Year • Certification Grade */}
        <p className="text-xs text-muted-foreground">
          {series} • {year} • <span className="font-mono">{certification} {grade}</span>
        </p>
        
        {/* Price + Offer Indicator */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-display font-medium text-foreground">
            {price}
          </span>
          {offersEnabled && (
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          )}
        </div>

        {/* Optional: Listing number (muted) */}
        <span className="text-[10px] text-muted-foreground/60 font-mono">
          Listing #{listingNumber}
        </span>
      </div>
    </div>
  );
};

export default MarketplaceCard;
