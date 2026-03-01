import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepperProps {
  currentStep: number;
  steps: { id: string; label: string }[];
}

const CheckoutStepper = ({ currentStep, steps }: CheckoutStepperProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  isCompleted
                    ? "bg-green-100 text-green-700"
                    : isCurrent
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-sm hidden sm:inline",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 sm:w-12 h-px mx-2",
                  index < currentStep ? "bg-green-300" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
