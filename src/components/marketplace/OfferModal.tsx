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
import { CheckCircle, Loader2 } from "lucide-react"

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

  if (done) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose()
        }}
      >
        <DialogContent className="max-w-md p-0 gap-0 bg-background border-border overflow-hidden rounded-none">
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-accent" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-display font-medium text-foreground mb-2">
              Offer submitted
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
              The seller can accept or decline from their dashboard.
            </p>
            <Button
              className="w-full h-12 rounded-none bg-foreground text-background"
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
      <DialogContent className="max-w-lg p-0 gap-0 bg-background border-border overflow-hidden rounded-none">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-xl font-display font-medium text-foreground">
            Make an offer
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Amounts are in USD; payment will use your checkout currency.
          </p>
        </div>

        <div className="px-8 pb-6">
          <div className="flex gap-5 p-5 bg-muted/30 border border-border">
            <div className="flex-shrink-0">
              <img
                src={card.frontImage}
                alt={card.name}
                className="w-20 h-28 object-cover border border-border"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-sm font-medium text-foreground leading-tight">
                  {card.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {card.series} • {card.year}
                </p>
              </div>
              <div>
                <div className="bg-foreground text-background px-2 py-0.5 text-[10px] font-mono font-medium inline-block mb-1.5">
                  {listing.gradingCompany} {listing.grade}
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                    Asking
                  </span>
                  <span className="font-mono text-base font-medium text-foreground">
                    ${listing.priceUsd.toLocaleString()} USD
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Seller: {listing.sellerName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border mx-8" />

        <div className="px-8 py-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Your offer (USD)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
              className="h-12 text-lg font-mono rounded-none border-border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional note to the seller"
              className="min-h-[88px] rounded-none border-border resize-none"
            />
          </div>
        </div>

        <div className="px-8 py-5 border-t border-border flex gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1 h-12 rounded-none"
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!validAmount || submitting}
            className="flex-1 h-12 rounded-none bg-accent text-accent-foreground"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit offer"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
