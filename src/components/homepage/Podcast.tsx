import { Mic, Gavel, Headphones, ArrowUpRight } from "lucide-react";
import podcastHostImg from "@/assets/podcast-kyle-knight.webp";

type Topic = {
  icon: typeof Mic;
  label: string;
};

const topics: Topic[] = [
  { icon: Mic, label: "Founder Interviews" },
  { icon: Gavel, label: "Auction Recaps" },
  { icon: Headphones, label: "Behind the Sale" },
];

const Podcast = () => {
  return (
    <section className="bg-[#fefefe]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[87px] py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col">
            <h2 className="font-display font-medium text-[44px] md:text-[56px] lg:text-[64px] leading-[1.02] tracking-tight text-[#121212]">
              The Podcast.
            </h2>
            <h3 className="font-display italic font-normal text-[44px] md:text-[56px] lg:text-[64px] leading-[1.02] tracking-tight text-[#121212] mb-8">
              Bitcoin Collectibles.
            </h3>

            <p className="font-['Inter'] text-[14px] md:text-[15px] leading-relaxed text-[#121212]/75 mb-8 max-w-[56ch]">
              The stories the market won&apos;t tell you. Sit in on real
              conversations with the auction houses, OG collectors, and
              historians shaping the culture of Bitcoin collectibles, one
              episode at a time.
            </p>

            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-10">
              {topics.map((topic) => (
                <li
                  key={topic.label}
                  className="flex items-center gap-2 font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/70"
                >
                  <topic.icon className="h-4 w-4" strokeWidth={1.5} />
                  {topic.label}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <div className="h-px w-full bg-[#121212]/15 mb-6" />
              <a
                href="#newsletter"
                onClick={(e) => {
                  e.preventDefault()
                  document
                    .getElementById("newsletter")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className="group inline-flex items-center gap-2 font-['Inter'] text-[12px] tracking-[0.24em] uppercase text-[#121212] hover:text-[#121212]/70 transition-colors"
              >
                Get Early Access
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden bg-[#0a0a0a]">
              <img
                src={podcastHostImg}
                alt="Kyle Knight, Founder of CLCT, on set during a podcast taping"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55">
                Your Host
              </span>
              <span className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55">
                Founder, CLCT
              </span>
            </div>
            <p className="mt-2 font-display text-[22px] md:text-[24px] tracking-tight text-[#121212]">
              Kyle Knight
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Podcast;
