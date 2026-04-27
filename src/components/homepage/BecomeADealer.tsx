import { ArrowUpRight } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Apply To Be A Dealer",
    description:
      "Submit your application. Our team independently vets your identity, inventory provenance, and grading history before you're approved.",
  },
  {
    number: "02",
    title: "Build Your Curated Storefront",
    description:
      "Once accepted, design a storefront that reflects your standards. Showcase verified pieces with full provenance so serious collectors know exactly who they're buying from.",
  },
  {
    number: "03",
    title: "List With The CLCT Standard",
    description:
      "Every listing carries the trust of a vetted dealer. Set your prices, publish when ready, and reach the world's most serious Bitcoin collectors, on a marketplace built for certainty.",
  },
];

const BecomeADealer = () => {
  return (
    <section className="bg-[#fefefe]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[87px] py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-stretch">
          <div className="flex flex-col">
            <h2 className="font-display font-medium text-[44px] md:text-[56px] lg:text-[60px] leading-[1.02] tracking-tight uppercase text-[#121212] mb-8">
              The World&apos;s
              <br />
              Most Serious{" "}
              <em className="italic font-serif font-normal">Bitcoin</em>
              <br />
              Collectors Buy
              <br />
              Here.
            </h2>

            <p className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55 mb-5">
              Are You a Dealer?
            </p>

            <p className="font-['Inter'] text-[14px] md:text-[15px] leading-relaxed text-[#121212]/75 mb-10 max-w-[44ch]">
              CLCT is invitation-only for sellers. Every dealer is
              independently vetted: identity, inventory provenance, and grading
              history, before a single listing goes live. This is what gives
              our buyers certainty that no other marketplace can offer.
            </p>

            <a
              href="#newsletter"
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById("newsletter")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
              className="group inline-flex items-center justify-center gap-3 self-start border border-[#121212] px-8 py-4 font-['Inter'] text-[12px] tracking-[0.24em] uppercase text-[#121212] hover:bg-[#121212] hover:text-white transition-colors"
            >
              Apply to Be a Dealer
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </a>

            <p className="mt-5 font-['Inter'] text-[11px] tracking-[0.24em] uppercase text-[#121212]/55">
              Currently Accepting Applications
            </p>
          </div>

          <div className="flex flex-col gap-4 h-full lg:justify-between">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className={[
                  "relative flex-1 border border-[#121212]/15 bg-white p-6 md:p-7 flex items-start gap-6 md:gap-8 transition-colors hover:border-[#121212]/35",
                  index === 0 ? "border-l-[3px] border-l-[#121212]" : "",
                ].join(" ")}
              >
                <div className="shrink-0 w-14 md:w-16">
                  <span className="font-display text-[40px] md:text-[48px] leading-none tracking-tight text-[#121212]/25">
                    {step.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-[17px] md:text-[18px] leading-tight tracking-tight text-[#121212] mb-2">
                    {step.title}
                  </h3>
                  <p className="font-['Inter'] text-[13px] md:text-[14px] leading-relaxed text-[#121212]/70">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeADealer;
