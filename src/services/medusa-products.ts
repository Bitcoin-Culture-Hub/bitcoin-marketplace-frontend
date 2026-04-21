import { medusa } from "@/lib/medusa"

type ProductListParams = Record<string, unknown>

export async function listAllStoreProducts(
    params: ProductListParams = {},
    batchSize = 100
) {
    const allProducts: any[] = []
    let offset = 0
    let total = Number.POSITIVE_INFINITY

    while (allProducts.length < total) {
        const { products, count } = await medusa.store.product.list({
            ...params,
            limit: batchSize,
            offset,
        })

        const items = (products as any[]) ?? []
        total = typeof count === "number" ? count : items.length

        if (items.length === 0) {
            break
        }

        allProducts.push(...items)
        offset += items.length

        if (items.length < batchSize) {
            break
        }
    }

    return allProducts
}