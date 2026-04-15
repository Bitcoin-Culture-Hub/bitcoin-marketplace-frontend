import { medusa } from "@/lib/medusa"

type ProductListParams = Record<string, unknown>

export async function listAllStoreProducts(
  params: ProductListParams = {},
  batchSize = 100
) {
  const allProducts: any[] = []
  const seenProductIds = new Set<string>()
  let offset = 0

  while (true) {
    const { products, count } = await medusa.store.product.list({
      ...params,
      limit: batchSize,
      offset,
    })

    const items = (products as any[]) ?? []

    if (items.length === 0) {
      break
    }

    const newItems = items.filter((item) => {
      const productId = typeof item?.id === "string" ? item.id : null
      if (!productId) {
        return true
      }
      if (seenProductIds.has(productId)) {
        return false
      }
      seenProductIds.add(productId)
      return true
    })

    if (newItems.length === 0) {
      break
    }

    allProducts.push(...newItems)
    offset += items.length

    if (typeof count === "number" && allProducts.length >= count) {
      break
    }

    if (items.length < batchSize) {
      break
    }
  }

  return allProducts
}
