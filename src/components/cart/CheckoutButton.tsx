import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function CheckoutButton() {
  const { lines, checkout, isBusy, lastError } = useCart()
  const { toast } = useToast()
  const disabled = lines.length !== 1 || isBusy

  const handleClick = async () => {
    if (lines.length !== 1) {
      toast({
        title: "One item only",
        description:
          lines.length === 0
            ? "Add a listing to your cart first."
            : "Remove extra items — checkout supports one card per invoice.",
        variant: "destructive",
      })
      return
    }
    try {
      await checkout()
    } catch {
      toast({
        title: "Checkout failed",
        description: lastError ?? "Try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      type="button"
      className="w-full h-12 rounded-none bg-foreground text-background font-display text-xs uppercase tracking-wider"
      disabled={disabled}
      onClick={() => void handleClick()}
    >
      {isBusy ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processing…
        </>
      ) : (
        "Checkout with BTCPay"
      )}
    </Button>
  )
}
