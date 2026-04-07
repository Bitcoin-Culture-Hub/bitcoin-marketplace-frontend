import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import { getCardImages } from "@/services/cardImageLookup"

// ─── Types matching your existing Listing interface in CopiesTable ────────────

export type Listing = {
  id: string
  sellerId: string
  sellerName: string
  sellerReputation?: number
  sellerVerified?: boolean
  grade: string
  gradingCompany: string
  certNumber: string
  priceBTC: number | null
  priceUSD: number | null
  acceptsOffers: boolean
  minOfferBTC?: number
  shipsFromRegion: string
  createdAt: Date
  slabPhotos?: string[]
  /** Listing no longer available (sold / metadata) */
  isSold: boolean
}

export type TemplateDetail = {
  id: string
  name: string
  series: string
  year: string
  cardNumber: string
  printRun?: number
  designNotes: string
  images: string[]
  backImage?: string | null
}

// ─── Medusa variant → your Listing shape ──────────────────────────────────────

function toListingAndTemplate(product: any): {
  template: TemplateDetail
  listings: Listing[]
} {
  const meta = product.metadata ?? {}
  const images: string[] = (product.images ?? []).map((i: any) => i.url as string)
  if (product.thumbnail && !images.includes(product.thumbnail)) {
    images.unshift(product.thumbnail)
  }

  const series = product.collection?.title ?? meta.series_name ?? meta.series ?? "—"
  const cardNumber = meta.card_number ?? product.handle ?? "—"

  // Enrich with output.json images, then fall back to product metadata
  let backImage: string | null = null
  const match = getCardImages(product.title, cardNumber, series)
  if (match) {
    images.unshift(match.frontImageFull)
    if (match.backImageFull) {
      images.push(match.backImageFull)
      backImage = match.backImageFull
    }
  } else if (meta.front_image_full) {
    if (!images.includes(meta.front_image_full as string)) {
      images.unshift(meta.front_image_full as string)
    }
    if (meta.back_image_full) {
      const backUrl = meta.back_image_full as string
      if (!images.includes(backUrl)) {
        images.push(backUrl)
      }
      backImage = backUrl
    }
  }

  const template: TemplateDetail = {
    id: product.id,
    name: product.title,
    series,
    year: meta.year ?? "—",
    cardNumber,
    printRun: meta.print_run ? Number(meta.print_run) : undefined,
    designNotes: product.description ?? "",
    images,
    backImage,
  }

  const listings: Listing[] = (product.variants ?? []).map((v: any): Listing => {
    const vm = v.metadata ?? {}
    // BTC price stored in variant metadata; USD price from the money_amount
    const priceBTC = vm.price_btc != null ? Number(vm.price_btc) : null
    const priceUSD =
      v.prices?.find((p: any) => p.currency_code === "usd")?.amount ?? null

    const isSold =
      vm.is_sold === true ||
      vm.sold === true ||
      vm.state === "sold"

    return {
      id: v.id,
      sellerId: vm.seller_id ?? "unknown",
      sellerName: vm.seller_name ?? "Anonymous",
      sellerReputation: vm.seller_reputation != null ? Number(vm.seller_reputation) : undefined,
      sellerVerified: vm.seller_verified === true,
      grade: vm.grade ?? v.title ?? "—",
      gradingCompany: vm.grading_company ?? "—",
      certNumber: vm.cert_number ?? "—",
      priceBTC,
      priceUSD: priceUSD != null ? priceUSD / 100 : null,
      acceptsOffers: vm.accepts_offers === true,
      minOfferBTC: vm.min_offer_btc != null ? Number(vm.min_offer_btc) : undefined,
      shipsFromRegion: vm.ships_from_region ?? "—",
      createdAt: v.created_at ? new Date(v.created_at) : new Date(),
      slabPhotos: vm.slab_photos ? (vm.slab_photos as string[]) : undefined,
      isSold,
    }
  })

  return { template, listings }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useListings(productId: string) {
  return useQuery({
    queryKey: ["listings", productId],
    queryFn: async () => {
      const { product } = await medusa.store.product.retrieve(productId, {
        fields:
          "id,title,handle,thumbnail,description,images.*,collection.*,metadata," +
          "variants.*,variants.prices.*",
      })
      return toListingAndTemplate(product as any)
    },
    enabled: !!productId,
    staleTime: 30_000,
  })
}
