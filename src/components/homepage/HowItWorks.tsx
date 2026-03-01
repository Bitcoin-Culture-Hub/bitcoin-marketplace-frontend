import { Search, Layers, MessageSquare, Truck, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "Browse templates",
      description: "One page per card. See supply + from-price.",
    },
    {
      number: 2,
      icon: Layers,
      title: "Pick a graded copy",
      description: "Compare grade, seller, and price.",
    },
    {
      number: 3,
      icon: MessageSquare,
      title: "Buy or make an offer",
      description: "Offers require escrow-backed funds.",
    },
    {
      number: 4,
      icon: Truck,
      title: "Seller ships",
      description: "Verified storefront sellers only.",
    },
    {
      number: 5,
      icon: CheckCircle,
      title: "Confirm receipt",
      description: "Escrow releases on confirmation.",
    },
  ];

  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-display text-xl font-medium text-foreground mb-10 text-center">
          How it works
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-muted border border-border mb-4">
                <step.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="text-xs text-muted-foreground font-mono mb-1">
                Step {step.number}
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
