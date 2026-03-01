import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepConfig {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
}

interface VerificationStepperProps {
  steps: StepConfig[];
  currentStep: number;
}

const VerificationStepper = ({ steps, currentStep }: VerificationStepperProps) => {
  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isCompleted = step.completed;
        const isCurrent = step.current;
        const isPast = index < currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 py-2 px-3 rounded-sm transition-colors",
              isCurrent && "bg-muted"
            )}
          >
            {/* Step indicator */}
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                isCompleted
                  ? "bg-green-100 text-green-700"
                  : isCurrent
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                index + 1
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "text-sm",
                isCurrent
                  ? "text-foreground font-medium"
                  : isCompleted
                  ? "text-muted-foreground"
                  : "text-muted-foreground/60"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VerificationStepper;
