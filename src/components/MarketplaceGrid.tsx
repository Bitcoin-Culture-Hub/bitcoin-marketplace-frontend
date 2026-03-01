import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Grid3X3, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MarketplaceCard from "./MarketplaceCard";

import bitcoinCard1 from "@/assets/bitcoin-card-1.jpg";
import bitcoinCard2 from "@/assets/bitcoin-card-2.jpg";
import bitcoinCard3 from "@/assets/bitcoin-card-3.jpg";

const mockListings = [
  {
    id: "1",
    listingNumber: 1,
    title: "Satoshi Nakamoto Genesis Card",
    series: "Series 1 OPP",
    year: "2022",
    grade: "10",
    certification: "PSA",
    price: "$190,000",
    offersEnabled: true,
    image: bitcoinCard1,
  },
  {
    id: "2",
    listingNumber: 2,
    title: "Bitcoin Whitepaper Commemorative",
    series: "Commemorative",
    year: "2023",
    grade: "9.5",
    certification: "BGS",
    price: "$220,000",
    offersEnabled: true,
    image: bitcoinCard2,
  },
  {
    id: "3",
    listingNumber: 3,
    title: "Block 0 Genesis Block Card",
    series: "Series 1 OPP",
    year: "2022",
    grade: "10",
    certification: "TAG",
    price: "$60,000",
    offersEnabled: true,
    image: bitcoinCard3,
  },
  {
    id: "4",
    listingNumber: 4,
    title: "Hal Finney Tribute Card",
    series: "Series 2 OPP",
    year: "2023",
    grade: "10",
    certification: "PSA",
    price: "$50,000",
    offersEnabled: false,
    image: bitcoinCard1,
  },
  {
    id: "5",
    listingNumber: 5,
    title: "Lightning Network Launch Card",
    series: "Commemorative",
    year: "2023",
    grade: "9",
    certification: "BGS",
    price: "$42,000",
    offersEnabled: true,
    image: bitcoinCard2,
  },
  {
    id: "6",
    listingNumber: 6,
    title: "Bitcoin Pizza Day Commemorative",
    series: "Commemorative",
    year: "2022",
    grade: "9.5",
    certification: "PSA",
    price: "$90,000",
    offersEnabled: true,
    image: bitcoinCard3,
  },
  {
    id: "7",
    listingNumber: 7,
    title: "First Bitcoin Transaction Card",
    series: "Series 1 OPP",
    year: "2022",
    grade: "10",
    certification: "TAG",
    price: "$125,000",
    offersEnabled: true,
    image: bitcoinCard1,
  },
  {
    id: "8",
    listingNumber: 8,
    title: "Bitcoin ATH November 2021 Card",
    series: "Commemorative",
    year: "2023",
    grade: "10",
    certification: "PSA",
    price: "$85,000",
    offersEnabled: true,
    image: bitcoinCard2,
  },
  {
    id: "9",
    listingNumber: 9,
    title: "Silk Road Shutdown Commemorative",
    series: "Commemorative",
    year: "2024",
    grade: "9.5",
    certification: "BGS",
    price: "$175,000",
    offersEnabled: false,
    image: bitcoinCard3,
  },
  {
    id: "10",
    listingNumber: 10,
    title: "El Salvador Legal Tender Card",
    series: "Series 3 OPP",
    year: "2024",
    grade: "9.5",
    certification: "TAG",
    price: "$38,000",
    offersEnabled: true,
    image: bitcoinCard1,
  },
];

const MarketplaceGrid = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex-1 p-8">
      {/* Results Header - Administrative */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <span className="text-xs text-muted-foreground">
          <span className="text-foreground font-medium">{mockListings.length}</span> Cards
        </span>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3X3 className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 border-l border-border transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
          
          {/* Sort */}
          <Select defaultValue="recent">
            <SelectTrigger className="w-40 border-border bg-background h-8 text-xs rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Listed</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="grade">Grade: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mockListings.map((listing) => (
          <MarketplaceCard key={listing.id} {...listing} />
        ))}
      </div>
    </div>
  );
};

export default MarketplaceGrid;
