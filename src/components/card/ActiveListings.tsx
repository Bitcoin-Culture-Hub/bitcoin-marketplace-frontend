import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OfferModal, type OfferModalCard } from "@/components/marketplace/OfferModal"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Listing {
  id: string
  sellerId: string
  sellerName: string
  grade: string
  gradingCompany: string
  certNumber: string
  price: number
  offersEnabled: boolean
  isSold?: boolean
}

interface CardData {
  name: string
  series: string
  year: string
  cardNumber: string
  frontImage: string
}

interface ActiveListingsProps {
  listings: Listing[]
  card?: CardData
}

const ActiveListings = ({ listings, card }: ActiveListingsProps) => {
  const navigate = useNavigate()
  const { customer } = useAuth()
  const { addLine, isBusy } = useCart()
  const { toast } = useToast()
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  const sortedListings = [...listings].sort((a, b) => a.price - b.price)

  const defaultCard: CardData = {
    name: "Satoshi Nakamoto Genesis Card",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#001",
    frontImage: "/placeholder.svg",
  }
  const cardData = card ?? defaultCard

  const offerCard: OfferModalCard = {
    name: cardData.name,
    series: cardData.series,
    year: cardData.year,
    cardNumber: cardData.cardNumber,
    frontImage: cardData.frontImage,
  }

  const handleMakeOffer = (listing: Listing) => {
    setSelectedListing(listing)
    setIsOfferModalOpen(true)
  }

  const isViewerSeller = (l: Listing) =>
    !!customer && customer.id === l.sellerId

  const handleBuyNow = async (listing: Listing) => {
    if (listing.isSold || isViewerSeller(listing)) return
    if (!customer) {
      toast({ title: "Sign in required", variant: "destructive" })
      navigate("/login", { state: { from: window.location.pathname } })
      return
    }
    setAddingId(listing.id)
    try {
      await addLine({
        cardId: listing.id,
        displayName: cardData.name,
        gradeLabel: `${listing.gradingCompany} ${listing.grade}`,
        priceBTC: null,
        priceUSD: listing.price,
      })
      toast({ title: "Added to cart" })
    } catch {
      toast({ title: "Could not add to cart", variant: "destructive" })
    } finally {
      setAddingId(null)
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Active Listings
        </h2>
        <span className="text-xs text-muted-foreground">
          {listings.length} available
        </span>
      </div>

      {sortedListings.length === 0 ? (
        <div className="border border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No active listings for this card.
          </p>
        </div>
      ) : (
        <div className="border border-border">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border">
            <span className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Seller
            </span>
            <span className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Grade
            </span>
            <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Price
            </span>
            <span className="col-span-4 text-[10px] text-muted-foreground uppercase tracking-[0.1em] text-right">
              Actions
            </span>
          </div>

          <div className="divide-y divide-border">
            {sortedListings.map((listing) => {
              const sold = listing.isSold === true
              const canBuy = !sold && !isViewerSeller(listing)
              const canOffer =
                !sold && !isViewerSeller(listing) && listing.offersEnabled

              return (
                <div
                  key={listing.id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center"
                >
                  <button
                    onClick={() => navigate(`/store/${listing.sellerId}`)}
                    className="col-span-3 text-sm text-foreground hover:text-primary transition-colors text-left truncate"
                  >
                    {listing.sellerName}
                  </button>

                  <div className="col-span-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">
                      {listing.gradingCompany}
                    </span>
                    <span className="text-base font-mono font-medium text-foreground">
                      {listing.grade}
                    </span>
                    {sold && (
                      <Badge variant="secondary" className="rounded-none text-[10px]">
                        Sold
                      </Badge>
                    )}
                  </div>

                  <span className="col-span-2 text-base font-mono font-medium text-foreground">
                    ${listing.price.toLocaleString()}
                  </span>

                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-4 rounded-none"
                      disabled={!canBuy || isBusy || addingId === listing.id}
                      onClick={() => void handleBuyNow(listing)}
                    >
                      {addingId === listing.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : sold ? (
                        "Sold"
                      ) : (
                        "Buy now"
                      )}
                    </Button>
                    {canOffer && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMakeOffer(listing)}
                        className="border-border text-xs h-8 px-4 rounded-none"
                      >
                        Make offer
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedListing && (
        <OfferModal
          open={isOfferModalOpen}
          onOpenChange={(o) => {
            setIsOfferModalOpen(o)
            if (!o) setSelectedListing(null)
          }}
          listing={{
            id: selectedListing.id,
            sellerId: selectedListing.sellerId,
            sellerName: selectedListing.sellerName,
            grade: selectedListing.grade,
            gradingCompany: selectedListing.gradingCompany,
            certNumber: selectedListing.certNumber,
            priceUsd: selectedListing.price,
            acceptsOffers: selectedListing.offersEnabled,
          }}
          card={offerCard}
        />
      )}
    </section>
  )
}

export default ActiveListings
