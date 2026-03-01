import { ExternalLink } from "lucide-react";

interface PopulationSummaryProps {
  totalGradedPopulation: number;
  lastUpdated: string;
}

const gradingCompanyLinks = [
  { name: "PSA", url: "https://www.psacard.com/pop" },
  { name: "BGS", url: "https://www.beckett.com/grading/pop-report" },
  { name: "SGC", url: "https://www.sgccard.com/population" },
  { name: "TAG", url: "https://taggrading.com/population" },
];

const PopulationSummary = ({
  totalGradedPopulation,
  lastUpdated,
}: PopulationSummaryProps) => {
  return (
    <section className="border border-border">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
          Population & Market Summary
        </h2>
      </div>
      <div className="p-5">
        <div className="mb-5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] block mb-1">
            Total Graded
          </span>
          <span className="text-lg font-mono font-medium text-foreground">
            {totalGradedPopulation.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            as of {lastUpdated}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {gradingCompanyLinks.map((company) => (
            <a
              key={company.name}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {company.name} Population
              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopulationSummary;
