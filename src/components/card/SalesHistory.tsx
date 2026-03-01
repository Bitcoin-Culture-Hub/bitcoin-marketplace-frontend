interface Sale {
  id: string;
  price: number;
  grade: string;
  gradingCompany: string;
  date: string;
}

interface SalesHistoryProps {
  sales: Sale[];
}

const SalesHistory = ({ sales }: SalesHistoryProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Market Record
        </h2>
        <span className="text-xs text-muted-foreground">
          {sales.length} transactions
        </span>
      </div>

      {sales.length === 0 ? (
        <div className="border border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No recorded sales for this card.
          </p>
        </div>
      ) : (
        <div className="border border-border">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 px-5 py-3 bg-muted/30 border-b border-border">
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Date
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Grade
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em]">
              Sale Price
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="grid grid-cols-3 gap-4 px-5 py-3"
              >
                <span className="text-sm text-muted-foreground">{sale.date}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5">
                    {sale.gradingCompany}
                  </span>
                  <span className="text-sm font-mono font-medium text-foreground">
                    {sale.grade}
                  </span>
                </div>
                <span className="text-sm font-mono font-medium text-foreground">
                  ${sale.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SalesHistory;
