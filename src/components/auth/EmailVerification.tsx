import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onChangeEmail: () => void;
  onResend: () => Promise<void>;
}

const EmailVerification = ({
  email,
  onVerified,
  onChangeEmail,
  onResend,
}: EmailVerificationProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5 && newCode.every((digit) => digit !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setCode(newCode.slice(0, 6));
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  const handleVerify = async (codeString: string) => {
    setIsVerifying(true);
    setError("");

    // Simulate verification - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: accept any 6-digit code for demo
    if (codeString === "123456" || codeString.length === 6) {
      setIsVerified(true);
    } else {
      setError("Invalid code. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }

    setIsVerifying(false);
  };

  const handleResend = async () => {
    setIsResending(true);
    await onResend();
    setIsResending(false);
    setResendTimer(30);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Verified success state
  if (isVerified) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-7 w-7 text-accent" strokeWidth={1.5} />
        </div>

        <h2 className="text-lg font-display font-medium text-foreground mb-2">
          Email verified
        </h2>

        <p className="text-sm text-muted-foreground mb-8">
          Your collector identity is now verified.
        </p>

        <div className="space-y-3">
          <Button
            onClick={onVerified}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-medium text-xs uppercase tracking-[0.15em] rounded-none"
          >
            Finalize Account Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h2 className="text-lg font-display font-medium text-foreground mb-2 text-center">
        Verify your email
      </h2>

      <p className="text-sm text-muted-foreground mb-2 text-center">
        We sent a 6-digit code to{" "}
        <span className="text-foreground font-medium">{email}</span>
      </p>

      <p className="text-[11px] text-muted-foreground/70 mb-8 text-center">
        This protects your collector identity and is required to sell later.
      </p>

      {/* 6-digit code input */}
      <div className="flex justify-center gap-2 mb-4">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isVerifying}
            className={`w-11 h-12 text-center text-lg font-mono rounded-none border-border bg-background focus:border-foreground focus:ring-0 ${
              error ? "border-destructive" : ""
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive text-center mb-4">{error}</p>
      )}

      {/* Verify button */}
      <Button
        onClick={() => handleVerify(code.join(""))}
        disabled={isVerifying || code.some((d) => !d)}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-medium text-xs uppercase tracking-[0.15em] rounded-none mb-6"
      >
        {isVerifying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Verify"
        )}
      </Button>

      {/* Helper links */}
      <div className="space-y-3 text-center">
        <div>
          {resendTimer > 0 ? (
            <span className="text-[11px] text-muted-foreground">
              Resend code in {resendTimer}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>

        <button
          onClick={onChangeEmail}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Change email
        </button>

        <p className="text-[10px] text-muted-foreground/60 pt-2">
          Didn't get it? Check your spam or promotions folder.
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
