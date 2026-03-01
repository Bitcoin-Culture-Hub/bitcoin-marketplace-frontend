interface PriceContextProps {
  lowestActivePrice: number | null;
  highestActivePrice: number | null;
  lastSalePrice: number | null;
  lastSaleDate: string | null;
  totalSalesCount: number;
  activeListingsCount: number;
}

const PriceContext = ({
  lowestActivePrice,
  highestActivePrice,
  lastSalePrice,
  lastSaleDate,
  totalSalesCount,
  activeListingsCount,
}: PriceContextProps) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return "—";
    return `$${price.toLocaleString()}`;
  };

  return (
    <section className="border border-border">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Market Context
        </h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Lowest Active
            </span>
            <span className="text-lg font-mono font-medium text-foreground">
              {formatPrice(lowestActivePrice)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Highest Active
            </span>
            <span className="text-lg font-mono font-medium text-foreground">
              {formatPrice(highestActivePrice)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Most Recent Sale
            </span>
            <span className="text-lg font-mono font-medium text-foreground">
              {formatPrice(lastSalePrice)}
            </span>
            {lastSaleDate && (
              <span className="text-xs text-muted-foreground block mt-0.5">
                {lastSaleDate}
              </span>
            )}
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Total Sales
            </span>
            <span className="text-lg font-mono font-medium text-foreground">
              {totalSalesCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Active Listings
            </span>
            <span className="text-lg font-mono font-medium text-foreground">
              {activeListingsCount}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceContext;
