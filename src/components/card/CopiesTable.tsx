import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CopiesTableFilters, { SortOption } from "./CopiesTableFilters"
import { OfferModal, type OfferModalCard } from "@/components/marketplace/OfferModal"
import type { Listing } from "@/hooks/medusa/useListings"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CardData {
  name: string
  series: string
  year: string
  cardNumber: string
  frontImage: string
}

interface CopiesTableProps {
  listings: Listing[]
  card: CardData
  onMetricsUpdate?: (metrics: {
    floorBTC: number | null
    availableCount: number
    offersAcceptedCount: number
  }) => void
}

const CopiesTable = ({ listings, card }: CopiesTableProps) => {
  const navigate = useNavigate()
  const { customer } = useAuth()
  const { addLine, isBusy } = useCart()
  const { toast } = useToast()

  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedGradingCompanies, setSelectedGradingCompanies] = useState<
    string[]
  >([])
  const [buyNowOnly, setBuyNowOnly] = useState(false)
  const [offersAccepted, setOffersAccepted] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("price-asc")

  const [offerListing, setOfferListing] = useState<Listing | null>(null)
  const [offerOpen, setOfferOpen] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  const offerCard: OfferModalCard = {
    name: card.name,
    series: card.series,
    year: card.year,
    cardNumber: card.cardNumber,
    frontImage: card.frontImage,
  }

  const handleClearFilters = () => {
    setSelectedGrades([])
    setSelectedGradingCompanies([])
    setBuyNowOnly(false)
    setOffersAccepted(false)
  }

  const filteredListings = useMemo(() => {
    let result = [...listings]

    if (selectedGrades.length > 0) {
      result = result.filter((l) => selectedGrades.includes(l.grade))
    }

    if (selectedGradingCompanies.length > 0) {
      result = result.filter((l) =>
        selectedGradingCompanies.includes(l.gradingCompany)
      )
    }

    if (buyNowOnly) {
      result = result.filter((l) => l.priceBTC !== null)
    }

    if (offersAccepted) {
      result = result.filter((l) => l.acceptsOffers)
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          if (a.priceBTC === null) return 1
          if (b.priceBTC === null) return -1
          return a.priceBTC - b.priceBTC
        })
        break
      case "grade-desc":
        result.sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade))
        break
      case "newest":
        result.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
        break
    }

    return result
  }, [
    listings,
    selectedGrades,
    selectedGradingCompanies,
    buyNowOnly,
    offersAccepted,
    sortBy,
  ])

  const openOffer = (listing: Listing) => {
    setOfferListing(listing)
    setOfferOpen(true)
  }

  const isViewerSeller = (listing: Listing) =>
    !!customer && customer.id === listing.sellerId

  const handleBuyNow = async (listing: Listing) => {
    if (!customer) {
      toast({
        title: "Sign in required",
        description: "Log in to purchase.",
        variant: "destructive",
      })
      navigate("/login", {
        state: { from: window.location.pathname },
      })
      return
    }
    if (listing.isSold) return
    if (isViewerSeller(listing)) {
      toast({
        title: "Your listing",
        description: "You cannot buy your own card.",
        variant: "destructive",
      })
      return
    }
    if (listing.priceBTC === null && listing.priceUSD === null) {
      toast({
        title: "Not for sale",
        description: "This copy has no buy-now price.",
        variant: "destructive",
      })
      return
    }
    setAddingId(listing.id)
    try {
      await addLine({
        cardId: listing.id,
        displayName: card.name,
        gradeLabel: `${listing.gradingCompany} ${listing.grade}`,
        priceBTC: listing.priceBTC,
        priceUSD: listing.priceUSD,
      })
      toast({ title: "Added to cart" })
    } catch {
      toast({
        title: "Could not add to cart",
        variant: "destructive",
      })
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <CopiesTableFilters
        selectedGrades={selectedGrades}
        onGradesChange={setSelectedGrades}
        selectedGradingCompanies={selectedGradingCompanies}
        onGradingCompaniesChange={setSelectedGradingCompanies}
        buyNowOnly={buyNowOnly}
        onBuyNowOnlyChange={setBuyNowOnly}
        offersAccepted={offersAccepted}
        onOffersAcceptedChange={setOffersAccepted}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={listings.length}
        filteredCount={filteredListings.length}
        onClearFilters={handleClearFilters}
      />

      <div>
        {filteredListings.length === 0 ? (
          <div className="border border-border py-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No copies match your filters.
            </p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="rounded-none"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="border border-border">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/30 border-b border-border">
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Grade
              </span>
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Price (BTC)
              </span>
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Offers
              </span>
              <span className="col-span-2 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Seller
              </span>
              <span className="col-span-1 text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
                Ships From
              </span>
              <span className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-[0.1em] text-right">
                Actions
              </span>
            </div>

            <div className="divide-y divide-border">
              {filteredListings.map((listing) => {
                const sold = listing.isSold
                const canBuy =
                  !sold &&
                  !isViewerSeller(listing) &&
                  (listing.priceBTC !== null || listing.priceUSD !== null)
                const canOffer =
                  !sold &&
                  !isViewerSeller(listing) &&
                  listing.acceptsOffers

                return (
                  <div key={listing.id}>
                    <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
                      <div className="col-span-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-mono font-bold text-foreground">
                          {listing.grade}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">
                          {listing.gradingCompany}
                        </span>
                        {sold && (
                          <Badge
                            variant="secondary"
                            className="rounded-none text-[10px]"
                          >
                            Sold
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2">
                        {listing.priceBTC !== null ? (
                          <span className="text-base font-mono font-medium text-foreground">
                            {listing.priceBTC} BTC
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        {listing.acceptsOffers ? (
                          <span className="text-sm text-foreground">Yes</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">No</span>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-foreground truncate block text-left">
                          {listing.sellerName}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-xs text-muted-foreground">
                          {listing.shipsFromRegion}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2 flex-wrap">
                        <Button
                          size="sm"
                          className="bg-foreground text-background text-xs h-8 px-4 rounded-none"
                          disabled={!canBuy || isBusy || addingId === listing.id}
                          onClick={() => void handleBuyNow(listing)}
                        >
                          {addingId === listing.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Buy now"
                          )}
                        </Button>
                        {canOffer && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-accent text-accent-foreground border-accent text-xs h-8 px-4 rounded-none"
                            onClick={() => openOffer(listing)}
                          >
                            Make offer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {offerListing && (
        <OfferModal
          open={offerOpen}
          onOpenChange={(o) => {
            setOfferOpen(o)
            if (!o) setOfferListing(null)
          }}
          listing={{
            id: offerListing.id,
            sellerId: offerListing.sellerId,
            sellerName: offerListing.sellerName,
            grade: offerListing.grade,
            gradingCompany: offerListing.gradingCompany,
            certNumber: offerListing.certNumber,
            priceUsd: offerListing.priceUSD ?? 0,
            acceptsOffers: offerListing.acceptsOffers,
          }}
          card={offerCard}
        />
      )}
    </div>
  )
}

export default CopiesTable
