import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import EmailVerification from "@/components/auth/EmailVerification";
import ForgotPassword from "@/components/auth/ForgotPassword";
import loginGradient from "@/assets/login-gradient.webp";

type AuthTab = "login" | "create";
type AuthStep = "form" | "verify" | "forgot";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as any)?.from || "/inventory";
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>("create");
  const [step, setStep] = useState<AuthStep>("form");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const passwordValid = password.length >= 8;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast({
      title: "Code sent",
      description: "Check your email for the new code.",
    });
  };

  const isCreate = activeTab === "create";
  const heading = isCreate ? "Create account" : "Welcome back";
  const subheading = isCreate
    ? "Please enter your details to login"
    : "Enter your credentials to continue";

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Panel — Full-height gradient + headline */}
      <div className="w-full lg:w-1/2 p-3 lg:p-4">
        <div className="relative w-full h-full min-h-[280px] flex flex-col justify-end overflow-hidden rounded-2xl lg:rounded-3xl">
        <img
          src={loginGradient}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-drift pointer-events-none"
        />

        <div className="relative z-10 p-8 lg:p-12 xl:p-16 mt-auto">
          <div className="w-11 h-11 rounded-xl border-[2.5px] border-white flex items-center justify-center mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 0Q12.5 10.5 24 12Q12.5 13.5 12 24Q11.5 13.5 0 12Q11.5 10.5 12 0Z" />
            </svg>
          </div>
          <h2 className="text-white text-[1.75rem] lg:text-[2.25rem] xl:text-[3.8rem] font-bold leading-[1.15] mb-3">
            A private registry<br />
            for graded Bitcoin<br />
            trading cards
          </h2>
          <p className="text-white/80 text-sm lg:text-base leading-relaxed">
            Catalog your collection, verify listings, trade with confidence.
          </p>
        </div>
        </div>
      </div>

      {/* Right Panel — Auth Form on white */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-10 lg:py-8">
        <div className="w-full max-w-[400px]">
            {step === "form" && (
              <>
                {/* Avatar */}
                <div className="flex justify-center mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#f5f5f5] border border-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-500">
                      {email ? email[0].toUpperCase() : "A"}
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <h1 className="text-center text-4xl font-bold text-gray-900 mb-1">
                  {heading}
                </h1>
                <p className="text-center text-sl text-gray-500 mb-8">
                  {subheading}
                </p>

                {isCreate ? (
                  <form onSubmit={handleCreate} className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                            setGeneralError("");
                          }}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus:border-btc-orange focus:ring-btc-orange/20 ${
                            emailError ? "border-destructive" : ""
                          }`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      {emailError && (
                        <p className="text-xs text-destructive mt-1.5">{emailError}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
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
                          className={`pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus:border-btc-orange focus:ring-btc-orange/20 ${
                            passwordError ? "border-destructive" : ""
                          }`}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                          ) : (
                            <Eye className="h-4 w-4" strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                      {(passwordFocused || password.length > 0) && (
                        <div className="mt-2 flex items-center gap-2">
                          <CheckCircle
                            className={`h-3 w-3 ${passwordValid ? "text-green-500" : "text-gray-300"}`}
                            strokeWidth={2}
                          />
                          <span className={`text-[11px] ${passwordValid ? "text-green-600" : "text-gray-400"}`}>
                            8+ characters
                          </span>
                        </div>
                      )}
                      {passwordError && (
                        <p className="text-xs text-destructive mt-1.5">{passwordError}</p>
                      )}
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <Checkbox
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => {
                          setAgreedToTerms(checked === true);
                          setGeneralError("");
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-btc-orange data-[state=checked]:border-btc-orange"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        I agree to the{" "}
                        <Link to="/terms" className="text-btc-orange hover:underline" onClick={(e) => e.stopPropagation()}>
                          Terms
                        </Link>
                        {" & "}
                        <Link to="/privacy" className="text-btc-orange hover:underline" onClick={(e) => e.stopPropagation()}>
                          Privacy
                        </Link>
                      </span>
                    </label>

                    {generalError && (
                      <p className="text-xs text-destructive text-center bg-destructive/10 py-2 px-3 rounded-lg">
                        {generalError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || !isCreateValid}
                      className="w-full h-11 bg-btc-orange hover:bg-btc-orange/90 text-white font-semibold text-sm rounded-xl"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create account"
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-gray-400">Or</span>
                      </div>
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <p className="text-sm text-center text-gray-500 pt-2">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("login");
                          setGeneralError("");
                        }}
                        className="text-btc-orange font-semibold border border-btc-orange rounded-full px-3 py-0.5 text-xs hover:bg-btc-orange/5 transition-colors"
                      >
                        Login
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                            setGeneralError("");
                          }}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus:border-btc-orange focus:ring-btc-orange/20 ${
                            emailError ? "border-destructive" : ""
                          }`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      {emailError && (
                        <p className="text-xs text-destructive mt-1.5">{emailError}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                            setGeneralError("");
                          }}
                          className="pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus:border-btc-orange focus:ring-btc-orange/20"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                          ) : (
                            <Eye className="h-4 w-4" strokeWidth={1.5} />
                          )}
                        </button>
                      </div>
                    </div>

                    {generalError && (
                      <p className="text-xs text-destructive text-center bg-destructive/10 py-2 px-3 rounded-xl">
                        {generalError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading || !isLoginValid}
                      className="w-full h-11 bg-btc-orange hover:bg-btc-orange/90 text-white font-semibold text-sm rounded-xl"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Log in"
                      )}
                    </Button>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setStep("forgot")}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-gray-400">Or</span>
                      </div>
                    </div>

                    {/* Google */}
                    <button
                      type="button"
                      className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <p className="text-sm text-center text-gray-500 pt-2">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("create");
                          setGeneralError("");
                        }}
                        className="text-btc-orange font-semibold border border-btc-orange rounded-full px-3 py-0.5 text-xs hover:bg-btc-orange/5 transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}

            {step === "verify" && (
              <EmailVerification
                email={email}
                onVerified={handleVerificationComplete}
                onChangeEmail={() => setStep("form")}
                onResend={handleResendCode}
              />
            )}

            {step === "forgot" && (
              <ForgotPassword
                onBack={() => setStep("form")}
                onSuccess={() => setStep("form")}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;
