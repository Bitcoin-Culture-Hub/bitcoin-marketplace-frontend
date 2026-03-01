import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import Header from "@/components/layout/Header";
import TemplateImageGallery from "@/components/card/TemplateImageGallery";
import TemplateHeader from "@/components/card/TemplateHeader";
import MarketSummary from "@/components/card/MarketSummary";
import CopiesTable from "@/components/card/CopiesTable";
import { Button } from "@/components/ui/button";

import bitcoinCard1 from "@/assets/bitcoin-card-1.jpg";
import bitcoinCard2 from "@/assets/bitcoin-card-2.jpg";
import bitcoinCard3 from "@/assets/bitcoin-card-3.jpg";

// Mock CardTemplate data
const mockTemplate = {
  id: "template-001",
  name: "Satoshi Nakamoto Genesis Card",
  series: "Series 1 OPP",
  year: "2022",
  cardNumber: "#001",
  printRun: 1000,
  designNotes:
    "First edition commemorating Bitcoin's anonymous creator. This card from the Series 1 OPP collection features premium holographic printing and is part of a limited production run.",
  images: [bitcoinCard1, bitcoinCard2, bitcoinCard3],
};

// Mock listings with BTC pricing
const mockListings = [
  {
    id: "listing-001",
    sellerId: "premium-cards",
    sellerName: "Premium Cards Co",
    sellerVerified: true,
    grade: "10",
    gradingCompany: "PSA",
    certNumber: "87654321",
    priceBTC: 0.128,
    priceUSD: 12500,
    acceptsOffers: true,
    minOfferBTC: 0.1,
    shipsFromRegion: "USA",
    createdAt: new Date("2024-01-28"),
    slabPhotos: [bitcoinCard1, bitcoinCard2],
  },
  {
    id: "listing-002",
    sellerId: "btc-collectibles",
    sellerName: "BTC Collectibles",
    sellerVerified: true,
    grade: "10",
    gradingCompany: "BGS",
    certNumber: "12345678",
    priceBTC: 0.145,
    priceUSD: 14200,
    acceptsOffers: true,
    shipsFromRegion: "EU",
    createdAt: new Date("2024-01-20"),
    slabPhotos: [bitcoinCard2],
  },
  {
    id: "listing-003",
    sellerId: "rare-sats",
    sellerName: "RareSats Vault",
    sellerVerified: false,
    grade: "9.5",
    gradingCompany: "BGS",
    certNumber: "98765432",
    priceBTC: 0.1,
    priceUSD: 9800,
    acceptsOffers: false,
    shipsFromRegion: "USA",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "listing-004",
    sellerId: "genesis-grails",
    sellerName: "Genesis Grails",
    sellerVerified: true,
    grade: "10",
    gradingCompany: "SGC",
    certNumber: "55667788",
    priceBTC: 0.112,
    priceUSD: 11000,
    acceptsOffers: true,
    minOfferBTC: 0.09,
    shipsFromRegion: "USA",
    createdAt: new Date("2024-01-25"),
    slabPhotos: [bitcoinCard3],
  },
  {
    id: "listing-005",
    sellerId: "hodl-cards",
    sellerName: "HODL Cards",
    sellerVerified: false,
    grade: "9",
    gradingCompany: "PSA",
    certNumber: "11223344",
    priceBTC: 0.072,
    priceUSD: 7000,
    acceptsOffers: true,
    shipsFromRegion: "Asia",
    createdAt: new Date("2024-01-10"),
  },
];

// Mock sales history
const mockSalesHistory = [
  { id: "sale-001", priceBTC: 0.155, grade: "10", gradingCompany: "PSA", date: "Jan 15, 2024" },
  { id: "sale-002", priceBTC: 0.135, grade: "10", gradingCompany: "BGS", date: "Dec 28, 2023" },
  { id: "sale-003", priceBTC: 0.087, grade: "9", gradingCompany: "PSA", date: "Nov 12, 2023" },
];

const CardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Compute market summary metrics
  const marketMetrics = useMemo(() => {
    const activeListings = mockListings.filter((l) => l.priceBTC !== null || l.acceptsOffers);
    const pricedListings = mockListings.filter((l) => l.priceBTC !== null);
    const offersListings = mockListings.filter((l) => l.acceptsOffers);

    const floorBTC =
      pricedListings.length > 0
        ? Math.min(...pricedListings.map((l) => l.priceBTC!))
        : null;

    const topGrade = [...mockListings]
      .sort((a, b) => parseFloat(b.grade) - parseFloat(a.grade))[0]?.grade;

    return {
      floorPriceBTC: floorBTC,
      availableCount: activeListings.length,
      offersAcceptedCount: offersListings.length,
      topGrade,
    };
  }, []);

  const cardData = {
    name: mockTemplate.name,
    series: mockTemplate.series,
    year: mockTemplate.year,
    cardNumber: mockTemplate.cardNumber,
    frontImage: mockTemplate.images[0],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => navigate("/marketplace")}
              className="hover:text-foreground transition-colors"
            >
              Marketplace
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/marketplace")}
              className="hover:text-foreground transition-colors"
            >
              {mockTemplate.series}
            </button>
            <span>/</span>
            <span className="text-foreground truncate max-w-md">{mockTemplate.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Left Column - Template Media */}
          <div className="lg:col-span-5">
            <TemplateImageGallery images={mockTemplate.images} name={mockTemplate.name} />
          </div>

          {/* Right Column - Template Header + Market Summary */}
          <div className="lg:col-span-7 space-y-8">
            <TemplateHeader
              name={mockTemplate.name}
              series={mockTemplate.series}
              cardNumber={mockTemplate.cardNumber}
              year={mockTemplate.year}
              printRun={mockTemplate.printRun}
            />

            <div className="mt-6">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Market Information <span className="normal-case">(Coming Soon)</span>
              </h3>
              <div className="opacity-40 pointer-events-none select-none">
                <MarketSummary
                  floorPriceBTC={marketMetrics.floorPriceBTC}
                  availableCount={marketMetrics.availableCount}
                  offersAcceptedCount={marketMetrics.offersAcceptedCount}
                  topGrade={marketMetrics.topGrade}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copies Table Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-medium text-foreground">
              Available Copies <span className="text-sm font-normal text-muted-foreground">(Coming Soon)</span>
            </h2>
          </div>

          <div className="opacity-40 pointer-events-none select-none">
            <CopiesTable listings={mockListings} card={cardData} />
          </div>
        </section>

      </main>
    </div>
  );
};

export default CardPage;
