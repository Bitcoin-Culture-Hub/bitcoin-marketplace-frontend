import { useState, useEffect } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useEmailVerificationActions } from "@/hooks/medusa/useEmailVerification";

interface EmailVerificationStepProps {
  email: string;
  isVerified: boolean;
  onVerified: () => void;
  onBack: () => void;
}

const EmailVerificationStep = ({
  email,
  isVerified,
  onVerified,
  onBack,
}: EmailVerificationStepProps) => {
  const { toast } = useToast();
  const { verifyCode, resendCode } = useEmailVerificationActions();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
  };

  // Already verified - auto-advance
  useEffect(() => {
    if (isVerified) {
      onVerified();
    }
  }, [isVerified, onVerified]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      const result = await verifyCode(code);
      toast({
        title: "Email verified",
        description: result.already_verified
          ? "Your email was already confirmed."
          : "Your email has been confirmed.",
      });
      onVerified();
    } catch (err: unknown) {
      toast({
        title: "Verification failed",
        description: getErrorMessage(
          err,
          "Could not verify that code. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendCode();
      setCode("");
      setResendCooldown(60);
      toast({
        title: "Code sent",
        description: `Verification code sent to ${result.email}`,
      });
    } catch (err: unknown) {
      toast({
        title: "Could not resend code",
        description: getErrorMessage(err, "Please try again in a moment."),
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm text-muted-foreground">Email already verified</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-display font-medium">Verify your email</h2>
        <p className="text-sm text-muted-foreground">
          This protects your collector identity and reduces fraud.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">
          Enter the 6-digit code sent to <strong className="text-foreground">{email}</strong>
        </p>

        <div className="flex justify-center">
          <InputOTP
            value={code}
            onChange={setCode}
            maxLength={6}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-xs text-muted-foreground">
              Resend code in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleVerify}
          disabled={code.length !== 6 || isVerifying}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90"
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </Button>
      </div>

      <p className="text-[10px] text-center text-muted-foreground">
        <button onClick={onBack} className="underline hover:text-foreground">
          Change email
        </button>
      </p>
    </div>
  );
};

export default EmailVerificationStep;
