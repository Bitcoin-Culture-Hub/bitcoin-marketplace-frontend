import { Search, X } from "lucide-react";
import warriorImg from "@/assets/Warrior.png";

interface MarketplaceHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const MarketplaceHero = ({ searchQuery, onSearchChange }: MarketplaceHeroProps) => {
  return (
    <div className="bg-[#fefefe] px-[96px] flex items-center min-h-[908px] relative overflow-hidden">
      <div className="flex flex-row items-center gap-[120px] max-w-[1248px] w-full mx-auto relative z-10">
        {/* Left side */}
        <div className="flex-1 max-w-[564px] flex flex-col">
          {/* Live Registry badge */}
          <span className="inline-flex items-center self-start border border-[#121212] rounded-[100px] px-4 py-2.5">
            <span className="font-sans font-medium text-[16px] text-[#121212] tracking-[0.014em]">
              Live Registry
            </span>
          </span>

          {/* Main heading */}
          <h1 className="mt-6 font-hero font-semibold text-[70px] leading-[88px] tracking-[0.014em] text-[#5C5C5C]">
            Discover, collect, sell & create your own{" "}
            <span className="font-bold text-[#121212]">collection</span>
          </h1>

          {/* Search bar */}
          <div className="mt-8 w-full max-w-[561px] h-[60px] bg-white/50 border-[1.5px] border-[rgba(175,175,175,0.5)] shadow-[0px_4px_16px_rgba(0,0,0,0.07)] rounded-[100px] flex items-center px-4 gap-3">
            <Search className="w-6 h-6 text-[rgba(18,18,18,0.6)] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search item, collection or account"
              className="flex-1 bg-transparent outline-none font-sans font-normal text-[16px] text-[#121212] placeholder:text-[rgba(18,18,18,0.6)] tracking-[0.014em]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="shrink-0 w-6 h-6 flex items-center justify-center text-[rgba(18,18,18,0.6)] hover:text-[#121212] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Right side - Warrior image with edge fade */}
        <div className="flex-1 relative flex items-center justify-center min-h-[908px]">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              maskImage:
                "radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 50% 45%, black 40%, transparent 75%)",
            }}
          >
            <img
              src={warriorImg}
              alt="Bitcoin Samurai Warrior"
              className="w-auto h-[900px] max-w-none object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
