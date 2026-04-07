import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye, EyeOff, Loader2, Shield, Award, Lock } from "lucide-react";
import EmailVerification from "@/components/auth/EmailVerification";
import ForgotPassword from "@/components/auth/ForgotPassword";
import WalletConnection from "@/components/auth/WalletConnection";
import AccountUnlocks from "@/components/auth/AccountUnlocks";
import Header from "@/components/layout/Header";

type AuthTab = "login" | "create";
type AuthStep = "form" | "verify" | "forgot";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from || "/inventory";
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>("create"); // Default to create for new users
  const [step, setStep] = useState<AuthStep>("form");
  
  // Form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Password validation
  const passwordValid = password.length >= 8;
  
  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const isLoginValid = email && password && validateEmail(email);
  const isCreateValid = email && password && passwordValid && agreedToTerms && validateEmail(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back", description: "You're now logged in." });
      navigate(from, { replace: true });
    } catch (err: any) {
      setGeneralError(err?.message || "Incorrect email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!passwordValid) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (!agreedToTerms) {
      setGeneralError("Please agree to the Terms & Privacy.");
      return;
    }

    setIsLoading(true);
    try {
      await register({ email, password, first_name: username || undefined });
      toast({ title: "Account created", description: "Complete your verification to start trading." });
      navigate("/verify");
    } catch (err: any) {
      setGeneralError(err?.message || "Could not create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = () => {
    toast({
      title: "Account created",
      description: "Welcome to Bitcoin Trading Cards.",
    });
    navigate("/verify");
  };

  const handleResendCode = async () => {
    // Simulate resend - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast({
      title: "Code sent",
      description: "Check your email for the new code.",
    });
  };

  const trustPoints = [
    { icon: Award, label: "Graded cards only" },
    { icon: Lock, label: "Escrow-backed offers" },
    { icon: Shield, label: "Verified storefronts for sellers" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header variant="light" />
      <div className="flex-1 flex flex-col lg:flex-row">
      {/* Left Panel - Identity & Invitation (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center px-8 py-16 lg:py-0 lg:px-16 xl:px-24">
        <div className="max-w-lg">
          {/* Eyebrow */}
          <span className="text-[11px] text-muted-foreground font-sans uppercase tracking-[0.2em] font-light">
            Bitcoin Trading Cards
          </span>

          {/* Primary headline */}
          <h1 className="text-3xl lg:text-[2.5rem] font-display font-normal leading-[1.2] mt-8 mb-6 text-foreground">
            Your collector identity, verified.
          </h1>

          {/* Subhead */}
          <p className="text-muted-foreground text-base leading-relaxed mb-12">
            Catalog your collection. List graded cards. Trade with escrow-backed certainty.
          </p>

          {/* Trust signals */}
          <div className="space-y-3.5 mb-12">
            {trustPoints.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-muted-foreground font-light">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Right Panel - Authentication Card (40%) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-8 py-16 lg:py-0 lg:px-12 xl:px-16 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border">
        <div className="w-full max-w-sm">
          {/* Auth Card */}
          <div className="bg-card border border-border shadow-sm">
            {step === "form" && (
              <>
                {/* Tab switcher */}
                <div className="flex border-b border-border">
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      setGeneralError("");
                    }}
                    className={`flex-1 py-4 text-[11px] uppercase tracking-[0.15em] transition-colors relative ${
                      activeTab === "login"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Log In
                    {activeTab === "login" && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("create");
                      setGeneralError("");
                    }}
                    className={`flex-1 py-4 text-[11px] uppercase tracking-[0.15em] transition-colors border-l border-border relative ${
                      activeTab === "create"
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Create Account
                    {activeTab === "create" && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-primary" />
                    )}
                  </button>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  {activeTab === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-5">
                        {/* Email */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-2.5 font-light">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                              setGeneralError("");
                            }}
                            className={`bg-background border-border h-11 focus:border-foreground focus:ring-0 rounded-none text-sm ${
                              emailError ? "border-destructive" : ""
                            }`}
                            placeholder="you@example.com"
                            required
                          />
                          {emailError && (
                            <p className="text-xs text-destructive mt-1.5">{emailError}</p>
                          )}
                        </div>

                        {/* Password */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-2.5 font-light">
                            Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                                setGeneralError("");
                              }}
                              className="bg-background border-border h-11 focus:border-foreground focus:ring-0 rounded-none text-sm pr-10"
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                              ) : (
                                <Eye className="h-4 w-4" strokeWidth={1.5} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* General Error */}
                      {generalError && (
                        <p className="text-xs text-destructive text-center bg-destructive/10 py-2 px-3 border border-destructive/20">
                          {generalError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading || !isLoginValid}
                        className="w-full h-11 bg-foreground hover:bg-foreground/90 text-background font-display font-medium text-xs uppercase tracking-[0.15em] rounded-none"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Log In"
                        )}
                      </Button>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setStep("forgot")}
                          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-light"
                        >
                          Forgot password?
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("create")}
                          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-light"
                        >
                          Create account
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleCreate} className="space-y-6">
                      <div className="space-y-5">
                        {/* Email */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-2.5 font-light">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                              setGeneralError("");
                            }}
                            className={`bg-background border-border h-11 focus:border-foreground focus:ring-0 rounded-none text-sm ${
                              emailError ? "border-destructive" : ""
                            }`}
                            placeholder="you@example.com"
                            required
                          />
                          {emailError && (
                            <p className="text-xs text-destructive mt-1.5">{emailError}</p>
                          )}
                        </div>

                        {/* Username (optional) */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-2.5 font-light">
                            Username
                            <span className="text-muted-foreground/50 ml-1.5 normal-case tracking-normal">(optional)</span>
                          </label>
                          <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                            className="bg-background border-border h-11 focus:border-foreground focus:ring-0 rounded-none text-sm"
                            placeholder="satoshi"
                            maxLength={20}
                          />
                        </div>

                        {/* Password */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-2.5 font-light">
                            Password
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                                setGeneralError("");
                              }}
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={() => setPasswordFocused(false)}
                              className={`bg-background border-border h-11 focus:border-foreground focus:ring-0 rounded-none text-sm pr-10 ${
                                passwordError ? "border-destructive" : ""
                              }`}
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                              ) : (
                                <Eye className="h-4 w-4" strokeWidth={1.5} />
                              )}
                            </button>
                          </div>
                          {/* Password requirements - show on focus */}
                          {(passwordFocused || password.length > 0) && (
                            <div className="mt-2 flex items-center gap-2">
                              <CheckCircle
                                className={`h-3 w-3 ${
                                  passwordValid ? "text-accent" : "text-muted-foreground/40"
                                }`}
                                strokeWidth={2}
                              />
                              <span
                                className={`text-[10px] ${
                                  passwordValid ? "text-accent" : "text-muted-foreground"
                                }`}
                              >
                                8+ characters
                              </span>
                            </div>
                          )}
                          {passwordError && (
                            <p className="text-xs text-destructive mt-1.5">{passwordError}</p>
                          )}
                        </div>

                        {/* Terms checkbox */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <Checkbox
                              checked={agreedToTerms}
                              onCheckedChange={(checked) => {
                                setAgreedToTerms(checked === true);
                                setGeneralError("");
                              }}
                              className="mt-0.5 h-4 w-4 rounded-none border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                              I agree to the{" "}
                              <Link
                                to="/terms"
                                className="underline underline-offset-2 hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Terms
                              </Link>
                              {" & "}
                              <Link
                                to="/privacy"
                                className="underline underline-offset-2 hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Privacy
                              </Link>
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* General Error */}
                      {generalError && (
                        <p className="text-xs text-destructive text-center bg-destructive/10 py-2 px-3 border border-destructive/20">
                          {generalError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading || !isCreateValid}
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-medium text-xs uppercase tracking-[0.15em] rounded-none"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Create Account"
                        )}
                      </Button>

                      <p className="text-[11px] text-center text-muted-foreground font-light pt-1">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Log in
                        </button>
                      </p>
                    </form>
                  )}
                </div>
              </>
            )}

            {step === "verify" && (
              <div className="p-8">
                <EmailVerification
                  email={email}
                  onVerified={handleVerificationComplete}
                  onChangeEmail={() => setStep("form")}
                  onResend={handleResendCode}
                />
              </div>
            )}

            {step === "forgot" && (
              <div className="p-8">
                <ForgotPassword
                  onBack={() => setStep("form")}
                  onSuccess={() => setStep("form")}
                />
              </div>
            )}
          </div>


          {/* Account unlocks section */}
          {step === "form" && activeTab === "create" && (
            <div className="mt-5">
              <AccountUnlocks />
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
