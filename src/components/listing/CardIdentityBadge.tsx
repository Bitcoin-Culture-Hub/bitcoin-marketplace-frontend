import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface CardIdentityBadgeProps {
  item: {
    id: string;
    templateName: string;
    series: string;
    year: string;
    cardNumber: string;
    gradingCompany: string;
    grade: string;
    certNumber: string;
    photo?: string | null;
  };
}

const CardIdentityBadge = ({ item }: CardIdentityBadgeProps) => {
  const maskCert = (cert: string) => {
    if (cert.length <= 4) return cert;
    return `${cert.slice(0, 4)}••••`;
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-border bg-card/30">
      {/* Thumbnail */}
      <div className="w-16 h-20 bg-muted border border-border shrink-0 overflow-hidden">
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.templateName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="font-medium text-foreground truncate">{item.templateName}</h3>
        <p className="text-xs text-muted-foreground">
          {item.series} · {item.year} · {item.cardNumber}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Badge variant="secondary" className="text-xs">
            {item.gradingCompany}
          </Badge>
          <Badge variant="outline" className="text-sm font-mono font-bold">
            {item.grade}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {maskCert(item.certNumber)}
          </span>
        </div>
      </div>

      {/* Link */}
      <Link
        to={`/collection/item/${item.id}`}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0"
      >
        <ExternalLink className="h-3 w-3" />
        View
      </Link>
    </div>
  );
};

export default CardIdentityBadge;
