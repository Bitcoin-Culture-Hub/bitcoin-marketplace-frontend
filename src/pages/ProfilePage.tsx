import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  listMyOffers,
  listSellerPendingOffers,
  respondToOffer,
  ApiError,
} from "@/services/store.api"
import { useToast } from "@/hooks/use-toast"
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
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { customer } = useAuth()
  if (!customer) return null

  const initials = [customer.first_name?.[0], customer.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || customer.email[0].toUpperCase()

  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "—"

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-xl font-display font-medium shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-base font-medium text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </div>

      <div className="border border-border divide-y divide-border">
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-muted-foreground">Email</span>
          <span className="text-foreground">{customer.email}</span>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-muted-foreground">Name</span>
          <span className="text-foreground">{fullName}</span>
        </div>
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-muted-foreground">Member ID</span>
          <span className="text-foreground font-mono text-xs">
            {customer.id.slice(0, 20)}…
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── My Offers tab (buyer view, with polling) ─────────────────────────────────

const POLL_INTERVAL = 5000

function MyOffersTab() {
  const navigate = useNavigate()
  const [offers, setOffers] = useState<BuyerOfferRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load offers.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchOffers()
    intervalRef.current = setInterval(() => {
      void fetchOffers()
    }, POLL_INTERVAL)
    return () => stopPolling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalOffers = offers.length
  const pendingCount = offers.filter((o) => o.status === "pending").length
  const acceptedCount = offers.filter((o) => o.status === "accepted").length

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (totalOffers === 0) {
    return (
      <p className="text-sm text-muted-foreground border border-border py-12 text-center">
        You haven't submitted any offers yet.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: totalOffers },
          { label: "Pending", value: pendingCount },
          { label: "Accepted", value: acceptedCount },
        ].map(({ label, value }) => (
          <div key={label} className="border border-border px-4 py-3 flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-mono font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Offer cards */}
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
                    onClick={() => navigate(`/orders/${offer.order_id}/confirm`)}
                  >
                    Pay Now
                  </Button>
                </div>
              )}

              {isRejected && (
                <p className="text-sm text-red-700">This offer was not accepted.</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
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

                  {offer.seller_name && (
                    <p className="text-xs text-muted-foreground">
                      Seller: {offer.seller_name}
                    </p>
                  )}

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

                  {offer.message && (
                    <p className="text-sm text-muted-foreground border-l-2 border-border pl-3">
                      {offer.message}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Submitted{" "}
                    {new Date(offer.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

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
  )
}

// ─── Received Offers tab (seller view) ────────────────────────────────────────

function ReceivedOffersTab() {
  const { toast } = useToast()
  const qc = useQueryClient()
  const [acceptResult, setAcceptResult] = useState<{
    order_id: string
    invoice_url: string | null
  } | null>(null)

  const offersQuery = useQuery({
    queryKey: ["seller-offers"],
    queryFn: listSellerPendingOffers,
  })

  const respond = useMutation({
    mutationFn: async (input: { id: string; action: "accept" | "reject" }) =>
      respondToOffer(input.id, input.action),
    onSuccess: (data, vars) => {
      void qc.invalidateQueries({ queryKey: ["seller-offers"] })
      if (vars.action === "reject") {
        toast({ title: "Offer rejected" })
        return
      }
      if ("order_id" in data) {
        setAcceptResult({ order_id: data.order_id, invoice_url: data.invoice_url })
        toast({
          title: "Order created",
          description: "Share the BTCPay link with the buyer so they can pay.",
        })
      }
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : "Action failed"
      toast({ title: "Error", description: msg, variant: "destructive" })
    },
  })

  if (offersQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (offersQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {offersQuery.error instanceof ApiError
          ? offersQuery.error.message
          : "Could not load offers."}
      </p>
    )
  }

  return (
    <>
      {offersQuery.data?.offers.length === 0 && (
        <p className="text-sm text-muted-foreground border border-border py-12 text-center">
          No pending offers on your listings.
        </p>
      )}

      <div className="space-y-4">
        {offersQuery.data?.offers.map((o) => (
          <div
            key={o.id}
            className="border border-border p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div className="space-y-2 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {o.card_listing_title}
                {o.listing_grade_summary && (
                  <span className="text-muted-foreground font-mono ml-2">
                    {o.listing_grade_summary}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Buyer ID:{" "}
                <span className="font-mono text-foreground">{o.buyer_id}</span>
              </p>
              <p className="text-base font-mono text-foreground">
                ${o.amount.toLocaleString()} USD
              </p>
              {o.message && (
                <p className="text-sm text-muted-foreground border-l-2 border-border pl-3">
                  {o.message}
                </p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="rounded-none"
                disabled={respond.isPending}
                onClick={() => respond.mutate({ id: o.id, action: "reject" })}
              >
                Reject
              </Button>
              <Button
                size="sm"
                className="rounded-none bg-foreground text-background"
                disabled={respond.isPending}
                onClick={() => respond.mutate({ id: o.id, action: "accept" })}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!acceptResult}
        onOpenChange={(v) => { if (!v) setAcceptResult(null) }}
      >
        <DialogContent className="rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Order created</DialogTitle>
          </DialogHeader>
          {acceptResult && (
            <div className="space-y-4 text-sm">
              <p>
                Order{" "}
                <span className="font-mono">{acceptResult.order_id}</span> is
                ready for payment.
              </p>
              {acceptResult.invoice_url ? (
                <Button asChild className="w-full rounded-none">
                  <a href={acceptResult.invoice_url} target="_blank" rel="noreferrer">
                    Open BTCPay invoice
                  </a>
                </Button>
              ) : (
                <p className="text-muted-foreground">
                  No hosted invoice URL — check BTCPay configuration.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { customer, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tab = searchParams.get("tab") ?? "overview"

  const setTab = (value: string) => {
    setSearchParams({ tab: value }, { replace: true })
  }

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

  if (!customer) {
    navigate("/login", { replace: true })
    return null
  }

  const initials = [customer.first_name?.[0], customer.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || customer.email[0].toUpperCase()

  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    customer.email

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-10 w-full space-y-6">

        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center text-base font-display font-medium shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-lg font-display font-medium text-foreground">
              {fullName}
            </h1>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="rounded-none bg-muted w-full justify-start h-auto p-0 border-b border-border gap-0">
            {[
              { value: "overview",  label: "Overview" },
              { value: "my-offers", label: "My Offers" },
              { value: "received",  label: "Received Offers" },
            ].map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="rounded-none px-4 py-2.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:text-foreground"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="my-offers" className="mt-6">
            <MyOffersTab />
          </TabsContent>

          <TabsContent value="received" className="mt-6">
            <ReceivedOffersTab />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}

export default ProfilePage
