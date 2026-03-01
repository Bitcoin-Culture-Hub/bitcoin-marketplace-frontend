import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import Header from "@/components/layout/Header";
import VerificationStepper, { StepConfig } from "@/components/verification/VerificationStepper";
import EmailVerificationStep from "@/components/verification/EmailVerificationStep";
import AddressStep, { AddressData } from "@/components/verification/AddressStep";
import PayoutAddressStep from "@/components/verification/PayoutAddressStep";
import SellerTermsStep from "@/components/verification/SellerTermsStep";
import CreateStorefrontStep from "@/components/verification/CreateStorefrontStep";
import VerificationComplete from "@/components/verification/VerificationComplete";

type VerificationStep = "email" | "address" | "payout" | "terms" | "storefront" | "complete";

interface ReturnIntent {
  type: "publish_listing" | "accept_offer" | "ship_order" | "withdraw_payout";
  itemId?: string;
}

const VerifyStorefront = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get("returnTo");
  const itemId = searchParams.get("itemId");

  const [currentStep, setCurrentStep] = useState<VerificationStep>("email");
  const [stepNumber, setStepNumber] = useState(0);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    useAsReturn: true,
  });
  const [btcPayoutAddress, setBtcPayoutAddress] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [storefrontName, setStorefrontName] = useState("");

  const getReturnPath = (): string => {
    switch (returnTo) {
      case "publish_listing":
        return itemId ? `/listing/create?item=${itemId}` : "/inventory";
      case "accept_offer":
        return itemId ? `/offers/${itemId}` : "/storefront/manage";
      case "ship_order":
        return itemId ? `/orders/${itemId}` : "/storefront/manage";
      case "withdraw_payout":
        return "/storefront/manage";
      default:
        return "/storefront/manage";
    }
  };

  const steps: StepConfig[] = [
    {
      id: "email",
      label: "Email verification",
      completed: isEmailVerified,
      current: currentStep === "email",
    },
    {
      id: "address",
      label: "Shipping address",
      completed: !!addressData.addressLine1,
      current: currentStep === "address",
    },
    {
      id: "payout",
      label: "Payout address (optional)",
      completed: !!btcPayoutAddress,
      current: currentStep === "payout",
    },
    {
      id: "terms",
      label: "Seller terms",
      completed: termsAccepted,
      current: currentStep === "terms",
    },
    {
      id: "storefront",
      label: "Create storefront",
      completed: !!storefrontName,
      current: currentStep === "storefront",
    },
  ];

  const handleEmailVerified = () => {
    setIsEmailVerified(true);
    setCurrentStep("address");
    setStepNumber(1);
  };

  const handleAddressContinue = (data: AddressData) => {
    setAddressData(data);
    setCurrentStep("payout");
    setStepNumber(2);
  };

  const handlePayoutContinue = (address: string) => {
    setBtcPayoutAddress(address);
    setCurrentStep("terms");
    setStepNumber(3);
  };

  const handlePayoutSkip = () => {
    setCurrentStep("terms");
    setStepNumber(3);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setCurrentStep("storefront");
    setStepNumber(4);
  };

  const handleStorefrontContinue = (name: string) => {
    setStorefrontName(name);
    setCurrentStep("complete");
  };

  const handleComplete = () => {
    navigate(getReturnPath());
  };

  const handleBack = () => {
    switch (currentStep) {
      case "address":
        setCurrentStep("email");
        setStepNumber(0);
        break;
      case "payout":
        setCurrentStep("address");
        setStepNumber(1);
        break;
      case "terms":
        setCurrentStep("payout");
        setStepNumber(2);
        break;
      case "storefront":
        setCurrentStep("terms");
        setStepNumber(3);
        break;
    }
  };

  // Complete page
  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-md mx-auto px-6 py-12">
          <VerificationComplete
            onContinue={handleComplete}
            onDashboard={() => navigate("/storefront/manage")}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Purpose header */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-xl font-display font-medium text-foreground">
            Verify your account to buy and sell
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Verification protects buyers, reduces fraud, and ensures payouts go to the right collector.
          </p>
          <p className="text-[10px] text-muted-foreground">Takes about 2 minutes.</p>
        </div>

        {/* What it unlocks card */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-card border border-border p-4 space-y-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">
              What it unlocks
            </p>
            <ul className="space-y-2">
              {[
                "List cards publicly",
                "Accept escrow-backed offers",
                "Ship and receive payouts reliably",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stepper + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Step {stepNumber + 1} of {steps.length}
              </p>
              <VerificationStepper steps={steps} currentStep={stepNumber} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="max-w-md mx-auto">
              {currentStep === "email" && (
                <EmailVerificationStep
                  email="user@example.com"
                  isVerified={isEmailVerified}
                  onVerified={handleEmailVerified}
                  onBack={() => navigate(-1)}
                />
              )}

              {currentStep === "address" && (
                <AddressStep
                  initialData={addressData}
                  onContinue={handleAddressContinue}
                  onBack={handleBack}
                />
              )}

              {currentStep === "payout" && (
                <PayoutAddressStep
                  initialAddress={btcPayoutAddress}
                  onContinue={handlePayoutContinue}
                  onSkip={handlePayoutSkip}
                  onBack={handleBack}
                />
              )}

              {currentStep === "terms" && (
                <SellerTermsStep
                  onAccept={handleTermsAccept}
                  onBack={handleBack}
                />
              )}

              {currentStep === "storefront" && (
                <CreateStorefrontStep
                  initialName={storefrontName}
                  onContinue={handleStorefrontContinue}
                  onBack={handleBack}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyStorefront;
