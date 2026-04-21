import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MarketplaceFilterOption } from "@/lib/marketplace-filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = false }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-[253px] mx-auto" style={{ padding: "10px" }}>
        <CollapsibleTrigger className="flex items-center justify-between w-[233px] h-[48px] bg-[#fefefe] px-3 rounded-lg group cursor-pointer">
          <span className="font-medium text-[16px] text-[#121212] tracking-[0.014em]" style={{ fontFamily: "Inter, sans-serif" }}>
            {title}
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-[#121212]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#121212]" />
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-6 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface TemplateFilterSidebarProps {
  selectedSeries: string[];
  onSeriesChange: (series: string[]) => void;
  seriesOptions: MarketplaceFilterOption[];
  selectedGradingCompanies: string[];
  onGradingCompaniesChange: (companies: string[]) => void;
  gradingCompanyOptions: MarketplaceFilterOption[];
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
  gradeOptions: MarketplaceFilterOption[];
  yearFrom: string;
  onYearFromChange: (value: string) => void;
  yearTo: string;
  onYearToChange: (value: string) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
  onReset: () => void;
}

const TemplateFilterSidebar = ({
  selectedSeries,
  onSeriesChange,
  seriesOptions,
  selectedGradingCompanies,
  onGradingCompaniesChange,
  gradingCompanyOptions,
  selectedGrades,
  onGradesChange,
  gradeOptions,
  yearFrom,
  onYearFromChange,
  yearTo,
  onYearToChange,
  availableOnly,
  onAvailableOnlyChange,
  onReset,
}: TemplateFilterSidebarProps) => {
  const sanitizeYearInput = (value: string) => value.replace(/\D/g, "").slice(0, 4);

  const handleSeriesToggle = (seriesValue: string) => {
    if (selectedSeries.includes(seriesValue)) {
      onSeriesChange(selectedSeries.filter((item) => item !== seriesValue));
    } else {
      onSeriesChange([...selectedSeries, seriesValue]);
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
    <aside className="w-[289px] flex-shrink-0 border-r border-[rgba(239,239,239,0.5)] bg-[#fefefe]">
      {/* Inner rounded card area */}
      <div className="rounded-[16px] pt-[84px]" style={{ gap: "24px", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3">
          <span className="font-medium text-[16px] text-[#121212] tracking-[0.014em]" style={{ fontFamily: "Inter, sans-serif" }}>
            Filters
          </span>
          <Button
            variant="link"
            onClick={onReset}
            className="text-[13px] text-[#888] hover:text-[#121212] p-0 h-auto"
          >
            Reset
          </Button>
        </div>

        {/* Series */}
        <FilterSection title="Series" defaultOpen>
          <div className="space-y-3">
            {seriesOptions.map((seriesOption) => (
              <label key={seriesOption.value} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedSeries.includes(seriesOption.value)}
                  onCheckedChange={() => handleSeriesToggle(seriesOption.value)}
                  className="border-[#d9d9d9] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212] h-4 w-4 rounded-[4px]"
                />
                <span className="text-[14px] text-[#555] group-hover:text-[#121212] transition-colors">
                  {seriesOption.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Grade */}
        <FilterSection title="Grade">
          <div className="space-y-3">
            {gradeOptions.map((gradeOption) => (
              <label key={gradeOption.value} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedGrades.includes(gradeOption.value)}
                  onCheckedChange={() => handleGradeToggle(gradeOption.value)}
                  className="border-[#d9d9d9] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212] h-4 w-4 rounded-[4px]"
                />
                <span className="text-[14px] text-[#555] group-hover:text-[#121212] transition-colors">
                  {gradeOption.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Year */}
        <FilterSection title="Year">
          <div className="flex gap-3 mt-1">
            <Input
              placeholder="From"
              value={yearFrom}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              onChange={(event) => onYearFromChange(sanitizeYearInput(event.target.value))}
              className="bg-[#fefefe] border-[#d9d9d9] text-[14px] h-10 rounded-lg"
            />
            <Input
              placeholder="To"
              value={yearTo}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              onChange={(event) => onYearToChange(sanitizeYearInput(event.target.value))}
              className="bg-[#fefefe] border-[#d9d9d9] text-[14px] h-10 rounded-lg"
            />
          </div>
        </FilterSection>

        {/* Grading Company */}
        <FilterSection title="Grading Company">
          <div className="space-y-3">
            {gradingCompanyOptions.map((companyOption) => (
              <label key={companyOption.value} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedGradingCompanies.includes(companyOption.value)}
                  onCheckedChange={() => handleGradingCompanyToggle(companyOption.value)}
                  className="border-[#d9d9d9] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212] h-4 w-4 rounded-[4px]"
                />
                <span className="text-[14px] text-[#555] group-hover:text-[#121212] transition-colors">
                  {companyOption.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability">
          <div className="space-y-3 mt-1">
            <label className="flex items-center justify-between">
              <span className="text-[14px] text-[#555]">Available only</span>
              <Switch
                checked={availableOnly}
                onCheckedChange={onAvailableOnlyChange}
                className="scale-90"
              />
            </label>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
};

export default TemplateFilterSidebar;
