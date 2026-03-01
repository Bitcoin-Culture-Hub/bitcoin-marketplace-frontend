import { useState, useRef, useEffect } from "react";
import { Search, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface RegistryCard {
  id: string;
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  lastSalePrice?: number;
  totalSales?: number;
  activeListings?: number;
}

interface OwnedCard extends RegistryCard {
  type: "owned";
  copyCount: number;
  copies?: {
    gradingCompany: string;
    grade: string;
  }[];
  lowestListedPrice?: number;
  hasListings?: boolean;
}

interface WishlistCard extends RegistryCard {
  type: "wishlist";
  desiredGrade?: string;
}

interface SearchResult {
  card: RegistryCard;
  relationship: "owned" | "wishlist" | "registry";
  copyCount?: number;
  copies?: { gradingCompany: string; grade: string }[];
  desiredGrade?: string;
  lowestListedPrice?: number;
  hasListings?: boolean;
}

interface UnifiedSearchBarProps {
  ownedCards: OwnedCard[];
  wishlistCards: WishlistCard[];
  onAddOwned: (data: { cardId: string; cardName: string; gradingCompany: string; grade: string; certNumber: string }) => void;
  onAddWishlist: (data: { cardId: string; cardName: string; desiredGrade?: string; note?: string }) => void;
  onScrollToCard?: (cardId: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

// Mock canonical registry
const mockRegistry: RegistryCard[] = [
  { id: "reg-1", name: "Satoshi Nakamoto Genesis Card", series: "Series 1 OPP", year: "2022", cardNumber: "#001", lastSalePrice: 12500, totalSales: 8, activeListings: 3 },
  { id: "reg-2", name: "Hal Finney First Transaction", series: "Series 1 OPP", year: "2022", cardNumber: "#002", lastSalePrice: 8200, totalSales: 5, activeListings: 2 },
  { id: "reg-3", name: "Bitcoin Pizza Day", series: "Series 2 OPP", year: "2023", cardNumber: "#010", lastSalePrice: 3500, totalSales: 12, activeListings: 5 },
  { id: "reg-4", name: "The Genesis Block", series: "Commemorative", year: "2024", cardNumber: "#001", lastSalePrice: 8900, totalSales: 3, activeListings: 1 },
  { id: "reg-5", name: "Lightning Network Launch", series: "Series 3 OPP", year: "2024", cardNumber: "#015", lastSalePrice: 2100, totalSales: 4, activeListings: 2 },
  { id: "reg-6", name: "The Whitepaper", series: "Series 1 OPP", year: "2022", cardNumber: "#003", lastSalePrice: 6800, totalSales: 7, activeListings: 0 },
  { id: "reg-7", name: "First Bitcoin ATM", series: "Series 2 OPP", year: "2023", cardNumber: "#020", lastSalePrice: 1800, totalSales: 6, activeListings: 3 },
  { id: "reg-8", name: "Mt. Gox Collapse", series: "Series 2 OPP", year: "2023", cardNumber: "#025", lastSalePrice: 950, totalSales: 2, activeListings: 1 },
  { id: "reg-9", name: "Bitcoin ETF Approval", series: "Series 3 OPP", year: "2024", cardNumber: "#001", lastSalePrice: 15000, totalSales: 2, activeListings: 4 },
  { id: "reg-10", name: "The Halvening 2024", series: "Commemorative", year: "2024", cardNumber: "#010", lastSalePrice: 4200, totalSales: 9, activeListings: 6 },
];

const gradeOptions = ["10", "9.5", "9", "8.5", "8", "7", "6"];

const UnifiedSearchBar = ({
  ownedCards,
  wishlistCards,
  onAddOwned,
  onAddWishlist,
  onScrollToCard,
  inputRef,
}: UnifiedSearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Add flow state
  const [addingCardId, setAddingCardId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState<"owned" | "wishlist" | null>(null);
  
  // Form state
  const [gradingCompany, setGradingCompany] = useState("");
  const [grade, setGrade] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [desiredGrade, setDesiredGrade] = useState("");
  const [wishlistNote, setWishlistNote] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const effectiveInputRef = inputRef || localInputRef;

  // Close results on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
        if (!addingCardId) {
          setIsFocused(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [addingCardId]);

  // Live search results
  const getSearchResults = (): { owned: SearchResult[]; wishlist: SearchResult[]; registry: SearchResult[] } => {
    if (!query.trim()) {
      return { owned: [], wishlist: [], registry: [] };
    }

    const q = query.toLowerCase();
    const ownedIds = new Set(ownedCards.map(c => c.id));
    const wishlistIds = new Set(wishlistCards.map(c => c.id));

    const matchesQuery = (card: RegistryCard) => {
      return (
        card.name.toLowerCase().includes(q) ||
        card.series.toLowerCase().includes(q) ||
        card.cardNumber.toLowerCase().includes(q) ||
        card.year.includes(q)
      );
    };

    // Search owned first
    const owned: SearchResult[] = ownedCards
      .filter(c => matchesQuery(c))
      .slice(0, 3)
      .map(c => ({
        card: c,
        relationship: "owned" as const,
        copyCount: c.copyCount,
        copies: c.copies,
        lowestListedPrice: c.lowestListedPrice,
        hasListings: c.hasListings,
      }));

    // Search wishlist
    const wishlist: SearchResult[] = wishlistCards
      .filter(c => matchesQuery(c))
      .slice(0, 3)
      .map(c => ({
        card: c,
        relationship: "wishlist" as const,
        desiredGrade: c.desiredGrade,
      }));

    // Search registry (exclude owned and wishlist)
    const registry: SearchResult[] = mockRegistry
      .filter(c => !ownedIds.has(c.id) && !wishlistIds.has(c.id) && matchesQuery(c))
      .slice(0, 5)
      .map(c => ({ card: c, relationship: "registry" as const }));

    return { owned, wishlist, registry };
  };

  const results = getSearchResults();
  const totalResults = results.owned.length + results.wishlist.length + results.registry.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
    setAddingCardId(null);
    setAddMode(null);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim()) {
      setShowResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowResults(false);
      setAddingCardId(null);
      setAddMode(null);
      effectiveInputRef.current?.blur();
    }
  };

  const resetFormState = () => {
    setGradingCompany("");
    setGrade("");
    setCertNumber("");
    setDesiredGrade("");
    setWishlistNote("");
  };

  const handleAddOwned = (card: RegistryCard) => {
    if (!gradingCompany || !grade || !certNumber) return;
    onAddOwned({
      cardId: card.id,
      cardName: card.name,
      gradingCompany,
      grade,
      certNumber,
    });
    setAddingCardId(null);
    setAddMode(null);
    setShowResults(false);
    setQuery("");
    resetFormState();
  };

  const handleAddWishlist = (card: RegistryCard) => {
    onAddWishlist({
      cardId: card.id,
      cardName: card.name,
      desiredGrade: desiredGrade || undefined,
      note: wishlistNote || undefined,
    });
    setAddingCardId(null);
    setAddMode(null);
    setShowResults(false);
    setQuery("");
    resetFormState();
  };

  const handleCancel = () => {
    setAddingCardId(null);
    setAddMode(null);
    resetFormState();
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.relationship === "owned" || result.relationship === "wishlist") {
      onScrollToCard?.(result.card.id);
      setShowResults(false);
      setQuery("");
    }
  };

  const formatOwnershipSummary = (result: SearchResult) => {
    if (!result.copies || result.copies.length === 0) return `${result.copyCount} copies`;
    
    const gradeCounts: Record<string, number> = {};
    result.copies.forEach(c => {
      const key = `${c.gradingCompany} ${c.grade}`;
      gradeCounts[key] = (gradeCounts[key] || 0) + 1;
    });
    
    return Object.entries(gradeCounts)
      .map(([gradeStr, count]) => `${gradeStr} (${count})`)
      .join(", ");
  };

  const renderResultItem = (result: SearchResult) => {
    const isAdding = addingCardId === result.card.id;
    const card = result.card;

    return (
      <div key={card.id} className="border-b border-border last:border-b-0">
        <div
          className={cn(
            "px-4 py-3 flex items-center gap-4",
            (result.relationship === "owned" || result.relationship === "wishlist") && "cursor-pointer hover:bg-muted/30"
          )}
          onClick={() => handleResultClick(result)}
        >
          {/* Card Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{card.name}</p>
              {result.relationship === "owned" && (
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                  Owned
                </Badge>
              )}
              {result.relationship === "wishlist" && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                  Wishlist
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {card.series} · {card.year} · {card.cardNumber}
            </p>
            {result.relationship === "owned" && result.copies && (
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                {formatOwnershipSummary(result)}
              </p>
            )}
            {result.relationship === "wishlist" && result.desiredGrade && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Seeking: {result.desiredGrade}
              </p>
            )}
          </div>

          {/* Action */}
          {result.relationship === "registry" && !isAdding && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setAddingCardId(card.id);
                setAddMode(null);
                resetFormState();
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          )}
          
          {(result.relationship === "owned" || result.relationship === "wishlist") && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {/* Inline Add Flow */}
        {isAdding && (
          <div className="px-4 py-4 bg-muted/20 border-t border-border/50">
            {addMode === null && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  How would you like to add this card?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => setAddMode("owned")}
                  >
                    I own this card
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => setAddMode("wishlist")}
                  >
                    I'm seeking this card
                  </Button>
                  <button
                    onClick={handleCancel}
                    className="text-xs text-muted-foreground hover:text-foreground px-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {addMode === "owned" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Grading Company
                    </label>
                    <Select value={gradingCompany} onValueChange={setGradingCompany}>
                      <SelectTrigger className="h-9 text-xs bg-background border-border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="PSA">PSA</SelectItem>
                        <SelectItem value="BGS">BGS</SelectItem>
                        <SelectItem value="SGC">SGC</SelectItem>
                        <SelectItem value="TAG">TAG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Grade
                    </label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger className="h-9 text-xs bg-background border-border">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {gradeOptions.map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Cert Number
                    </label>
                    <Input
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      placeholder="e.g. 12345678"
                      className="h-9 text-xs bg-background border-border"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Saved as private by default. You can list it anytime.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 bg-foreground text-background hover:bg-foreground/90 text-xs"
                    onClick={() => handleAddOwned(card)}
                    disabled={!gradingCompany || !grade || !certNumber}
                  >
                    Add to Collection
                  </Button>
                  <button
                    onClick={handleCancel}
                    className="text-xs text-muted-foreground hover:text-foreground px-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {addMode === "wishlist" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Desired Grade (optional)
                    </label>
                    <Select value={desiredGrade} onValueChange={setDesiredGrade}>
                      <SelectTrigger className="h-9 text-xs bg-background border-border">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="PSA 10">PSA 10</SelectItem>
                        <SelectItem value="PSA 9">PSA 9</SelectItem>
                        <SelectItem value="BGS 10">BGS 10</SelectItem>
                        <SelectItem value="BGS 9.5">BGS 9.5</SelectItem>
                        <SelectItem value="SGC 10">SGC 10</SelectItem>
                        <SelectItem value="TAG 10">TAG 10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Note (optional)
                    </label>
                    <Input
                      value={wishlistNote}
                      onChange={(e) => setWishlistNote(e.target.value.slice(0, 60))}
                      placeholder="e.g. Looking for clean corners"
                      className="h-9 text-xs bg-background border-border"
                      maxLength={60}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 bg-foreground text-background hover:bg-foreground/90 text-xs"
                    onClick={() => handleAddWishlist(card)}
                  >
                    Add to Wishlist
                  </Button>
                  <button
                    onClick={handleCancel}
                    className="text-xs text-muted-foreground hover:text-foreground px-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={effectiveInputRef as React.RefObject<HTMLInputElement>}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search your collection or the registry — e.g. Satoshi, Genesis, #001, PSA 10"
          className="h-12 pl-11 pr-4 bg-background border-border text-sm w-full"
        />
      </div>

      {/* Results Dropdown */}
      {showResults && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {totalResults === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No cards match "{query}"</p>
            </div>
          ) : (
            <>
              {/* Your Collection */}
              {results.owned.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border sticky top-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Your Collection
                    </p>
                  </div>
                  {results.owned.map(renderResultItem)}
                </div>
              )}

              {/* Your Wishlist */}
              {results.wishlist.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border sticky top-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Your Wishlist
                    </p>
                  </div>
                  {results.wishlist.map(renderResultItem)}
                </div>
              )}

              {/* Registry */}
              {results.registry.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border sticky top-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Not in your inventory
                    </p>
                  </div>
                  {results.registry.map(renderResultItem)}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedSearchBar;
