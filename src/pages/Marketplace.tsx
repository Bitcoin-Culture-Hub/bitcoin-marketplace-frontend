import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import TemplateFilterSidebar from "@/components/marketplace/TemplateFilterSidebar";
import TemplateGrid from "@/components/marketplace/TemplateGrid";

const Marketplace = () => {
  // Filter state
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedGradingCompanies, setSelectedGradingCompanies] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(true);

  const handleReset = useCallback(() => {
    setSelectedSeries([]);
    setSelectedGradingCompanies([]);
    setSelectedGrades([]);
    setAvailableOnly(true);
  }, []);

  const handleRemoveFilter = useCallback((type: string, value: string) => {
    switch (type) {
      case "series":
        setSelectedSeries((prev) => prev.filter((s) => s !== value));
        break;
      case "grading":
        setSelectedGradingCompanies((prev) => prev.filter((c) => c !== value));
        break;
      case "grade":
        setSelectedGrades((prev) => prev.filter((g) => `Grade ${g}` !== value && g !== value));
        break;
      case "availability":
        setAvailableOnly(false);
        break;
    }
  }, []);

  const handleClearAllFilters = useCallback(() => {
    handleReset();
  }, [handleReset]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page Title Bar */}
      <div className="border-b border-border bg-background">
        <div className="px-6 py-4">
          <h1 className="text-lg font-display font-medium text-foreground">
            Marketplace
          </h1>
        </div>
      </div>

      {/* Sidebar + Grid */}
      <div className="flex flex-1">
        <TemplateFilterSidebar
          selectedSeries={selectedSeries}
          onSeriesChange={setSelectedSeries}
          selectedGradingCompanies={selectedGradingCompanies}
          onGradingCompaniesChange={setSelectedGradingCompanies}
          selectedGrades={selectedGrades}
          onGradesChange={setSelectedGrades}
          availableOnly={availableOnly}
          onAvailableOnlyChange={setAvailableOnly}
          onReset={handleReset}
        />
        <TemplateGrid
          selectedSeries={selectedSeries}
          selectedGradingCompanies={selectedGradingCompanies}
          selectedGrades={selectedGrades}
          availableOnly={availableOnly}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
        />
      </div>
    </div>
  );
};

export default Marketplace;
