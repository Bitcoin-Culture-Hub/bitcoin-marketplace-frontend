import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const series = [
  "Series 1 OPP",
  "Series 2 OPP",
  "Series 3 OPP",
  "Series 4 OPP",
  "Commemorative",
  "Collaborative",
];

const gradingCompanies = ["PSA", "BGS", "SGC", "TAG"];
const grades = ["10", "9.5", "9", "8.5", "8", "7", "6"];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface TemplateFilterSidebarProps {
  selectedSeries: string[];
  onSeriesChange: (series: string[]) => void;
  selectedGradingCompanies: string[];
  onGradingCompaniesChange: (companies: string[]) => void;
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
  onReset: () => void;
}

const TemplateFilterSidebar = ({
  selectedSeries,
  onSeriesChange,
  selectedGradingCompanies,
  onGradingCompaniesChange,
  selectedGrades,
  onGradesChange,
  availableOnly,
  onAvailableOnlyChange,
  onReset,
}: TemplateFilterSidebarProps) => {
  

  const handleSeriesToggle = (s: string) => {
    if (selectedSeries.includes(s)) {
      onSeriesChange(selectedSeries.filter((item) => item !== s));
    } else {
      onSeriesChange([...selectedSeries, s]);
    }
  };

  const handleGradingCompanyToggle = (company: string) => {
    if (selectedGradingCompanies.includes(company)) {
      onGradingCompaniesChange(selectedGradingCompanies.filter((item) => item !== company));
    } else {
      onGradingCompaniesChange([...selectedGradingCompanies, company]);
    }
  };

  const handleGradeToggle = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      onGradesChange(selectedGrades.filter((item) => item !== grade));
    } else {
      onGradesChange([...selectedGrades, grade]);
    }
  };

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-background p-5 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground">
          Filters
        </span>
        <Button
          variant="link"
          onClick={onReset}
          className="text-[10px] text-muted-foreground hover:text-foreground p-0 h-auto uppercase tracking-wider"
        >
          Reset
        </Button>
      </div>

      {/* Year */}
      <div className="py-2 pb-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Year
        </span>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="From"
            className="bg-background border-border text-xs h-8 rounded-none"
          />
          <Input
            placeholder="To"
            className="bg-background border-border text-xs h-8 rounded-none"
          />
        </div>
      </div>

      {/* Set / Series */}
      <FilterSection title="Set / Series">
        <div className="space-y-2">
          {series.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedSeries.includes(s)}
                onCheckedChange={() => handleSeriesToggle(s)}
                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Grading Company */}
      <FilterSection title="Grading Company">
        <div className="space-y-2">
          {gradingCompanies.map((company) => (
            <label key={company} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedGradingCompanies.includes(company)}
                onCheckedChange={() => handleGradingCompanyToggle(company)}
                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                {company}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Grade */}
      <FilterSection title="Grade">
        <div className="space-y-2">
          {grades.map((grade) => (
            <label key={grade} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={selectedGrades.includes(grade)}
                onCheckedChange={() => handleGradeToggle(grade)}
                className="border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-3.5 w-3.5 rounded-none"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {grade}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Coming Soon Section */}
      <div className="pt-4 mt-4 border-t border-border">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Coming Soon
        </span>
      </div>

      <div className="opacity-40 pointer-events-none select-none space-y-1">
        {/* Availability */}
        <div className="py-2 pb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Availability
          </span>
          <div className="space-y-2 mt-2">
            <label className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Available only</span>
              <Switch checked={false} disabled className="scale-75" />
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div className="py-2 pb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Price Range (BTC)
          </span>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Min"
              disabled
              className="bg-background border-border text-xs h-8 rounded-none"
            />
            <Input
              placeholder="Max"
              disabled
              className="bg-background border-border text-xs h-8 rounded-none"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TemplateFilterSidebar;
