import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire up to newsletter provider
  };

  return (
    <section
      id="newsletter"
      className="relative bg-[#fefefe] overflow-hidden scroll-mt-24"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-10 top-1/2 -translate-y-1/2 font-display font-medium text-[#121212]/[0.04] text-[340px] lg:text-[440px] leading-none tracking-tighter"
      >
        ₿
      </span>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-[87px] py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col">
            <h2 className="font-display font-medium text-[40px] md:text-[52px] lg:text-[60px] leading-[1.05] tracking-tight text-[#121212] mb-8">
              Collector trends
              <br />
              <em className="italic font-serif font-normal text-[#121212]/75">
                &amp; quiet drops,
              </em>
              <br />
              delivered weekly.
            </h2>

            <p className="font-['Inter'] text-[14px] md:text-[15px] leading-relaxed text-[#121212]/65 max-w-[44ch]">
              Curated picks, auction results, and field notes from the Bitcoin
              collectibles world, written by the people who hunt them.
            </p>
          </div>

          <div className="flex flex-col">
            <p className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55 mb-4">
              Subscribe
            </p>

            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@address.com"
                aria-label="Email address"
                className="w-full bg-transparent border-0 border-b border-[#121212]/20 pb-3 pr-10 font-['Inter'] text-[15px] text-[#121212] placeholder:text-[#121212]/40 outline-none focus:border-[#121212] transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-0 bottom-3 text-[#121212] hover:translate-x-0.5 transition-transform"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </form>

            <p className="mt-4 font-['Inter'] text-[10px] tracking-[0.22em] uppercase text-[#121212]/55 leading-relaxed">
              By subscribing you agree to our{" "}
              <a
                className="cursor-pointer underline underline-offset-4 decoration-[#121212]/30 hover:decoration-[#121212] text-[#121212]/75"
              >
                Terms
              </a>{" "}
              &amp;{" "}
              <a
                className="cursor-pointer underline underline-offset-4 decoration-[#121212]/30 hover:decoration-[#121212] text-[#121212]/75"
              >
                Privacy
              </a>
              . Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
