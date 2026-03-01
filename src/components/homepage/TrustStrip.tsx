import { Bitcoin, Shield, Award } from "lucide-react";

const TrustStrip = () => {
  const trustPills = [
    {
      icon: Bitcoin,
      label: "Bitcoin-only",
    },
    {
      icon: Shield,
      label: "Escrow-backed offers",
    },
    {
      icon: Award,
      label: "Graded-only",
    },
  ];

  return (
    <section id="trust" className="bg-muted/50 border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Trust Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {trustPills.map((pill) => (
            <div
              key={pill.label}
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium"
            >
              <pill.icon className="h-4 w-4" strokeWidth={1.5} />
              {pill.label}
            </div>
          ))}
        </div>

        {/* Explanation */}
        <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto">
          Funds are locked before an offer is sent. Sellers must verify before listing or shipping. 
          Only graded collectibles are eligible.{" "}
          <a href="/terms#escrow" className="underline hover:text-foreground">
            Learn more
          </a>
        </p>
      </div>
    </section>
  );
};

export default TrustStrip;
