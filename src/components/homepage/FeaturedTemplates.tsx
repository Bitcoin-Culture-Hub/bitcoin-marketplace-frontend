import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useTemplates } from "@/hooks/medusa/useTemplates";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedTemplates = () => {
  // Fetch up to 6 available templates, sorted by lowest floor price
  const { data: templates = [], isLoading } = useTemplates({
    limit: 6,
    availableOnly: true,
  });

  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-display text-xl font-medium text-foreground mb-8">
          Featured Cards
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border bg-card p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2 mt-3" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}

          {!isLoading &&
            templates.map((template) => (
              <Link
                key={template.id}
                to={`/marketplace/templates/${template.id}`}
                className="group border border-border bg-card hover:bg-muted/50 transition-colors p-4"
              >
                {template.image && (
                  <div className="aspect-[3/4] bg-muted overflow-hidden mb-3">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1">
                  {template.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mb-3">
                  {template.series}
                </p>

                <div className="text-xs text-muted-foreground mb-1">
                  {template.availableCount} available
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-foreground">
                    {template.floorPriceBTC !== null
                      ? `From ${template.floorPriceBTC} BTC`
                      : "—"}
                  </span>
                  {template.offersAcceptedCount > 0 && (
                    <MessageSquare className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                  )}
                </div>
              </Link>
            ))}

          {!isLoading && templates.length === 0 && (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
              No featured cards available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTemplates;
