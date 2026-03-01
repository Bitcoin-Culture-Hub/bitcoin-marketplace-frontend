import bitcoinCard1 from "@/assets/bitcoin-card-1.jpg";
import bitcoinCard2 from "@/assets/bitcoin-card-2.jpg";
import bitcoinCard3 from "@/assets/bitcoin-card-3.jpg";

const MarketplaceHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-16 md:py-20">
          {/* Left content */}
          <div className="flex-1 max-w-xl">
            <span className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-medium mb-6">
              Live Registry
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-white leading-[1.1] mb-6">
              Bitcoin Trading Card Marketplace
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-md">
              Browse verified listings from collectors worldwide. All cards authenticated by industry-leading grading services.
            </p>
          </div>

          {/* Right side - Featured cards display */}
          <div className="hidden lg:flex items-end gap-4 pr-8">
            {/* Card 1 - tilted left */}
            <div className="transform -rotate-6 translate-y-4 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-36 h-52 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src={bitcoinCard1} 
                  alt="Featured Bitcoin Card" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Card 2 - center, elevated */}
            <div className="transform translate-y-0 hover:-translate-y-4 transition-transform duration-300 z-10">
              <div className="w-44 h-64 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/20">
                <img 
                  src={bitcoinCard2} 
                  alt="Featured Bitcoin Card" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Card 3 - tilted right */}
            <div className="transform rotate-6 translate-y-6 hover:-translate-y-0 transition-transform duration-300">
              <div className="w-36 h-52 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src={bitcoinCard3} 
                  alt="Featured Bitcoin Card" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
  );
};

export default MarketplaceHero;
