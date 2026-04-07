import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-xl font-display font-medium text-foreground">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
    {action && (
      action.href ? (
        <Button asChild size="sm" className="rounded-none font-display uppercase tracking-wider text-xs">
          <Link to={action.href}>
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Link>
        </Button>
      ) : (
        <Button size="sm" onClick={action.onClick} className="rounded-none font-display uppercase tracking-wider text-xs">
          {action.icon && <action.icon className="h-4 w-4 mr-2" />}
          {action.label}
        </Button>
      )
    )}
  </div>
);

export default PageHeader;
