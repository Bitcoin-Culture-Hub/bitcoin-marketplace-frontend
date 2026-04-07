import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"

/**
 * Fetches all products from the store API and groups them
 * by series_name → sorted card names.
 *
 * Returns the same shape as the old hardcoded cardSets:
 *   Record<string, string[]>
 */
export function useCardCatalog() {
  return useQuery({
    queryKey: ["card-catalog"],
    queryFn: async () => {
      const catalog: Record<string, Set<string>> = {}

      let offset = 0
      const limit = 100

      while (true) {
        const { products } = await medusa.store.product.list({
          limit,
          offset,
          fields: "id,title,metadata",
        })

        const items = products as any[]
        for (const p of items) {
          const series = (p.metadata?.series_name as string) || ""
          if (!series) continue
          if (!catalog[series]) catalog[series] = new Set()
          catalog[series].add(p.title as string)
        }

        if (items.length < limit) break
        offset += limit
      }

      // Convert Sets to sorted arrays, sort series alphabetically
      const result: Record<string, string[]> = {}
      for (const series of Object.keys(catalog).sort()) {
        result[series] = [...catalog[series]].sort()
      }
      return result
    },
    staleTime: 5 * 60_000,
  })
}
