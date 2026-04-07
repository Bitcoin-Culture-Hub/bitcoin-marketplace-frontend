import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  addToCart as addToCartApi,
  checkout as checkoutApi,
  removeFromCartApi,
  ApiError,
} from "@/services/store.api"

export type CartLine = {
  cardId: string
  displayName: string
  gradeLabel: string
  priceBTC: number | null
  priceUSD: number | null
}

type CartContextValue = {
  lines: CartLine[]
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  isBusy: boolean
  lastError: string | null
  clearError: () => void
  addLine: (line: CartLine) => Promise<void>
  removeLine: (cardId: string) => Promise<void>
  checkout: () => Promise<void>
  syncFromServerCart: (cardIds: string[], preserveMeta: CartLine[]) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function mergeLinesFromServerIds(
  ids: string[],
  previous: CartLine[],
  fallback?: CartLine
): CartLine[] {
  const byId = new Map(previous.map((l) => [l.cardId, l]))
  if (fallback) byId.set(fallback.cardId, fallback)
  return ids.map((id) => {
    const existing = byId.get(id)
    if (existing) return existing
    return {
      cardId: id,
      displayName: "Listing",
      gradeLabel: "—",
      priceBTC: null,
      priceUSD: null,
    }
  })
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  const clearError = useCallback(() => setLastError(null), [])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const addLine = useCallback(async (line: CartLine) => {
    setIsBusy(true)
    setLastError(null)
    try {
      const { cart } = await addToCartApi(line.cardId)
      setLines((prev) => mergeLinesFromServerIds(cart, prev, line))
      setDrawerOpen(true)
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not add to cart"
      setLastError(msg)
      throw e
    } finally {
      setIsBusy(false)
    }
  }, [])

  const removeLine = useCallback(async (cardId: string) => {
    setIsBusy(true)
    setLastError(null)
    try {
      const { cart } = await removeFromCartApi(cardId)
      setLines((prev) =>
        mergeLinesFromServerIds(
          cart,
          prev.filter((l) => l.cardId !== cardId)
        )
      )
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not remove item"
      setLastError(msg)
      throw e
    } finally {
      setIsBusy(false)
    }
  }, [])

  const checkout = useCallback(async () => {
    setIsBusy(true)
    setLastError(null)
    try {
      const res = await checkoutApi()
      try {
        sessionStorage.setItem("last_marketplace_order_id", res.order_id)
      } catch {
        /* ignore */
      }
      setLines([])
      if (res.invoice_url) {
        window.location.href = res.invoice_url
        return
      }
      setLastError("No invoice URL returned — check BTCPay configuration.")
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Checkout failed"
      setLastError(msg)
      throw e
    } finally {
      setIsBusy(false)
    }
  }, [])

  const syncFromServerCart = useCallback(
    (cardIds: string[], preserveMeta: CartLine[]) => {
      setLines(mergeLinesFromServerIds(cardIds, preserveMeta))
    },
    []
  )

  const value = useMemo(
    () => ({
      lines,
      drawerOpen,
      openDrawer,
      closeDrawer,
      isBusy,
      lastError,
      clearError,
      addLine,
      removeLine,
      checkout,
      syncFromServerCart,
    }),
    [
      lines,
      drawerOpen,
      openDrawer,
      closeDrawer,
      isBusy,
      lastError,
      clearError,
      addLine,
      removeLine,
      checkout,
      syncFromServerCart,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
