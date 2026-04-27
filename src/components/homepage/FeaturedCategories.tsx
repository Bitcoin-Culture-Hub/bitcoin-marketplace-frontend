import { Link } from "react-router-dom";
import { useTemplates } from "@/hooks/medusa/useTemplates";
import tradingCardCategory from "@/assets/feature1.webp";
import physicalBitcoinCategory from "@/assets/feature2.webp";
import fineArtCategory from "@/assets/feature3.webp";
import digitalArtCategory from "@/assets/feature4.webp";

type Category = {
  label: string;
  image: string;
  href?: string;
  comingSoon?: boolean;
  count?: string;
  countLabel?: string;
};

const FeaturedCategories = () => {
  const { data: templates = [] } = useTemplates({ fetchAll: true });

  const tradingCardCount = templates.length;
  const formattedCount =
    tradingCardCount > 0 ? tradingCardCount.toLocaleString() : null;

  const categories: Category[] = [
    {
      label: "Trading Cards",
      image: tradingCardCategory,
      href: "/marketplace",
      count: formattedCount ?? "—",
      countLabel: "Cards",
    },
    {
      label: "Physical Bitcoin",
      image: physicalBitcoinCategory,
      comingSoon: true,
    },
    {
      label: "Fine Art",
      image: fineArtCategory,
      comingSoon: true,
    },
    {
      label: "Digital Art",
      image: digitalArtCategory,
      comingSoon: true,
    },
  ];

  return (
    <section className="bg-[#fefefe]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[87px] py-16 lg:py-24">
        <h2 className="font-display font-medium text-[40px] md:text-[50px] tracking-[0.02em] uppercase text-[#121212] mb-8">
          Featured Categories
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            const isComingSoon = !!cat.comingSoon;

            const content = (
              <div
                className={[
                  "group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#121212] shadow-[0_1px_2px_rgba(18,18,18,0.06)] transition-shadow",
                  isComingSoon
                    ? ""
                    : "hover:shadow-[0_8px_24px_rgba(18,18,18,0.12)]",
                ].join(" ")}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  draggable={false}
                  className={[
                    "absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out",
                    isComingSoon
                      ? "opacity-80 grayscale-[60%] brightness-90"
                      : "opacity-95 group-hover:scale-[1.06]",
                  ].join(" ")}
                />

                {isComingSoon && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#121212]/35 mix-blend-multiply pointer-events-none"
                  />
                )}

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                  <h3
                    className={[
                      "font-display text-[20px] md:text-[22px] leading-tight tracking-tight mb-1.5",
                      isComingSoon ? "text-white/85" : "text-white",
                    ].join(" ")}
                  >
                    {cat.label}
                  </h3>
                  <p
                    className={[
                      "font-['Inter'] text-[11px] tracking-[0.22em] uppercase",
                      isComingSoon ? "text-white/80" : "text-white/70",
                    ].join(" ")}
                  >
                    {isComingSoon ? (
                      "Coming Soon"
                    ) : (
                      <>
                        {cat.count}
                        {cat.countLabel ? ` ${cat.countLabel}` : ""}
                      </>
                    )}
                  </p>
                </div>
              </div>
            );

            if (cat.href && !cat.comingSoon) {
              return (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]/40 rounded-2xl"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={cat.label}
                aria-disabled={cat.comingSoon ? "true" : undefined}
                className={cat.comingSoon ? "cursor-default" : ""}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
