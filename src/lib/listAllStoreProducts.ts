import { medusa } from "@/lib/medusa"

type StoreProductListParams = Record<string, unknown> & {
  limit?: number
  offset?: number
}

const MAX_PAGES = 1000

function getPageSignature(items: any[]) {
  return items.map((item) => String(item?.id ?? "")).join("|")
}

// Medusa store product.list is paginated; this helper walks every page.
export async function listAllStoreProducts(
  params: StoreProductListParams = {}
) {
  const pageSize =
    typeof params.limit === "number" && params.limit > 0 ? params.limit : 100

  const baseParams = { ...params }
  delete baseParams.offset

  const allProducts: any[] = []
  let offset = 0
  let totalCount: number | null = null
  let pagesFetched = 0
  let previousFullPageSignature: string | null = null

  while (totalCount === null || allProducts.length < totalCount) {
    if (pagesFetched >= MAX_PAGES) {
      break
    }

    const requestedOffset = offset
    const { products, count } = await medusa.store.product.list({
      ...baseParams,
      limit: pageSize,
      offset,
    })

    const items = products as any[]
    const isFullPage = items.length === pageSize
    const pageSignature = items.length > 0 ? getPageSignature(items) : null
    const looksLikeRepeatedPage =
      isFullPage &&
      pageSignature !== null &&
      previousFullPageSignature !== null &&
      pageSignature === previousFullPageSignature &&
      (totalCount === null || requestedOffset + items.length < totalCount)

    if (looksLikeRepeatedPage) {
      break
    }

    allProducts.push(...items)
    pagesFetched += 1

    if (typeof count === "number") {
      totalCount = count
    }

    if (items.length < pageSize) {
      break
    }

    if (totalCount !== null && requestedOffset + items.length >= totalCount) {
      break
    }

    previousFullPageSignature = isFullPage ? pageSignature : null
    offset += pageSize
  }

  return allProducts
}
