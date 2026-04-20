import type {
  CartAddResponse,
  CartRemoveResponse,
  CheckoutResponse,
  ListSellerOffersResponse,
  ListMyOffersResponse,
  OfferSellerAction,
  OrderStatusResponse,
  RespondToOfferAcceptResponse,
  RespondToOfferRejectResponse,
  SubmitOfferResponse,
} from "@/types/shared"

const apiBase = () =>
  import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000"

const publishableKey = () => import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || ""

/** Optional JWT storage key (see .env.example). Session cookies are always sent. */
const jwtStorageKey = () =>
  import.meta.env.VITE_AUTH_JWT_STORAGE_KEY || "btc_marketplace_customer_jwt"

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {}
  try {
    const jwt = localStorage.getItem(jwtStorageKey())
    if (jwt) h.Authorization = `Bearer ${jwt}`
  } catch {
    /* private mode */
  }
  return h
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

async function storeFetch<T>(
  path: string,
  init: RequestInit & { method?: string } = {}
): Promise<T> {
  const url = `${apiBase()}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": publishableKey(),
    ...authHeaders(),
    ...(init.headers as Record<string, string> | undefined),
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  })

  const body = await parseJson(res)

  if (!res.ok) {
    const msg =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : res.statusText || "Request failed"
    throw new ApiError(msg, res.status, body)
  }

  return body as T
}

export type VerifyCustomerEmailResponse = {
  verified: boolean
  verified_at?: string
  already_verified?: boolean
}

export type ResendCustomerEmailVerificationResponse = {
  sent: boolean
  email: string
  expires_at: string
}

export async function verifyCustomerEmailCode(
  code: string
): Promise<VerifyCustomerEmailResponse> {
  return storeFetch<VerifyCustomerEmailResponse>(
    "/store/customers/me/email-verification",
    {
      method: "POST",
      body: JSON.stringify({ code }),
    }
  )
}

export async function resendCustomerEmailVerification(): Promise<ResendCustomerEmailVerificationResponse> {
  return storeFetch<ResendCustomerEmailVerificationResponse>(
    "/store/customers/me/email-verification/resend",
    {
      method: "POST",
    }
  )
}

export async function addToCart(card_id: string): Promise<CartAddResponse> {
  return storeFetch<CartAddResponse>("/store/cart/add", {
    method: "POST",
    body: JSON.stringify({ card_id }),
  })
}

export async function removeFromCartApi(card_id: string): Promise<CartRemoveResponse> {
  return storeFetch<CartRemoveResponse>("/store/cart/remove", {
    method: "POST",
    body: JSON.stringify({ card_id }),
  })
}

export async function checkout(): Promise<CheckoutResponse> {
  return storeFetch<CheckoutResponse>("/store/cart/checkout", {
    method: "POST",
  })
}

export async function submitOffer(input: {
  card_id: string
  amount: number
  message?: string | null
}): Promise<SubmitOfferResponse> {
  return storeFetch<SubmitOfferResponse>("/store/offers", {
    method: "POST",
    body: JSON.stringify({
      card_id: input.card_id,
      amount: input.amount,
      message: input.message ?? null,
    }),
  })
}

export async function respondToOffer(
  offer_id: string,
  action: OfferSellerAction
): Promise<RespondToOfferAcceptResponse | RespondToOfferRejectResponse> {
  return storeFetch<
    RespondToOfferAcceptResponse | RespondToOfferRejectResponse
  >(`/store/offers/${encodeURIComponent(offer_id)}`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  })
}

export async function pollOrderStatus(order_id: string): Promise<OrderStatusResponse> {
  return storeFetch<OrderStatusResponse>(
    `/store/orders/${encodeURIComponent(order_id)}/status`,
    { method: "GET" }
  )
}

export async function listSellerPendingOffers(): Promise<ListSellerOffersResponse> {
  return storeFetch<ListSellerOffersResponse>("/store/offers/incoming", {
    method: "GET",
  })
}

export async function listMyOffers(): Promise<ListMyOffersResponse> {
  return storeFetch<ListMyOffersResponse>("/store/offers/my-offers", {
    method: "GET",
  })
}

/* ── Vendor ─────────────────────────────────────────────── */

export type VendorRecord = {
  id: string
  name: string
  slug: string
  email: string
  phone: string | null
  seller_id: string
  user_id: string
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type VendorResponse = { vendor: VendorRecord }
export type VendorSummary = {
  active_listings: number
  sold_cards: number
  total_orders: number
  total_offers: number
}

export async function createVendor(input: {
  name: string
  slug: string
  email: string
  phone?: string | null
}): Promise<VendorResponse> {
  return storeFetch<VendorResponse>("/store/vendor", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function getMyVendor(): Promise<VendorResponse> {
  return storeFetch<VendorResponse>("/store/vendor/me", { method: "GET" })
}

export async function getVendorBySlug(slug: string): Promise<VendorResponse> {
  return storeFetch<VendorResponse>(
    `/store/vendor/slug/${encodeURIComponent(slug)}`,
    { method: "GET" }
  )
}

export async function updateVendor(
  id: string,
  input: { name?: string; slug?: string; email?: string; phone?: string | null }
): Promise<VendorResponse> {
  return storeFetch<VendorResponse>(
    `/store/vendor/${encodeURIComponent(id)}`,
    { method: "POST", body: JSON.stringify(input) }
  )
}

export async function getVendorSummary(): Promise<{ summary: VendorSummary }> {
  return storeFetch<{ summary: VendorSummary }>("/store/vendor/me/summary", {
    method: "GET",
  })
}

/* ── Seller Orders ────────────────────────────────────────── */

export type SellerOrderRow = {
  id: string
  buyer_id: string
  card_id: string
  amount: number
  currency: string
  status: string
  btcpay_invoice_id: string | null
  created_at: string
}

export type ListSellerOrdersResponse = {
  orders: SellerOrderRow[]
}

export async function listSellerOrders(): Promise<ListSellerOrdersResponse> {
  return storeFetch<ListSellerOrdersResponse>("/store/vendor/me/orders", {
    method: "GET",
  })
}

/* ── Vendor Directory ─────────────────────────────────────── */

export type ListVendorsResponse = {
  vendors: VendorRecord[]
}

export async function listAllVendors(): Promise<ListVendorsResponse> {
  return storeFetch<ListVendorsResponse>("/store/vendor/list", {
    method: "GET",
  })
}
