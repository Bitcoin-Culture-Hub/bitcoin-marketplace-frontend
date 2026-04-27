import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import { getCardImages } from "@/services/cardImageLookup"
import { listAllStoreProducts } from "@/services/medusa-products"
import {
  getMarketplaceDisplayLabel,
  isMarketplaceListedPublicUnsold,
  normalizeMarketplaceGrade,
  normalizeMarketplaceGradingCompany,
  normalizeMarketplaceSeries,
  parseMarketplaceYear,
  type MarketplaceAvailabilityMetadata,
  type MarketplaceTemplateFacetSource,
} from "@/lib/marketplace-filters"

// ─── Types matching your TemplateTileProps exactly ────────────────────────────

type TemplateVariantMetadata = MarketplaceAvailabilityMetadata & {
  accepts_offers?: boolean
  grade?: string
  grading_company?: string
  price_btc?: number | string
  year?: string | number
}

type TemplateVariant = {
  created_at?: string | null
  inventory_quantity?: number | null
  metadata?: TemplateVariantMetadata | null
  title?: string | null
}

type TemplateProductMetadata = {
  back_image_full?: string
  back_image_thumb?: string
  card_number?: string
  front_image_full?: string
  front_image_thumb?: string
  series?: string
  series_name?: string
  year?: string | number
}

type TemplateProduct = {
  collection?: {
    title?: string | null
  } | null
  id: string
  handle?: string | null
  metadata?: TemplateProductMetadata | null
  thumbnail?: string | null
  title: string
  variants?: TemplateVariant[] | null
}

type TemplateCollection = {
  id: string
  title: string
}

export type CardTemplate = MarketplaceTemplateFacetSource & {
  id: string
  name: string
  cardNumber: string
  image: string
  backImage?: string | null
  frontImageFull?: string
  backImageFull?: string | null
  year: number | null
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

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function isMarketplaceAvailableVariant(variant: TemplateVariant): boolean {
  return isMarketplaceListedPublicUnsold(variant.metadata)
}

function getVariantGrade(variant: TemplateVariant): string | null {
  return normalizeMarketplaceGrade(variant.metadata?.grade ?? variant.title)
}

function getVariantGradingCompany(variant: TemplateVariant): string | null {
  return normalizeMarketplaceGradingCompany(variant.metadata?.grading_company)
}

function resolveTemplateYear(
  metadata: TemplateProductMetadata,
  variants: TemplateVariant[]
): number | null {
  const variantYear =
    variants.find((variant) => parseMarketplaceYear(variant.metadata?.year) !== null)
      ?.metadata?.year ?? null

  return parseMarketplaceYear(metadata.year ?? variantYear)
}

function toCardTemplate(product: TemplateProduct): CardTemplate {
  const variants = product.variants ?? []

  // Floor price: lowest listed/public unsold variant price
  const availableVariants = variants.filter(isMarketplaceAvailableVariant)
  const pricedVariants = availableVariants
    .map((v) => ({
      variant: v,
      price: toNumber(v.metadata?.price_btc),
    }))
    .filter(
      (x): x is { variant: TemplateVariant; price: number } => x.price !== null
    )

  const floorPriceBTC =
    pricedVariants.length > 0
      ? Math.min(...pricedVariants.map((x) => x.price))
      : null

  const floorVariant =
    floorPriceBTC !== null
      ? pricedVariants.find((x) => x.price === floorPriceBTC)?.variant
      : availableVariants[0]

  const floorGrade = floorVariant ? getVariantGrade(floorVariant) : null
  const floorGradingCompany = floorVariant
    ? getVariantGradingCompany(floorVariant)
    : null

  const availableCount = availableVariants.length
  const availableGrades = [...new Set(availableVariants.map(getVariantGrade).filter(
    (grade): grade is string => grade !== null
  ))]
  const availableGradingCompanies = [
    ...new Set(
      availableVariants
        .map(getVariantGradingCompany)
        .filter((company): company is string => company !== null)
    ),
  ]

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
  const series = getMarketplaceDisplayLabel(
    meta.series_name ?? meta.series ?? product.collection?.title
  )
  const seriesKey = normalizeMarketplaceSeries(series)
  const year = resolveTemplateYear(meta, variants)
  const cardNumber = getMarketplaceDisplayLabel(meta.card_number ?? product.handle)

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
    seriesKey,
    cardNumber,
    image,
    backImage,
    frontImageFull,
    backImageFull,
    year,
    availableCount,
    floorPriceBTC,
    offersAcceptedCount,
    isNewSupply,
    isLowPop,
    newestSupplyAt: newestVariantDate,
    floorGrade,
    floorGradingCompany,
    availableGrades,
    availableGradingCompanies,
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
        : (await medusa.store.product.list({ ...params, limit })).products

      let templates = (products as TemplateProduct[]).map(toCardTemplate)

      if (availableOnly) {
        templates = templates.filter((t) => t.availableCount > 0)
      }

      return templates
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
      return toCardTemplate(product as TemplateProduct)
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
      return (collections as TemplateCollection[]).map((c) => ({
        id: c.id as string,
        title: c.title as string,
      }))
    },
    staleTime: 5 * 60_000,
  })
}
