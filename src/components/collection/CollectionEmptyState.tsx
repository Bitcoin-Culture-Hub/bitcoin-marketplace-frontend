import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionEmptyStateProps {
  state: "in_collection" | "wish_list" | "listed" | "in_escrow" | "sold";
  hasFilters: boolean;
  onClearFilters?: () => void;
}

const CollectionEmptyState = ({
  state,
  hasFilters,
  onClearFilters,
}: CollectionEmptyStateProps) => {
  const getContent = () => {
    if (hasFilters) {
      return {
        title: "No cards match your filters",
        description: "Try adjusting your search or filters.",
        showClearFilters: true,
      };
    }

    switch (state) {
      case "in_collection":
        return {
          title: "Your collection is empty",
          description: "Add your first graded Bitcoin card to get started.",
          cta: { label: "Add your first card", href: "/submit" },
          secondary: { label: "Browse marketplace", href: "/marketplace" },
        };
      case "listed":
        return {
          title: "No cards listed",
          description: "List cards from your collection to make them available for purchase.",
          cta: { label: "View collection", href: "/inventory" },
        };
      case "in_escrow":
        return {
          title: "No cards in escrow",
          description: "Escrow items appear here while a transaction is in progress.",
        };
      case "sold":
        return {
          title: "No sold cards yet",
          description: "Completed sales will appear here as a record of your transactions.",
        };
      default:
        return {
          title: "No cards found",
          description: "",
        };
    }
  };

  const content = getContent();

  return (
    <div className="px-6 py-12 text-center">
      <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-sm font-medium text-foreground mb-1">{content.title}</p>
      <p className="text-xs text-muted-foreground mb-4">{content.description}</p>

      <div className="flex items-center justify-center gap-3">
        {content.showClearFilters && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
        {content.cta && (
          <Button size="sm" asChild>
            <Link to={content.cta.href}>{content.cta.label}</Link>
          </Button>
        )}
        {content.secondary && (
          <Button variant="outline" size="sm" asChild>
            <Link to={content.secondary.href}>{content.secondary.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CollectionEmptyState;
