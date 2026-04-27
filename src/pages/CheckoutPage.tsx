/**
 * CheckoutPage — collects buyer info and totals (UI mock).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TODO(route-protection): This page is NOT scoped to a specific listing.
 * ───────────────────────────────────────────────────────────────────────────
 *   Today `/checkout` only reads from `location.state` (pushed in by the
 *   "Buy Now" button on CardPage). Meaning:
 *     • Typing /checkout directly → renders with empty data ($0, no image).
 *     • Refreshing / opening in a new tab → state is lost, page breaks.
 *     • The client supplies `listing.priceUSD`, which the backend must
 *       NOT trust when it creates the order.
 *
 *   Fix (requires BOTH frontend + backend changes):
 *     1. Frontend: put the listing id in the URL, e.g.
 *          /checkout/:listingId   (or, once orders are created up-front,
 *          /orders/:orderId/checkout)
 *        and fetch the listing/order from the API instead of reading
 *        `location.state`.
 *     2. Backend: verify the listing is still available, that the
 *       current user is allowed to buy it, and use the server-side
 *       price — never the client-sent value.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Package } from "lucide-react";
import bitcoinIcon from "@/assets/bitcoin-icon.png";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type CheckoutTemplate = {
  id?: string;
  name: string;
  series?: string;
  year?: string;
  cardNumber?: string;
  images?: string[];
};

type CheckoutListing = {
  id?: string;
  sellerName?: string;
  sellerVerified?: boolean;
  grade?: string;
  gradingCompany?: string;
  certNumber?: string;
  priceUSD?: number | null;
};

type CheckoutLocationState = {
  template?: CheckoutTemplate;
  listing?: CheckoutListing;
};

// TODO(backend): Placeholder values — replace with server-driven totals.
//                `MARKETPLACE_FEE_RATE` should live in backend config
//                (same rate applied on the order server-side), and
//                `DEFAULT_SHIPPING_USD` should be returned per-listing
//                based on the seller's shipping profile.
const MARKETPLACE_FEE_RATE = 0.025;
const DEFAULT_SHIPPING_USD = 10.44;

const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const sellerInitial = (name?: string) =>
  (name?.trim()?.[0] ?? "S").toUpperCase();

type ShippingMethod = "delivery" | "pickup";
type PaymentMethod = "bitcoin" | "credit-card";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const state = (location.state ?? {}) as CheckoutLocationState;
  const template = state.template;
  const listing = state.listing;

  const [shipping, setShipping] = useState<ShippingMethod>("delivery");
  const [payment, setPayment] = useState<PaymentMethod>("bitcoin");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const itemPrice = listing?.priceUSD ?? 0;
  const marketplaceFee = useMemo(
    () => +(itemPrice * MARKETPLACE_FEE_RATE).toFixed(2),
    [itemPrice],
  );
  const shippingCost = shipping === "pickup" ? 0 : DEFAULT_SHIPPING_USD;
  const total = +(itemPrice + marketplaceFee + shippingCost).toFixed(2);

  const productImage = template?.images?.[0];
  const gradingBadge =
    listing?.gradingCompany && listing?.grade
      ? `${listing.gradingCompany} - ${listing.grade}`
      : listing?.grade;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFilled =
      form.firstName &&
      form.lastName &&
      form.email &&
      form.phone &&
      (shipping === "pickup" ||
        (form.address && form.city && form.zip && form.country));

    if (!requiredFilled) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before checking out.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    // TODO(backend): Replace with real order-creation API call:
    //   1. POST /store/orders (Medusa) with listingId + shipping info.
    //   2. Medusa calls BTCPay Server to open an invoice for the order.
    //   3. Navigate to /orders/:orderId/pay with just the orderId —
    //      PaymentCheckout will fetch the invoice by id.
    //   Also: the backend must recompute the total server-side; do NOT
    //   trust any price we send from here.
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);

    // TODO(route-protection): Once the backend flow exists, replace this
    //   with `navigate(\`/orders/${orderId}/pay\`)` (no state). Passing
    //   `total`, `template`, `listing` via location.state is what makes
    //   /payment unreachable on refresh / direct URL.
    navigate("/payment", {
      state: {
        template,
        listing,
        total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto px-6 py-10 mb-20 lg:py-14 w-full flex-1 flex flex-col"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-stretch flex-1 min-h-[640px]">
          {/* Left column — title + form sections */}
          <div className="flex flex-col gap-5 lg:gap-6 max-w-[590px]">
            {/* Title */}
            <h1 className="font-display font-bold text-gray-900 tracking-tight text-2xl md:text-3xl flex items-center gap-3">
              <ArrowLeft
                className="h-6 w-6 text-gray-900"
                onClick={() => navigate(-1)}
                role="button"
                aria-label="Go back"
              />
              Checkout
            </h1>

            {/* 1. Contact Information */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field
                  id="firstName"
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={setField("firstName")}
                  placeholder="John"
                />
                <Field
                  id="lastName"
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={setField("lastName")}
                  placeholder="Doe"
                />
                <Field
                  id="email"
                  type="email"
                  label="E-mail"
                  required
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="name@example.com"
                />
                <Field
                  id="phone"
                  type="tel"
                  label="Phone"
                  required
                  value={form.phone}
                  onChange={setField("phone")}
                  placeholder="(555) 123-4567"
                />
              </div>
            </section>

            {/* 2. Shipping Information */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                2. Shipping Information
              </h2>

              <div className="flex gap-3 mb-3">
                <ShippingOption
                  icon={<Package className="h-4 w-4" />}
                  label="Delivery"
                  active={shipping === "delivery"}
                  onClick={() => setShipping("delivery")}
                />
                <ShippingOption
                  icon={<MapPin className="h-4 w-4" />}
                  label="Pick up"
                  active={shipping === "pickup"}
                  onClick={() => setShipping("pickup")}
                />
              </div>

              {shipping === "delivery" && (
                <div className="space-y-3">
                  <Field
                    id="address"
                    label="Address"
                    required
                    value={form.address}
                    onChange={setField("address")}
                    placeholder="e.g., 123 Main St"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field
                      id="city"
                      label="City"
                      required
                      value={form.city}
                      onChange={setField("city")}
                      placeholder="e.g., New York"
                    />
                    <Field
                      id="zip"
                      label="Zip Code"
                      required
                      value={form.zip}
                      onChange={setField("zip")}
                      placeholder="e.g., 12345"
                    />
                    <Field
                      id="country"
                      label="Country"
                      required
                      value={form.country}
                      onChange={setField("country")}
                      placeholder="e.g., United States"
                    />
                  </div>
                </div>
              )}

              {shipping === "pickup" && (
                <p className="text-sm text-gray-500">
                  Pickup details will be coordinated with the seller after
                  payment is confirmed.
                </p>
              )}
            </section>

            {/* 3. Payment Method */}
            <section>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                3. Payment Method
              </h2>
              <div className="flex flex-wrap gap-3">
                <PaymentOption
                  icon={
                    <img
                      src={bitcoinIcon}
                      alt="Bitcoin"
                      className="h-7 w-7"
                    />
                  }
                  label="Bitcoin"
                  active={payment === "bitcoin"}
                  onClick={() => setPayment("bitcoin")}
                />
                <PaymentOption
                  icon={
                    <span className="flex h-8 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
                      <CreditCard className="h-4 w-4" />
                    </span>
                  }
                  label="Credit Card"
                  active={payment === "credit-card"}
                  onClick={() => setPayment("credit-card")}
                />
              </div>
            </section>
          </div>

          {/* Right column — order summary */}
          <aside className="flex">
            <div className="bg-white rounded-2xl p-5 shadow-[0_8px_32px_rgba(15,23,42,0.08)] flex flex-col w-full">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Order
              </h2>

              <div className="aspect-[3/4] w-full max-w-[130px] mx-auto rounded-xl overflow-hidden bg-card-image-bg flex items-center justify-center mb-3">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={template?.name ?? "Product"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </div>

              <h3 className="text-base font-display font-bold text-gray-900 leading-tight mb-2">
                {template?.name ?? "Selected listing"}
              </h3>

              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {template?.series && (
                  <Badge>{template.series}</Badge>
                )}
                {template?.year && <Badge>{template.year}</Badge>}
                {gradingBadge && <Badge>{gradingBadge}</Badge>}
                {listing?.certNumber && (
                  <span className="text-xs text-gray-400 ml-1">
                    #{listing.certNumber}
                  </span>
                )}
              </div>

              {listing?.sellerName && (
                <>
                  <p className="text-xs text-gray-500 mb-1.5">Seller</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-full bg-btc-orange text-white text-xs font-semibold flex items-center justify-center">
                      {sellerInitial(listing.sellerName)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {listing.sellerName}
                    </span>
                    {listing.sellerVerified && (
                      <span
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]"
                        aria-label="Verified seller"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </>
              )}

              <div className="border-t border-gray-100 pt-3 space-y-1.5 mb-3 mt-auto">
                <p className="text-sm font-semibold text-gray-900 mb-1.5">
                  Price Breakdown
                </p>
                <SummaryRow label="Item price" value={formatCurrency(itemPrice)} />
                <SummaryRow
                  label="Marketplace fee (2.5%)"
                  value={formatCurrency(marketplaceFee)}
                />
                <SummaryRow
                  label="Shipping rate"
                  value={
                    shipping === "pickup"
                      ? "Free"
                      : formatCurrency(shippingCost)
                  }
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mb-4">
                <span className="text-sm font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-display font-bold text-gray-900">
                  {formatCurrency(total)}
                </span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-btc-orange hover:bg-btc-orange/90 text-white font-medium text-sm shadow-none"
              >
                {submitting ? "Processing…" : "Checkout"}
              </Button>
            </div>
          </aside>
        </div>
      </form>

      <Footer variant="marketplace" />
    </div>
  );
};

// ─── Small presentational helpers ─────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({
  id,
  label,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: FieldProps) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-xs text-gray-500 font-medium">
      {label}
      {required && <span className="text-btc-orange ml-0.5">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-10 rounded-xl border-gray-400 bg-white text-sm focus-visible:ring-btc-orange"
      required={required}
    />
  </div>
);

interface ShippingOptionProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const ShippingOption = ({ icon, label, active, onClick }: ShippingOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "flex-1 md:flex-none md:min-w-[130px] h-10 px-4 rounded-2xl border text-sm font-medium transition-colors inline-flex items-center justify-center gap-2",
      active
        ? "border-btc-orange bg-btc-orange/10 text-btc-orange"
        : "border-gray-200 text-gray-600 hover:border-gray-300",
    ].join(" ")}
    aria-pressed={active}
  >
    {icon}
    {label}
  </button>
);

interface PaymentOptionProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const PaymentOption = ({ icon, label, active, onClick }: PaymentOptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "h-16 min-w-[110px] px-4 rounded-xl border-2 transition-colors inline-flex flex-col items-center justify-center gap-1 bg-white",
      active
        ? "border-btc-orange"
        : "border-gray-200 hover:border-gray-300",
    ].join(" ")}
    aria-pressed={active}
  >
    {icon}
    <span className="text-xs font-medium text-gray-800">{label}</span>
  </button>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center h-6 px-2 rounded-lg border border-gray-300 text-[11px] font-semibold text-gray-500">
    {children}
  </span>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export default CheckoutPage;
