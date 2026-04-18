import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

const ForgotPassword = ({ onBack, onSuccess }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSent(true);
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Success state
  if (isSent) {
    return (
      <div className="py-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-7 w-7 text-accent" strokeWidth={1.5} />
          </div>

          <h2 className="text-lg font-display font-medium text-foreground mb-2">
            Check your email
          </h2>

          <p className="text-sm text-muted-foreground mb-2">
            We sent a reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>

          <p className="text-[11px] text-muted-foreground/70 mb-8">
            Click the link in the email to reset your password.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {isLoading ? "Sending..." : "Resend link"}
            </button>

            <div>
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <button
        onClick={onBack}
        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to login
      </button>

      <h2 className="text-lg font-display font-medium text-foreground mb-2">
        Reset your password
      </h2>

      <p className="text-sm text-muted-foreground mb-8">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-2.5 font-light">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`bg-background border-border h-11 focus:border-foreground focus:ring-0 rounded-xl text-sm ${
              error ? "border-destructive" : ""
            }`}
            placeholder="you@example.com"
          />
          {error && (
            <p className="text-xs text-destructive mt-2">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !email}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-medium text-xs uppercase tracking-[0.15em] rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
