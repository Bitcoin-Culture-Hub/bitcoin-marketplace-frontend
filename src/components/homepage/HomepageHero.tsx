import { Search } from "lucide-react";
import warriorImage from "@/assets/Warrior.png";

const HomepageHero = () => {
  return (
    <section className="bg-[#fefefe]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[87px] py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left: Copy + Search */}
          <div className="flex flex-col">
            <h1 className="font-display font-medium text-[44px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-tight text-[#121212] mb-6">
              The World&apos;s
              <br />
              Bitcoin Collectibles
              <br />
              Marketplace
            </h1>

            <p className="font-['Inter'] text-[12px] tracking-[0.24em] uppercase text-[#121212]/60 mb-8">
              One Search · 10,000+ Collectibles · 12+ Niches · Global
            </p>

            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="relative max-w-[560px]"
            >
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#121212]/50"
                strokeWidth={1.75}
              />
              <input
                type="text"
                placeholder="Search item, collection or account"
                className="w-full h-12 pl-12 pr-5 bg-white border border-[#121212]/15 rounded-full font-['Inter'] text-[13px] text-[#121212] placeholder:text-[#121212]/50 outline-none focus:border-[#121212]/50 transition-colors shadow-[0_1px_2px_rgba(18,18,18,0.04)]"
              />
            </form>
          </div>

          {/* Right: Warrior illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <img
              src={warriorImage}
              alt="Bitcoin Samurai Warrior"
              className="w-full max-w-[460px] h-auto object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
