import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardDesign {
  id: string;
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  thumbnail: string;
}

// Mock catalog - in production this comes from Lovable Cloud
const mockCatalog: CardDesign[] = [
  {
    id: "1",
    name: "Satoshi Nakamoto Genesis Card",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#001",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Hal Finney First Transaction",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#002",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Bitcoin Pizza Day",
    series: "Series 2 OPP",
    year: "2023",
    cardNumber: "#010",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "4",
    name: "The Genesis Block",
    series: "Commemorative",
    year: "2024",
    cardNumber: "#001",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Lightning Network Launch",
    series: "Series 3 OPP",
    year: "2024",
    cardNumber: "#015",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Bitcoin Whitepaper Anniversary",
    series: "Commemorative",
    year: "2023",
    cardNumber: "#008",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Block 100000",
    series: "Series 1 OPP",
    year: "2022",
    cardNumber: "#003",
    thumbnail: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Mt. Gox Collapse",
    series: "Series 2 OPP",
    year: "2023",
    cardNumber: "#011",
    thumbnail: "/placeholder.svg",
  },
];

// Extract unique years and series from catalog
const years = [...new Set(mockCatalog.map((c) => c.year))].sort((a, b) => b.localeCompare(a));

interface CardDesignSearchProps {
  onSelect: (card: CardDesign) => void;
}

const CardDesignSearch = ({ onSelect }: CardDesignSearchProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Get series options filtered by selected year
  const seriesOptions = useMemo(() => {
    const filtered = selectedYear !== "all"
      ? mockCatalog.filter((c) => c.year === selectedYear)
      : mockCatalog;
    return [...new Set(filtered.map((c) => c.series))].sort();
  }, [selectedYear]);

  // Reset series when year changes and series is no longer valid
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (year !== "all") {
      const validSeries = mockCatalog
        .filter((c) => c.year === year)
        .map((c) => c.series);
      if (selectedSeries !== "all" && !validSeries.includes(selectedSeries)) {
        setSelectedSeries("all");
      }
    }
  };

  // Filter results based on all criteria
  const results = useMemo(() => {
    let filtered = mockCatalog;

    if (selectedYear !== "all") {
      filtered = filtered.filter((c) => c.year === selectedYear);
    }

    if (selectedSeries !== "all") {
      filtered = filtered.filter((c) => c.series === selectedSeries);
    }

    if (query.length >= 1) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.cardNumber.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered.slice(0, 10);
  }, [selectedYear, selectedSeries, query]);

  const hasActiveFilters = selectedYear !== "all" || selectedSeries !== "all" || query.length >= 1;
  const showResults = hasActiveFilters;
  const showNoResults = hasActiveFilters && results.length === 0;

  return (
    <div className="space-y-6">
      {/* Filter Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Year
          </label>
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="bg-card border-border h-10">
              <SelectValue placeholder="Any year" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Any year</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
            Series
          </label>
          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger className="bg-card border-border h-10">
              <SelectValue placeholder="Any series" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Any series</SelectItem>
              {seriesOptions.map((series) => (
                <SelectItem key={series} value={series}>
                  {series}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
          Card Name or Number
        </label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Satoshi, Genesis, #001"
          className="bg-card border-border h-10"
        />
      </div>

      {/* Results */}
      {showResults && results.length > 0 && (
        <div className="space-y-3">
          <div className="border border-border divide-y divide-border">
            {results.map((card) => (
              <button
                key={card.id}
                onClick={() => onSelect(card)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="w-10 h-14 bg-muted border border-border flex-shrink-0">
                  <img
                    src={card.thumbnail}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{card.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {card.series} · {card.year} · {card.cardNumber}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-center text-muted-foreground">
            ✓ Canonical card records maintained by Bitcoin Trading Cards
          </p>
        </div>
      )}

      {showNoResults && (
        <div className="border border-border p-6 text-center">
          <p className="text-muted-foreground text-sm mb-3">No cards match your filters</p>
          <button className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
            Card not listed? → Request new design
          </button>
        </div>
      )}

      {!hasActiveFilters && (
        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border">
          Use filters above to find your card
        </p>
      )}
    </div>
  );
};

export default CardDesignSearch;
