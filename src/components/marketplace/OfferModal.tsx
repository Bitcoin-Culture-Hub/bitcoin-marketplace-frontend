import { useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { submitOffer, ApiError } from "@/services/store.api"
import { AlertTriangle, CheckCircle, ExternalLink, Gavel, Loader2 } from "lucide-react"

export type OfferModalListing = {
  id: string
  sellerId: string
  sellerName: string
  grade: string
  gradingCompany: string
  certNumber: string
  /** Asking price in USD (invoice currency) */
  priceUsd: number
  acceptsOffers: boolean
}

export type OfferModalCard = {
  name: string
  series: string
  year: string
  cardNumber: string
  frontImage: string
}

type OfferModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: OfferModalListing
  card: OfferModalCard
}

const MAX_MESSAGE_LENGTH = 200

export function OfferModal({
  open,
  onOpenChange,
  listing,
  card,
}: OfferModalProps) {
  const { customer } = useAuth()
  const { toast } = useToast()
  const [amountStr, setAmountStr] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const amountNum = parseFloat(amountStr)
  const validAmount = Number.isFinite(amountNum) && amountNum > 0

  const handleClose = () => {
    setAmountStr("")
    setMessage("")
    setDone(false)
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    if (!customer) {
      toast({
        title: "Sign in required",
        description: "Log in to make an offer.",
        variant: "destructive",
      })
      return
    }
    if (!validAmount) return
    setSubmitting(true)
    try {
      await submitOffer({
        card_id: listing.id,
        amount: amountNum,
        message: message.trim() || null,
      })
      setDone(true)
      toast({ title: "Offer sent", description: "The seller will be notified." })
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not submit offer"
      toast({ title: "Offer failed", description: msg, variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const sellerInitial = listing.sellerName?.[0]?.toUpperCase() ?? "S"

  if (done) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose()
        }}
      >
        <DialogContent className="max-w-md p-0 gap-0 bg-white rounded-3xl border-0 overflow-hidden">
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-btc-orange/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="h-7 w-7 text-btc-orange" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Offer submitted
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
              The seller can accept or decline from their dashboard.
            </p>
            <Button
              className="w-full h-12 rounded-full bg-btc-orange hover:bg-btc-orange/90 text-white font-semibold"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose()
      }}
    >
      <DialogContent className="max-w-[700px] p-0 gap-0 bg-white rounded-3xl border-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Orange pin icon */}
          <div className="w-11 h-11 rounded-xl bg-btc-orange flex items-center justify-center mb-5">
            <Gavel className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
            Make an offer
          </h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Submit an offer to the seller and wait for a response.
          </p>

          {/* Listing card */}
          <div className="mt-6 flex items-stretch gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            {/* Card image */}
            <div className="flex-shrink-0">
              <img
                src={card.frontImage}
                alt={card.name}
                className="w-14 h-20 object-cover rounded-md bg-white border border-gray-200"
              />
            </div>

            {/* Card details */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-[15px] font-semibold text-gray-900 leading-tight truncate">
                {card.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-white">
                  {listing.gradingCompany} - {listing.grade}
                </span>
                {card.series && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-white">
                    {card.series}
                  </span>
                )}
                {card.year && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-white">
                    {card.year}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-btc-orange font-semibold text-[15px]">
                  ${listing.priceUsd.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs">USD</span>
              </div>
            </div>

            {/* Seller */}
            <div className="flex flex-col items-center justify-center pl-4 border-l border-gray-200 min-w-[96px]">
              <div className="w-9 h-9 rounded-full bg-btc-orange/15 border border-btc-orange/20 flex items-center justify-center text-btc-orange text-sm font-semibold">
                {sellerInitial}
              </div>
              <span className="text-[11px] text-gray-700 mt-1.5 text-center leading-tight line-clamp-2">
                {listing.sellerName}
              </span>
              <ExternalLink className="h-3 w-3 text-gray-400 mt-1" strokeWidth={1.75} />
            </div>
          </div>

          {/* Your Offer */}
          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-900 block mb-2">
              Your Offer
            </label>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl h-12 overflow-hidden pr-1">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                className="flex-1 h-full border-0 bg-transparent text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0 pl-5 shadow-none"
              />
              <div className="flex items-center gap-1.5 px-4 border-l border-gray-200 h-full">
                <span className="w-5 h-5 rounded-full bg-btc-orange flex items-center justify-center text-white text-[11px] font-bold">
                  $
                </span>
                <span className="text-sm font-semibold text-gray-900">USD</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Asking: ${listing.priceUsd.toLocaleString()} USD
            </p>
          </div>

          {/* Message */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-900 block mb-2">
              Send a message to seller{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
              }
              placeholder="Write a message to the seller"
              className="min-h-[90px] rounded-2xl border-gray-200 resize-none p-4 text-sm focus-visible:ring-0 focus-visible:border-gray-300"
            />
            <p className="text-xs text-gray-400 mt-1">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>

          {/* Warning banner */}
          <div
            className="mt-5 rounded-2xl p-4 flex items-start gap-3"
            style={{
              background:
                "linear-gradient(90deg, #fef3e2 0%, #ffe5d6 35%, #ffd9e0 70%, #fff1c7 100%)",
            }}
          >
            <AlertTriangle
              className="h-5 w-5 text-white flex-shrink-0 mt-2 fill-gray-500"
              strokeWidth={1.75}
            />
            <p className="text-xs text-gray-500 leading-relaxed">
              Offers are binding upon acceptance. Expires in 48h if no response.
              Settlement in USD is required immediately upon acceptance.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-btc-orange text-btc-orange hover:bg-btc-orange/5 hover:text-btc-orange font-medium bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              disabled={!validAmount || submitting}
              className="flex-1 h-12 rounded-xl bg-btc-orange hover:bg-btc-orange/90 text-white font-medium disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Make Offer"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
