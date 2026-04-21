import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import TemplateFilterSidebar from "@/components/marketplace/TemplateFilterSidebar";
import TemplateGrid from "@/components/marketplace/TemplateGrid";
import TrendingCollectors from "@/components/marketplace/TrendingCollectors";
import CreateAndSell from "@/components/marketplace/CreateAndSell";
import { useTemplates } from "@/hooks/medusa/useTemplates";
import {
  buildMarketplaceFilterOptions,
  parseMarketplaceYear,
  type MarketplaceFilterType,
} from "@/lib/marketplace-filters";

const RESULTS_SCROLL_MARGIN_PX = 116;

const Marketplace = () => {
  // Search state (lifted for hero + grid)
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedGradingCompanies, setSelectedGradingCompanies] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const hasMountedResultsRef = useRef(false);

  const { data: allTemplates = [], isLoading, isError } = useTemplates({
    fetchAll: true,
  });

  const effectiveYearFrom = parseMarketplaceYear(yearFrom);
  const effectiveYearTo = parseMarketplaceYear(yearTo);
  const filterOptions = useMemo(
    () => buildMarketplaceFilterOptions(allTemplates),
    [allTemplates]
  );
  const filterScrollKey = useMemo(
    () =>
      [
        [...selectedSeries].sort().join("|"),
        [...selectedGradingCompanies].sort().join("|"),
        [...selectedGrades].sort().join("|"),
        effectiveYearFrom ?? "",
        effectiveYearTo ?? "",
        availableOnly ? "1" : "0",
      ].join("::"),
    [
      availableOnly,
      effectiveYearFrom,
      effectiveYearTo,
      selectedGrades,
      selectedGradingCompanies,
      selectedSeries,
    ]
  );

  const handleReset = useCallback(() => {
    setSelectedSeries([]);
    setSelectedGradingCompanies([]);
    setSelectedGrades([]);
    setYearFrom("");
    setYearTo("");
    setAvailableOnly(false);
  }, []);

  const handleRemoveFilter = useCallback((type: MarketplaceFilterType, value: string) => {
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
      case "year":
        setYearFrom("");
        setYearTo("");
        break;
    }
  }, []);

  const handleClearAllFilters = useCallback(() => {
    handleReset();
  }, [handleReset]);

  useEffect(() => {
    if (!hasMountedResultsRef.current) {
      hasMountedResultsRef.current = true;
      return;
    }

    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [filterScrollKey]);

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      {/* Hero Section */}
      <MarketplaceHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Sidebar + Grid Section */}
      <section className="flex bg-[#fefefe]">
        <TemplateFilterSidebar
          selectedSeries={selectedSeries}
          onSeriesChange={setSelectedSeries}
          seriesOptions={filterOptions.seriesOptions}
          selectedGradingCompanies={selectedGradingCompanies}
          onGradingCompaniesChange={setSelectedGradingCompanies}
          gradingCompanyOptions={filterOptions.gradingCompanyOptions}
          selectedGrades={selectedGrades}
          onGradesChange={setSelectedGrades}
          gradeOptions={filterOptions.gradeOptions}
          yearFrom={yearFrom}
          onYearFromChange={setYearFrom}
          yearTo={yearTo}
          onYearToChange={setYearTo}
          availableOnly={availableOnly}
          onAvailableOnlyChange={setAvailableOnly}
          onReset={handleReset}
        />
        <div
          ref={resultsRef}
          className="flex-1 px-6 py-8 max-w-[1052px]"
          style={{ scrollMarginTop: `${RESULTS_SCROLL_MARGIN_PX}px` }}
        >
          <TemplateGrid
            templates={allTemplates}
            isLoading={isLoading}
            isError={isError}
            seriesOptions={filterOptions.seriesOptions}
            selectedSeries={selectedSeries}
            selectedGradingCompanies={selectedGradingCompanies}
            selectedGrades={selectedGrades}
            yearFrom={yearFrom}
            yearTo={yearTo}
            availableOnly={availableOnly}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAllFilters}
            searchQuery={searchQuery}
          />
        </div>
      </section>

      {/* Bottom Sections */}
      <TrendingCollectors />
      <CreateAndSell />
      <Footer variant="marketplace" />
    </div>
  );
};

export default Marketplace;
