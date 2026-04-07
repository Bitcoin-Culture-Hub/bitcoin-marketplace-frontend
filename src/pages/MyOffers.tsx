import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { listMyOffers, ApiError } from "@/services/store.api"
import { useAuth } from "@/context/AuthContext"
import type { BuyerOfferRow } from "@/types/shared"

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending:   { label: "Pending",   className: "bg-yellow-100 text-yellow-800" },
  accepted:  { label: "Accepted",  className: "bg-green-100 text-green-800" },
  rejected:  { label: "Rejected",  className: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_BADGE[status] ?? STATUS_BADGE.cancelled
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border px-5 py-4 flex flex-col gap-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-mono font-medium text-foreground">{value}</p>
    </div>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const POLL_INTERVAL = 5000

// ─── Page ─────────────────────────────────────────────────────────────────────

const MyOffers = () => {
  const { customer, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [offers, setOffers] = useState<BuyerOfferRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const prevStatusRef = useRef<Record<string, string>>({})
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasPending = (rows: BuyerOfferRow[]) =>
    rows.some((o) => o.status === "pending")

  const stopPolling = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const fetchOffers = async () => {
    try {
      const data = await listMyOffers()
      const rows = data.offers

      setOffers(rows)
      setError(null)

      if (!hasPending(rows)) stopPolling()

      prevStatusRef.current = Object.fromEntries(
        rows.map((o) => [o.id, o.status])
      )
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load offers.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!customer) {
      navigate("/login", { replace: true })
      return
    }

    void fetchOffers()

    intervalRef.current = setInterval(() => {
      void fetchOffers()
    }, POLL_INTERVAL)

    return () => stopPolling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, authLoading])

  // ─── Auth loading state ────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  // ─── Derived stats ─────────────────────────────────────────────────────────

  const totalOffers = offers.length
  const pendingCount = offers.filter((o) => o.status === "pending").length
  const acceptedCount = offers.filter((o) => o.status === "accepted").length

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10 w-full space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-lg font-display font-medium text-foreground">
            My Offers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalOffers > 0
              ? `${totalOffers} offer${totalOffers !== 1 ? "s" : ""} submitted — updates every 5 seconds`
              : "Offers you have submitted — updates every 5 seconds"}
          </p>
        </div>

        {/* Stats strip */}
        {!loading && totalOffers > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total Offers" value={totalOffers} />
            <StatCard label="Pending" value={pendingCount} />
            <StatCard label="Accepted" value={acceptedCount} />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && totalOffers === 0 && (
          <p className="text-sm text-muted-foreground border border-border py-12 text-center">
            You haven't submitted any offers yet.
          </p>
        )}

        {/* Offer list */}
        <div className="space-y-4">
          {offers.map((offer) => {
            const isAccepted = offer.status === "accepted"
            const isRejected = offer.status === "rejected"

            return (
              <div
                key={offer.id}
                className={`border p-5 space-y-3 ${
                  isAccepted
                    ? "border-green-300 bg-green-50"
                    : isRejected
                    ? "border-red-200 bg-red-50"
                    : "border-border"
                }`}
              >
                {/* Accepted banner */}
                {isAccepted && offer.order_id && (
                  <div className="bg-green-600 text-white rounded px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-sm font-medium">
                      Your offer was accepted! Click below to complete your purchase.
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-none shrink-0 bg-white text-green-700 hover:bg-green-50"
                      onClick={() =>
                        navigate(`/orders/${offer.order_id}/confirm`)
                      }
                    >
                      Pay Now
                    </Button>
                  </div>
                )}

                {/* Rejected note */}
                {isRejected && (
                  <p className="text-sm text-red-700">
                    This offer was not accepted.
                  </p>
                )}

                {/* Offer body */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  {/* Left: text info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Title + grade + badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {offer.card_title}
                      </p>
                      {offer.card_grade && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {offer.card_grade}
                        </span>
                      )}
                      <StatusBadge status={offer.status} />
                    </div>

                    {/* Seller */}
                    {offer.seller_name && (
                      <p className="text-xs text-muted-foreground">
                        Seller: {offer.seller_name}
                      </p>
                    )}

                    {/* Amounts */}
                    <div className="flex flex-wrap items-baseline gap-3 pt-0.5">
                      <p className="text-base font-mono text-foreground">
                        ${offer.amount.toLocaleString()} offered
                      </p>
                      {offer.asking_price != null && (
                        <p className="text-sm font-mono text-muted-foreground">
                          asking ${offer.asking_price.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    {offer.message && (
                      <p className="text-sm text-muted-foreground border-l-2 border-border pl-3">
                        {offer.message}
                      </p>
                    )}

                    {/* Date */}
                    <p className="text-xs text-muted-foreground">
                      Submitted{" "}
                      {new Date(offer.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Right: thumbnail */}
                  {offer.card_thumbnail ? (
                    <img
                      src={offer.card_thumbnail}
                      alt={offer.card_title}
                      className="w-16 h-20 object-cover border border-border shrink-0 self-start"
                    />
                  ) : (
                    <div className="w-16 h-20 border border-border bg-muted shrink-0 self-start" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default MyOffers
