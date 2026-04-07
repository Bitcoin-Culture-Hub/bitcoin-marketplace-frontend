import { Link, useParams } from "react-router-dom"
import Header from "@/components/layout/Header"
import { Button } from "@/components/ui/button"

const OrderSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 max-w-lg mx-auto px-6 py-16 w-full text-center space-y-6">
        <h1 className="text-2xl font-display font-medium text-foreground">
          Thank you
        </h1>
        <p className="text-sm text-muted-foreground">
          Your payment was received. Order{" "}
          <span className="font-mono text-foreground">{orderId}</span> is
          complete.
        </p>
        <Button asChild className="rounded-none">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </div>
    </div>
  )
}

export default OrderSuccessPage
