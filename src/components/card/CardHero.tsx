import { useState } from "react";

interface CardHeroProps {
  name: string;
  series: string;
  year: string;
  cardNumber: string;
  designNotes?: string;
  frontImage: string;
  backImage: string;
}

const CardHero = ({
  name,
  series,
  year,
  cardNumber,
  designNotes,
  frontImage,
  backImage,
}: CardHeroProps) => {
  const [showBack, setShowBack] = useState(false);

  return (
    <section className="grid lg:grid-cols-2 gap-10">
      {/* Left: Card Imagery */}
      <div className="space-y-3">
        <div className="aspect-[3/4] bg-muted border border-border overflow-hidden max-w-md">
          <img
            src={showBack ? backImage : frontImage}
            alt={showBack ? "Card back" : "Card front"}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Front/Back Toggle */}
        <div className="flex gap-2 max-w-md">
          <button
            onClick={() => setShowBack(false)}
            className={`flex-1 py-2 text-[10px] uppercase tracking-[0.12em] border transition-colors ${
              !showBack
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setShowBack(true)}
            className={`flex-1 py-2 text-[10px] uppercase tracking-[0.12em] border transition-colors ${
              showBack
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* Right: Card Identity */}
      <div className="space-y-6">
        {/* Card Name */}
        <h1 className="text-2xl lg:text-3xl font-display font-medium leading-tight text-foreground">
          {name}
        </h1>

        {/* Series / Year / Number */}
        <div className="space-y-1">
          <p className="text-base text-muted-foreground">{series}</p>
          <p className="text-sm text-muted-foreground font-mono">
            {year} · {cardNumber}
          </p>
        </div>

        {/* One-line descriptor */}
        {designNotes && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            {designNotes}
          </p>
        )}
      </div>
    </section>
  );
};

export default CardHero;
