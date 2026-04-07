import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import {
  listSellerPendingOffers,
  respondToOffer,
  ApiError,
} from "@/services/store.api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const SellerOffersPage = () => {
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
    mutationFn: async (input: { id: string; action: "accept" | "reject" }) => {
      return respondToOffer(input.id, input.action)
    },
    onSuccess: (data, vars) => {
      void qc.invalidateQueries({ queryKey: ["seller-offers"] })
      if (vars.action === "reject") {
        toast({ title: "Offer rejected" })
        return
      }
      if ("order_id" in data) {
        setAcceptResult({
          order_id: data.order_id,
          invoice_url: data.invoice_url,
        })
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-10 w-full space-y-8">
        <div>
          <h1 className="text-lg font-display font-medium text-foreground">
            Offers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pending offers on your listings
          </p>
        </div>

        {offersQuery.isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {offersQuery.isError && (
          <p className="text-sm text-destructive">
            {offersQuery.error instanceof ApiError
              ? offersQuery.error.message
              : "Could not load offers."}
          </p>
        )}

        {offersQuery.data?.offers.length === 0 && !offersQuery.isLoading && (
          <p className="text-sm text-muted-foreground border border-border py-12 text-center">
            No pending offers.
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
                  onClick={() =>
                    respond.mutate({ id: o.id, action: "reject" })
                  }
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
      </div>

      <Dialog
        open={!!acceptResult}
        onOpenChange={(v) => {
          if (!v) setAcceptResult(null)
        }}
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
                  <a
                    href={acceptResult.invoice_url}
                    target="_blank"
                    rel="noreferrer"
                  >
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
    </div>
  )
}

export default SellerOffersPage
