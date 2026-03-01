interface CardMetadataProps {
  series: string;
  year: string;
  cardNumber: string;
  variants?: string[];
}

const CardMetadata = ({
  series,
  year,
  cardNumber,
  variants,
}: CardMetadataProps) => {
  return (
    <section className="border border-border">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Canonical Metadata
        </h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Series
            </span>
            <span className="text-sm font-medium text-foreground">{series}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Year
            </span>
            <span className="text-sm font-medium text-foreground">{year}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Card Number
            </span>
            <span className="text-sm font-mono text-foreground">{cardNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
              Variants
            </span>
            <span className="text-sm text-foreground">
              {variants && variants.length > 0 ? variants.join(", ") : "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardMetadata;
