import { CheckoutMode } from "./ItemSummaryCard";

interface PriceBreakdownProps {
  mode: CheckoutMode;
  itemPriceBTC: number;
  offerAmountBTC?: number;
  marketplaceFeeBTC: number;
  shippingBTC: number;
  btcToUsd?: number; // Exchange rate
}

const PriceBreakdown = ({
  mode,
  itemPriceBTC,
  offerAmountBTC,
  marketplaceFeeBTC,
  shippingBTC,
  btcToUsd = 65000,
}: PriceBreakdownProps) => {
  const basePriceBTC = mode === "OFFER" && offerAmountBTC ? offerAmountBTC : itemPriceBTC;
  const totalBTC = basePriceBTC + marketplaceFeeBTC + shippingBTC;
  const totalUSD = totalBTC * btcToUsd;

  const formatBTC = (amount: number) => {
    return amount.toFixed(8).replace(/\.?0+$/, (m) => m.length > 1 ? "" : m);
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border border-border bg-card">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {mode === "OFFER" ? "Offer amount" : "Item price"}
          </span>
          <span className="text-sm font-mono text-foreground">
            {formatBTC(basePriceBTC)} BTC
          </span>
        </div>

        {marketplaceFeeBTC > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Marketplace fee</span>
            <span className="text-sm font-mono text-foreground">
              {formatBTC(marketplaceFeeBTC)} BTC
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Shipping</span>
          <span className="text-sm font-mono text-foreground">
            {shippingBTC > 0 ? `${formatBTC(shippingBTC)} BTC` : "Included"}
          </span>
        </div>
      </div>

      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Total required in escrow
          </span>
          <div className="text-right">
            <p className="text-lg font-display font-medium text-foreground">
              {formatBTC(totalBTC)} BTC
            </p>
            <p className="text-xs text-muted-foreground">
              ≈ {formatUSD(totalUSD)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
