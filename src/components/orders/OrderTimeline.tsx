import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = 
  | "escrow_funded"
  | "seller_shipped"
  | "delivered"
  | "buyer_confirmed"
  | "escrow_released";

interface OrderTimelineProps {
  currentStep: TimelineStep;
  isDisputed?: boolean;
}

const steps: { key: TimelineStep; label: string }[] = [
  { key: "escrow_funded", label: "Escrow Funded" },
  { key: "seller_shipped", label: "Seller Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "buyer_confirmed", label: "Buyer Confirmed" },
  { key: "escrow_released", label: "Escrow Released" },
];

const OrderTimeline = ({ currentStep, isDisputed }: OrderTimelineProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Order Progress</h3>
      
      {isDisputed && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Dispute open — escrow frozen until resolution
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div 
                  className={cn(
                    "absolute h-0.5 w-full -translate-x-1/2",
                    index <= currentIndex ? "bg-emerald-500" : "bg-border"
                  )}
                  style={{ top: "10px" }}
                />
              )}
              
              {/* Step icon */}
              <div className="relative z-10 mb-2">
                {isCompleted ? (
                  <CheckCircle 
                    className={cn(
                      "h-5 w-5",
                      isCurrent && !isDisputed ? "text-emerald-500" : "text-emerald-500/60"
                    )} 
                  />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
              
              {/* Step label */}
              <span 
                className={cn(
                  "text-xs text-center",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
