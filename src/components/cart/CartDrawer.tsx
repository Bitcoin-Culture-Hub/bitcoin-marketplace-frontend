import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { CheckoutButton } from "./CheckoutButton"

export function CartDrawer() {
  const {
    lines,
    drawerOpen,
    closeDrawer,
    removeLine,
    isBusy,
    lastError,
    clearError,
  } = useCart()
  const { toast } = useToast()

  const handleRemove = async (cardId: string) => {
    try {
      await removeLine(cardId)
      toast({ title: "Removed from cart" })
    } catch {
      toast({
        title: "Could not remove",
        description: lastError ?? "Try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet
      open={drawerOpen}
      onOpenChange={(open) => {
        if (!open) {
          clearError()
          closeDrawer()
        }
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col rounded-none border-border"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="text-left border-b border-border pb-4">
          <SheetTitle className="font-display text-lg">Cart</SheetTitle>
        </SheetHeader>

        {lastError && (
          <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 mt-4">
            {lastError}
          </p>
        )}

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            lines.map((line) => (
              <div
                key={line.cardId}
                className="flex gap-4 border border-border p-4"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {line.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {line.gradeLabel}
                  </p>
                  <div className="text-sm font-mono pt-1">
                    {line.priceBTC != null ? (
                      <span>{line.priceBTC} BTC</span>
                    ) : line.priceUSD != null ? (
                      <span>${line.priceUSD.toLocaleString()} USD</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none shrink-0"
                  disabled={isBusy}
                  onClick={() => void handleRemove(line.cardId)}
                  aria-label="Remove from cart"
                >
                  {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <CheckoutButton />
        </div>
      </SheetContent>
    </Sheet>
  )
}
