import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TemplateFilterSidebar from "@/components/marketplace/TemplateFilterSidebar";
import TemplateGrid from "@/components/marketplace/TemplateGrid";

const Marketplace = () => {
  // Search state (lifted for hero + grid)
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedGradingCompanies, setSelectedGradingCompanies] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleReset = useCallback(() => {
    setSelectedSeries([]);
    setSelectedGradingCompanies([]);
    setSelectedGrades([]);
    setAvailableOnly(false);
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
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      {/* Sidebar + Grid Section */}
      <section className="flex bg-[#fefefe]">
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
        <div className="flex-1 px-6 pb-20 max-w-[1052px]">
          <TemplateGrid
            selectedSeries={selectedSeries}
            selectedGradingCompanies={selectedGradingCompanies}
            selectedGrades={selectedGrades}
            availableOnly={availableOnly}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </section>

      <Footer variant="marketplace" />
    </div>
  );
};

export default Marketplace;
