import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { pollOrderStatus, ApiError } from "@/services/store.api"
import { useToast } from "@/hooks/use-toast"
import type { MarketplaceOrderStatus } from "@/types/shared"

function statusMessage(status: MarketplaceOrderStatus | undefined) {
  switch (status) {
    case "pending":
      return "Waiting for payment…"
    case "paid":
      return "Payment confirmed!"
    case "expired":
      return "Invoice expired."
    case "failed":
      return "Payment failed."
    default:
      return "Checking payment status…"
  }
}

const OrderConfirmPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ["order-status", orderId],
    queryFn: () => pollOrderStatus(orderId!),
    enabled: !!orderId,
    retry: 1,
    refetchInterval: (q) => {
      const s = q.state.data?.order_status
      if (s === "paid" || s === "expired" || s === "failed") return false
      return 3000
    },
  })

  useEffect(() => {
    if (query.data?.order_status === "paid") {
      const t = window.setTimeout(() => {
        navigate(`/orders/${orderId}/success`, { replace: true })
      }, 1600)
      return () => window.clearTimeout(t)
    }
  }, [query.data?.order_status, orderId, navigate])

  useEffect(() => {
    if (query.isError && query.error instanceof ApiError) {
      toast({
        title: "Could not load order",
        description: query.error.message,
        variant: "destructive",
      })
    }
  }, [query.isError, query.error, toast])

  const status = query.data?.order_status
  const btcpay = query.data?.btcpay_status

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 max-w-lg mx-auto px-6 py-16 w-full text-center space-y-6">
        <h1 className="text-2xl font-display font-medium text-foreground">
          Order status
        </h1>

        {query.isLoading && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}

        {!query.isLoading && query.isError && (
          <p className="text-sm text-destructive">
            {query.error instanceof ApiError
              ? query.error.message
              : "Something went wrong."}
          </p>
        )}

        {query.data && (
          <>
            <p className="text-lg text-foreground">{statusMessage(status)}</p>
            {status === "paid" && (
              <p className="text-2xl" aria-hidden>
                🎉
              </p>
            )}
            {btcpay && (
              <p className="text-xs text-muted-foreground font-mono">
                BTCPay: {btcpay}
              </p>
            )}
            {status === "expired" && (
              <Button
                className="rounded-none"
                onClick={() => navigate("/marketplace")}
              >
                Browse marketplace
              </Button>
            )}
            {status === "failed" && (
              <p className="text-sm text-muted-foreground">
                If funds left your wallet, contact support with your order ID:{" "}
                <span className="font-mono text-foreground">{orderId}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OrderConfirmPage
