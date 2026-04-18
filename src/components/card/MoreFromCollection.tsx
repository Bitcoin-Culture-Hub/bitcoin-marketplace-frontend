import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TemplateTile from "@/components/marketplace/TemplateTile";
import TemplateTileSkeleton from "@/components/marketplace/TemplateTileSkeleton";
import { useTemplates } from "@/hooks/medusa/useTemplates";

interface MoreFromCollectionProps {
  /** Medusa collection id. Preferred grouping when present. */
  collectionId?: string | null;
  /**
   * Series string (e.g. "Commemorative"). Used as a fallback grouping when
   * the product isn't linked to a Medusa collection — many cards store the
   * series in variant metadata instead of a real collection.
   */
  series?: string | null;
  /** Current template id — removed from the results so the card doesn't show itself. */
  currentTemplateId: string;
  /** Section title. Defaults to "More From This Collection". */
  title?: string;
  /** Max number of tiles shown. Defaults to 10. */
  limit?: number;
}

const MoreFromCollection = ({
  collectionId,
  series,
  currentTemplateId,
  title = "More From This Collection",
  limit = 10,
}: MoreFromCollectionProps) => {
  const navigate = useNavigate();

  // When we have a real Medusa collection id, filter server-side.
  // Otherwise fetch a broad page and match by series string client-side.
  const useCollectionQuery = !!collectionId;

  const { data: templates = [], isLoading, isError } = useTemplates(
    useCollectionQuery
      ? { collectionId: collectionId!, limit: Math.max(limit + 2, 12) }
      : { limit: 100 }
  );

  const filtered = useMemo(() => {
    let list = templates.filter((t) => t.id !== currentTemplateId);

    // If we're falling back to the series string, do the match here.
    if (!useCollectionQuery && series && series !== "—") {
      list = list.filter((t) => t.series === series);
    }

    return list.slice(0, limit);
  }, [templates, currentTemplateId, limit, useCollectionQuery, series]);

  if (isError) return null;
  if (!isLoading && filtered.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/marketplace")}
          className="text-sm font-semibold text-btc-orange hover:underline"
        >
          Explore More
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <TemplateTileSkeleton key={i} />)
          : filtered.map((template) => (
              <TemplateTile key={template.id} {...template} />
            ))}
      </div>
    </section>
  );
};

export default MoreFromCollection;
