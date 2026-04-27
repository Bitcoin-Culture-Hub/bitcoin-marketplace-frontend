import { ArrowUpRight } from "lucide-react";
import buyBitcoinSignImg from "@/assets/buy-bitcoin-sign.webp";
import indy500CarImg from "@/assets/indy-500-bitcoin-car.webp";
import bitbillsImg from "@/assets/bitbills.webp";

type Moment = {
  eyebrowLabel: string;
  eyebrowMeta: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  saleLabel?: string;
  priceHeadline: string;
  priceCaption: string;
  href?: string;
};

const moments: Moment[] = [
  {
    eyebrowLabel: "Record Sale",
    eyebrowMeta: "Sold April 24, 2024",
    title: "The Buy Bitcoin Sign",
    description:
      "Christian Langalis flashed two yellow words behind Janet Yellen on live TV in 2017. Years later the framed legal-pad page changed hands for 16 BTC, the highest price ever paid for a piece of Bitcoin protest memorabilia, gifted in part to Bitcoin developers and Tor.",
    image: buyBitcoinSignImg,
    imageAlt: "The original Buy Bitcoin sign held up on live television",
    priceHeadline: "16.00 BTC · ~$1.03M",
    priceCaption: "Scarce.City Auction",
    href: "#",
  },
  {
    eyebrowLabel: "Cultural Moment",
    eyebrowMeta: "Auction · June 5, 2021",
    title: "The Indy 500 Bitcoin Car",
    description:
      "Wearing the unmistakable orange ₿ livery, the No. 21 Ed Carpenter Racing entry became the first IndyCar fully sponsored in Bitcoin, a rolling billboard for the asset that turned a Sunday at the Brickyard into a permanent piece of bitcoin culture.",
    image: indy500CarImg,
    imageAlt:
      "The No. 21 Ed Carpenter Racing IndyCar wrapped in orange Bitcoin livery",
    priceHeadline: "Sponsored in BTC",
    priceCaption: "Miami Bitcoin Conference 2021",
    href: "#",
  },
  {
    eyebrowLabel: "Origin Artifact",
    eyebrowMeta: "May 2011",
    title: "Bitbills, The First Physical Bitcoin",
    description:
      "Before Casascius, four students embedded private keys inside laminated plastic cards, the very first attempt to make Bitcoin tangible. Only a handful of unredeemed Bitbills survive, making them the true zero-day collectible.",
    image: bitbillsImg,
    imageAlt:
      "A leather wallet holding ₿1, ₿5, ₿10 and ₿20 Bitbills laminated cards",
    priceHeadline: "₿1 / ₿5 / ₿10 / ₿20",
    priceCaption: "Internet, Worldwide",
    href: "#",
  },
];

const IconicMoments = () => {
  return (
    <section className="bg-[#fefefe]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[87px] py-20 lg:py-32">
        <div className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="font-display font-medium text-[40px] md:text-[50px] tracking-[0.02em] uppercase text-[#121212] mb-4">
            Iconic Moments
          </h2>
          <p className="font-['Inter'] text-[14px] md:text-[15px] leading-relaxed text-[#121212]/60">
            The sales, transactions, and cultural flashpoints that shaped
            Bitcoin history, and the artifacts that let collectors hold a piece
            of those days forever.
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:gap-0">
        {moments.map((moment, index) => {
          const reversed = index % 2 === 1;
          return (
          <article
            key={moment.title}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-stretch"
          >
            <div
              className={[
                "relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a]",
                reversed ? "lg:order-2" : "lg:order-1",
              ].join(" ")}
            >
              <img
                src={moment.image}
                alt={moment.imageAlt}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
              />
            </div>

            <div
              className={[
                "flex flex-col h-full lg:py-8",
                reversed
                  ? "lg:order-1 lg:pr-10 xl:pr-16"
                  : "lg:order-2 lg:pl-10 xl:pl-16",
              ].join(" ")}
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/70">
                  {moment.eyebrowLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-none w-10 bg-[#121212]/25"
                />
                <span className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/50">
                  {moment.eyebrowMeta}
                </span>
              </div>

              <h3 className="font-display font-medium text-[32px] md:text-[40px] leading-[1.1] tracking-tight text-[#121212] mb-5">
                {moment.title}
              </h3>

              <p className="font-['Inter'] text-[14px] md:text-[15px] leading-relaxed text-[#121212]/75 mb-10 max-w-[52ch]">
                {moment.description}
              </p>

              <div className="mt-auto border-t border-[#121212]/15 pt-6 flex items-end justify-between gap-6">
                <div>
                  <p className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55 mb-2">
                    {moment.saleLabel ?? "Sale"}
                  </p>
                  <p className="font-display text-[20px] md:text-[22px] tracking-tight text-[#121212] mb-1">
                    {moment.priceHeadline}
                  </p>
                  <p className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55">
                    {moment.priceCaption}
                  </p>
                </div>

                {moment.href && (
                  <a
                    href={moment.href}
                    className="group inline-flex items-center gap-2 font-['Inter'] text-[12px] tracking-[0.24em] uppercase text-[#121212] hover:text-[#121212]/70 transition-colors"
                  >
                    Read Story
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </a>
                )}
              </div>
            </div>
          </article>
          );
        })}
        </div>
      </div>
    </section>
  );
};

export default IconicMoments;
