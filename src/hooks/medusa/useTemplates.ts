import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import { getCardImages } from "@/services/cardImageLookup"
import { listAllStoreProducts } from "@/services/medusa-products"

// ─── Types matching your TemplateTileProps exactly ────────────────────────────

export type CardTemplate = {
  id: string
  name: string
  series: string
  cardNumber: string
  image: string
  backImage?: string | null
  frontImageFull?: string
  backImageFull?: string | null
  availableCount: number
  floorPriceBTC: number | null
  offersAcceptedCount: number
  isNewSupply: boolean
  isLowPop: boolean
  newestSupplyAt: Date | null
  /** Grade of the floor (lowest-priced available) copy, e.g. "9.5" */
  floorGrade: string | null
  /** Grading company of the floor copy, e.g. "PSA" */
  floorGradingCompany: string | null
}

// ─── Medusa product → your CardTemplate shape ─────────────────────────────────

function toCardTemplate(product: any): CardTemplate {
  const variants: any[] = product.variants ?? []

  // Floor price: lowest variant price that has inventory and is not sold
  const availableVariants = variants.filter((v) => {
    const vm = v.metadata ?? {}
    const sold =
      vm.is_sold === true || vm.sold === true || vm.state === "sold"
    return (v.inventory_quantity ?? 0) > 0 && !sold
  })
  const pricedVariants = availableVariants
    .map((v) => ({
      variant: v,
      price: v.metadata?.price_btc as number | undefined,
    }))
    .filter((x): x is { variant: any; price: number } => typeof x.price === "number")

  const floorPriceBTC =
    pricedVariants.length > 0
      ? Math.min(...pricedVariants.map((x) => x.price))
      : null

  const floorVariant =
    floorPriceBTC !== null
      ? pricedVariants.find((x) => x.price === floorPriceBTC)?.variant
      : availableVariants[0]

  const floorGrade =
    (floorVariant?.metadata?.grade as string | undefined) ?? null
  const floorGradingCompany =
    (floorVariant?.metadata?.grading_company as string | undefined) ?? null

  const availableCount = availableVariants.length

  // isNewSupply: any variant created in the last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const newestVariantDate = variants.reduce<Date | null>((latest, v) => {
    const d = v.created_at ? new Date(v.created_at) : null
    if (!d) return latest
    return !latest || d > latest ? d : latest
  }, null)
  const isNewSupply = newestVariantDate
    ? newestVariantDate.getTime() > sevenDaysAgo
    : false

  // isLowPop: fewer than 3 available copies
  const isLowPop = availableCount > 0 && availableCount < 3

  // offersAcceptedCount: variants with accepts_offers metadata flag
  const offersAcceptedCount = variants.filter(
    (v) => v.metadata?.accepts_offers === true
  ).length

  const meta = product.metadata ?? {}
  const series = (meta.series_name as string) ?? (meta.series as string) ?? (product.collection?.title as string) ?? "—"
  const cardNumber = (meta.card_number as string) ?? product.handle ?? "—"

  let image = product.thumbnail ?? ""
  let backImage: string | null = null
  let frontImageFull: string | undefined
  let backImageFull: string | null = null

  // Try output.json lookup first, then fall back to product metadata
  const match = getCardImages(product.title, cardNumber, series)
  if (match) {
    image = match.frontImageThumb
    frontImageFull = match.frontImageFull
    backImage = match.backImageThumb
    backImageFull = match.backImageFull
  } else if (meta.front_image_thumb) {
    image = meta.front_image_thumb as string
    frontImageFull = (meta.front_image_full as string) || undefined
    backImage = (meta.back_image_thumb as string) || null
    backImageFull = (meta.back_image_full as string) || null
  }

  return {
    id: product.id,
    name: product.title,
    series,
    cardNumber,
    image,
    backImage,
    frontImageFull,
    backImageFull,
    availableCount,
    floorPriceBTC,
    offersAcceptedCount,
    isNewSupply,
    isLowPop,
    newestSupplyAt: newestVariantDate,
    floorGrade,
    floorGradingCompany,
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

type UseTemplatesOptions = {
  limit?: number
  collectionId?: string   // maps to your "series" filter
  availableOnly?: boolean
  fetchAll?: boolean
}

export function useTemplates(options: UseTemplatesOptions = {}) {
  const { limit = 50, collectionId, availableOnly, fetchAll = false } = options

  return useQuery({
    queryKey: ["templates", limit, collectionId, availableOnly, fetchAll],
    queryFn: async () => {
      const params: Record<string, unknown> = {
        fields:
          "id,title,handle,thumbnail,collection.*,metadata,variants.*,variants.prices.*",
      }
      if (collectionId) params["collection_id[]"] = collectionId

      const products = fetchAll
        ? await listAllStoreProducts(params)
        : ((await medusa.store.product.list({ ...params, limit })).products as any[])

      let templates = (products as any[]).map(toCardTemplate)

      if (availableOnly) {
        templates = templates.filter((t) => t.availableCount > 0)
      }

      return  templates
    },
    staleTime: 60_000, // 1 minute
  })
}

export function useTemplate(productId: string) {
  return useQuery({
    queryKey: ["template", productId],
    queryFn: async () => {
      const { product } = await medusa.store.product.retrieve(productId, {
        fields:
          "id,title,handle,thumbnail,description,collection.*,metadata,variants.*,variants.prices.*",
      })
      return toCardTemplate(product as any)
    },
    enabled: !!productId,
  })
}

// currently using this for the sidebar, might need to make this into a different file for easier usecases
export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { collections } = await medusa.store.collection.list()
      return (collections as any[]).map((c) => ({
        id: c.id as string,
        title: c.title as string,
      }))
    },
    staleTime: 5 * 60_000,
  })
}