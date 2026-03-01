import { useState } from "react";
import { X, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const grades = ["10", "9.5", "9", "8.5", "8", "7", "6"];
const gradingCompanies = ["PSA", "BGS", "SGC", "TAG"];

export type SortOption = "price-asc" | "grade-desc" | "newest";

interface CopiesTableFiltersProps {
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
  selectedGradingCompanies: string[];
  onGradingCompaniesChange: (companies: string[]) => void;
  buyNowOnly: boolean;
  onBuyNowOnlyChange: (value: boolean) => void;
  offersAccepted: boolean;
  onOffersAcceptedChange: (value: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
  onClearFilters: () => void;
}

const CopiesTableFilters = ({
  selectedGrades,
  onGradesChange,
  selectedGradingCompanies,
  onGradingCompaniesChange,
  buyNowOnly,
  onBuyNowOnlyChange,
  offersAccepted,
  onOffersAcceptedChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
  onClearFilters,
}: CopiesTableFiltersProps) => {
  const hasActiveFilters =
    selectedGrades.length > 0 ||
    selectedGradingCompanies.length > 0 ||
    buyNowOnly ||
    offersAccepted;

  const handleGradeToggle = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      onGradesChange(selectedGrades.filter((g) => g !== grade));
    } else {
      onGradesChange([...selectedGrades, grade]);
    }
  };

  const handleCompanyToggle = (company: string) => {
    if (selectedGradingCompanies.includes(company)) {
      onGradingCompaniesChange(selectedGradingCompanies.filter((c) => c !== company));
    } else {
      onGradingCompaniesChange([...selectedGradingCompanies, company]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Filters */}
        <div className="flex items-center gap-3">
          {/* Grade Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 rounded-none text-xs border-border ${
                  selectedGrades.length > 0 ? "bg-muted" : ""
                }`}
              >
                Grade
                {selectedGrades.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-foreground text-background text-[10px]">
                    {selectedGrades.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-3" align="start">
              <div className="space-y-2">
                {grades.map((grade) => (
                  <label
                    key={grade}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedGrades.includes(grade)}
                      onCheckedChange={() => handleGradeToggle(grade)}
                      className="h-3.5 w-3.5 rounded-none"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">
                      {grade}
                    </span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Grading Company Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 rounded-none text-xs border-border ${
                  selectedGradingCompanies.length > 0 ? "bg-muted" : ""
                }`}
              >
                Grader
                {selectedGradingCompanies.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-foreground text-background text-[10px]">
                    {selectedGradingCompanies.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-3" align="start">
              <div className="space-y-2">
                {gradingCompanies.map((company) => (
                  <label
                    key={company}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedGradingCompanies.includes(company)}
                      onCheckedChange={() => handleCompanyToggle(company)}
                      className="h-3.5 w-3.5 rounded-none"
                    />
                    <span className="text-sm font-mono text-muted-foreground group-hover:text-foreground">
                      {company}
                    </span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Toggles */}
          <div className="flex items-center gap-4 pl-2 border-l border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={offersAccepted}
                onCheckedChange={onOffersAcceptedChange}
                className="scale-75"
              />
              <span className="text-xs text-muted-foreground">Offers accepted</span>
            </label>
          </div>
        </div>

        {/* Right: Sort */}
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-36 h-8 text-xs rounded-none border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Lowest price</SelectItem>
              <SelectItem value="grade-desc">Highest grade</SelectItem>
              <SelectItem value="newest">Newest listed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results + Clear */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredCount}</span>{" "}
          {filteredCount === 1 ? "copy" : "copies"}
          {filteredCount !== totalCount && ` of ${totalCount}`}
        </span>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default CopiesTableFilters;
