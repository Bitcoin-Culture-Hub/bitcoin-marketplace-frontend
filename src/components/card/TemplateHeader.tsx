interface TemplateHeaderProps {
  name: string;
  series: string;
  cardNumber: string;
  year: string;
  printRun?: number | null;
}

const TemplateHeader = ({
  name,
  series,
  cardNumber,
  year,
  printRun,
}: TemplateHeaderProps) => {
  return (
    <div className="space-y-3">
      {/* Template Title */}
      <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground leading-tight">
        {name}
      </h1>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Set/Series:</span>
          <span className="text-foreground">{series}</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Card #:</span>
          <span className="font-mono text-foreground">{cardNumber}</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Year:</span>
          <span className="text-foreground">{year}</span>
        </div>
        {printRun !== null && printRun !== undefined && (
          <>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Print run:</span>
              <span className="text-foreground">{printRun.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateHeader;
