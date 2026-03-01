import { CheckCircle, Eye, Clock } from "lucide-react";

export type CardRelationship = "owned" | "watchlisted" | "preparing";

interface RelationshipSelectorProps {
  value: CardRelationship;
  onChange: (value: CardRelationship) => void;
}

const relationships = [
  {
    id: "owned" as const,
    label: "Owned",
    description: "I own this card",
    icon: CheckCircle,
  },
  {
    id: "watchlisted" as const,
    label: "Watchlisted",
    description: "I'm tracking this card",
    icon: Eye,
  },
  {
    id: "preparing" as const,
    label: "Preparing to List",
    description: "I intend to list this card later",
    icon: Clock,
  },
];

const RelationshipSelector = ({ value, onChange }: RelationshipSelectorProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xs text-muted-foreground uppercase tracking-wider">
        Your relationship to this card
      </h2>
      
      <div className="space-y-2">
        {relationships.map((rel) => {
          const Icon = rel.icon;
          const isSelected = value === rel.id;
          
          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => onChange(rel.id)}
              className={`w-full flex items-center gap-4 p-4 border transition-colors text-left ${
                isSelected 
                  ? "border-primary/50 bg-primary/5" 
                  : "border-border hover:bg-muted/30"
              }`}
            >
              <div className={`flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {rel.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rel.description}
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                isSelected 
                  ? "border-primary bg-primary" 
                  : "border-muted-foreground"
              }`}>
                {isSelected && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-background" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RelationshipSelector;
