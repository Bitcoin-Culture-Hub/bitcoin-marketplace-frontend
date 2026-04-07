/**
 * Request/response shapes for custom `/store/*` marketplace routes
 * (aligned with bitcoin-card-backend handlers).
 */

export type MarketplaceOrderStatus = "pending" | "paid" | "failed" | "expired"

export type CartAddResponse = {
  cart: string[]
}

export type CartRemoveResponse = {
  cart: string[]
}

export type CheckoutResponse = {
  order_id: string
  invoice_id: string
  invoice_url: string | null
  expires_at: string | null
}

export type MarketplaceOffer = {
  id: string
  buyer_id: string
  card_id: string
  amount: number
  message: string | null
  status: "pending" | "accepted" | "rejected"
}

export type SubmitOfferResponse = {
  offer: MarketplaceOffer
}

export type OfferSellerAction = "accept" | "reject"

export type RespondToOfferAcceptResponse = {
  order_id: string
  invoice_id: string
  invoice_url: string | null
  expires_at: string | null
  offer_id: string
}

export type RespondToOfferRejectResponse = {
  ok: true
}

export type OrderStatusResponse = {
  order_id: string
  order_status: MarketplaceOrderStatus
  btcpay_status: string
}

export type SellerPendingOfferRow = {
  id: string
  card_id: string
  buyer_id: string
  amount: number
  message: string | null
  status: string
  card_listing_title: string
  listing_grade_summary?: string
}

export type ListSellerOffersResponse = {
  offers: SellerPendingOfferRow[]
}

export type BuyerOfferRow = {
  id: string
  card_id: string
  card_title: string
  card_thumbnail: string | null
  card_grade: string | null
  seller_name: string | null
  asking_price: number | null
  amount: number
  message: string | null
  status: "pending" | "accepted" | "rejected" | "cancelled"
  order_id: string | null
  created_at: string
}

export type ListMyOffersResponse = {
  offers: BuyerOfferRow[]
}
