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
            {series.map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedSeries.includes(s)}
                  onCheckedChange={() => handleSeriesToggle(s)}
                  className="border-[#d9d9d9] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212] h-4 w-4 rounded-[4px]"
                />
                <span className="text-[14px] text-[#555] group-hover:text-[#121212] transition-colors">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Grade */}
        <FilterSection title="Grade">
          <div className="space-y-3">
            {grades.map((grade) => (
              <label key={grade} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedGrades.includes(grade)}
                  onCheckedChange={() => handleGradeToggle(grade)}
                  className="border-[#d9d9d9] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212] h-4 w-4 rounded-[4px]"
                />
                <span className="text-[14px] text-[#555] group-hover:text-[#121212] transition-colors">
                  {grade}
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
              className="bg-[#fefefe] border-[#d9d9d9] text-[14px] h-10 rounded-lg"
            />
            <Input
              placeholder="To"
              className="bg-[#fefefe] border-[#d9d9d9] text-[14px] h-10 rounded-lg"
            />
          </div>
        </FilterSection>

        {/* Grading Company */}
        <FilterSection title="Grading Company">
          <div className="space-y-3">
            {gradingCompanies.map((company) => (
              <label key={company} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={selectedGradingCompanies.includes(company)}
                  onCheckedChange={() => handleGradingCompanyToggle(company)}
                  className="border-[#d9d9d9] data-[state=checked]:bg-[#121212] data-[state=checked]:border-[#121212] h-4 w-4 rounded-[4px]"
                />
                <span className="text-[14px] text-[#555] group-hover:text-[#121212] transition-colors">
                  {company}
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
