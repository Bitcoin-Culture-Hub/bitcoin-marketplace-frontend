import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionHeaderProps {
  totalCopies: number;
  listedCount: number;
  inEscrowCount: number;
  soldCount: number;
  hasStorefront: boolean;
}

const CollectionHeader = ({
  totalCopies,
  listedCount,
  inEscrowCount,
  soldCount,
  hasStorefront,
}: CollectionHeaderProps) => {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-medium text-foreground">
            My Collection
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your graded Bitcoin cards. Manage listings and storefront visibility.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Private by default. Only listed cards are visible to other collectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-1.5" asChild>
            <Link to="/submit">
              <Plus className="h-4 w-4" />
              Add Card
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 border-t border-border" />
    </header>
  );
};

export default CollectionHeader;
