import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  href?: string;
}

const StatCard = ({ icon: Icon, label, value, description, href }: StatCardProps) => {
  const content = (
    <Card className="border border-border bg-card p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
            {label}
          </p>
          <p className="text-2xl font-mono font-medium text-foreground">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="p-2 bg-muted/50 rounded-md">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;
