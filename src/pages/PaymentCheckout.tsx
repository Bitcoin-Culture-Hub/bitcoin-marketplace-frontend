/**
 * PaymentCheckout — Bitcoin settlement page (UI mock).
 *
 * BACKEND INTEGRATION PLAN — we use BTCPay Server for all BTC pricing,
 * invoice creation, and settlement detection.
 *
 * Nothing on this page currently talks to the backend. The real flow is:
 *
 *   1. CheckoutPage → POST /store/orders  (Medusa)
 *        • Creates the Medusa order and returns an `orderId`.
 *        • Medusa backend then calls BTCPay Server to open an invoice
 *          for that order (invoice amount = order total in USD).
 *
 *   2. BTCPay Server invoice response → feeds this page:
 *        • invoice.id                 → orderId used for polling
 *        • invoice.btcAddress         → replaces MOCK_BTC_ADDRESS
 *        • invoice.btcAmount          → replaces our client-side conversion
 *        • invoice.btcPaymentUri      → value for the <QRCodeSVG />
 *        • invoice.expirationTime     → drive a countdown / auto-cancel
 *        • invoice.paymentMethod      → "on-chain" vs "lightning" label
 *
 *   3. Settlement status (BTCPay Server is the source of truth):
 *        • Prefer websocket/SSE from BTCPay Server so we reflect the buyer
 *          sending funds in real time.
 *        • Fallback: long-poll GET /store/orders/:id/payment-status every
 *          5–10s (our Medusa backend proxies BTCPay Server status).
 *        • On "confirmed" → navigate to /orders/:orderId/success.
 *        • On "expired"  → toast + navigate back to /checkout.
 *
 * Every mocked value / stubbed handler in this file is tagged with a
 * `TODO(backend):` comment so we can grep for them when we do the wire-up.
 *
 * TODO(route-protection): This page is NOT scoped to a specific order.
 *   Today `/payment` only reads from `location.state`, which means:
 *     • Typing /payment directly → renders with empty data ($0, no image).
 *     • Refreshing / opening in a new tab → state is lost, page breaks.
 *     • The client supplies `priceUSD` / `total`, which the backend must
 *       NOT trust.
 *
 *   Fix (requires BOTH frontend + backend changes):
 *     1. Frontend: put the order id in the URL, e.g.
 *          /orders/:orderId/pay
 *        and fetch the order + BTCPay invoice by id from the API instead
 *        of reading `location.state`.
 *     2. Backend: authorize the request — only the buyer on that order
 *        may view its invoice. Use the server-side price, never the
 *        client-sent value.
 */

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, DollarSign, AlertTriangle, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import bitcoinIcon from "@/assets/bitcoin-icon.png";

// TODO(backend): Replace with the authoritative order shape returned by
//                GET /store/orders/:id (or the BTCPay invoice object).
//                Today we trust whatever CheckoutPage pushes via
//                location.state, which is a client-trust boundary and will
//                disappear once the order is fetched from the API.
type PaymentLocationState = {
  template?: {
    id?: string;
    name?: string;
    series?: string;
    year?: string;
    cardNumber?: string;
    images?: string[];
  };
  listing?: {
    id?: string;
    sellerName?: string;
    priceUSD?: number | null;
  };
  total?: number;
};

// TODO(backend): Replace with the invoice address returned by BTCPay
//                Server when the order is created. Each order/invoice
//                must use a fresh address — never reuse this literal.
const MOCK_BTC_ADDRESS = "bc1q9v5k8z7y3xw2r6t4u0p8m5n3j2h1g7f6d5s4a3";

// TODO(backend): Remove this hard-coded rate entirely. The BTC amount
//                should come straight from the BTCPay Server invoice
//                response so it's pinned at invoice-creation time
//                (with an expiry). We should NOT do usd/btc math on
//                the client.
const MOCK_USD_TO_BTC_RATE = 68000;

const formatCurrency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // TODO(backend): Replace `location.state` with a real fetch by orderId
  //                (read from useParams() or a search param), e.g.
  //                `const { data: order } = useOrder(orderId);`
  //                That query should return the BTCPay invoice fields too.
  const state = (location.state ?? {}) as PaymentLocationState;
  const totalUSD = state.total ?? state.listing?.priceUSD ?? 0;

  // TODO(backend): Delete this client-side conversion once the invoice
  //                from BTCPay is available — use `invoice.btcAmount`
  //                (already pinned, already rounded to sats).
  const btcAmount = useMemo(
    () => (totalUSD / MOCK_USD_TO_BTC_RATE).toFixed(4),
    [totalUSD],
  );

  // TODO(backend): Drive a countdown from `invoice.expirationTime`. When
  //                the invoice expires we should auto-toast + navigate
  //                back to /checkout so the user can retry.

  // TODO(backend): Subscribe to BTCPay settlement events (websocket/SSE)
  //                or poll GET /store/orders/:id/payment-status every
  //                ~8s. On "confirmed" navigate to the success page; on
  //                "failed"/"expired" show an error state.

  const [copied, setCopied] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [warningsDismissed, setWarningsDismissed] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_BTC_ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({
        title: "Could not copy address",
        description: "Please copy the address manually.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    // TODO(backend): This button is only shown for manual "I sent it"
    //                confirmation during dev. In production settlement
    //                detection should be fully automatic via BTCPay
    //                webhooks/websocket — this button + the simulated
    //                delay below should be removed entirely.
    await new Promise((r) => setTimeout(r, 800));
    setCompleting(false);
    toast({
      title: "Settlement is not complete and wired up yet",
      description:
        "This is a UI mock. Real BTC settlement will confirm ownership transfer once the backend is connected.",
    });
    // TODO(backend): On confirmed settlement → navigate to
    //                `/orders/${orderId}/success` (OrderSuccessPage).
  };

  const handleCancel = () => {
    // TODO(backend): If there's an open BTCPay invoice, also call
    //                DELETE /store/orders/:id (or mark it cancelled)
    //                before navigating away so the invoice doesn't stay
    //                dangling. Today this just pops the history stack.
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex flex-col">
      <Header variant="light" />

      <main className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-[520px]">
          {/* Heading */}
          <header className="text-center mb-3">
            <div className="flex items-center justify-center mb-2.5">
              <div className="h-9 w-9 rounded-full bg-white shadow-md flex items-center justify-center -mr-1.5 relative z-10">
                <DollarSign
                  className="h-4 w-4 text-gray-400"
                  strokeWidth={2.5}
                />
              </div>
              <div className="h-9 w-9 rounded-full bg-btc-orange flex items-center justify-center relative z-20 shadow-md">
                <img
                  src={bitcoinIcon}
                  alt="Bitcoin"
                  className="h-6 w-6"
                />
              </div>
            </div>
            <h1 className="font-display font-bold text-gray-900 tracking-tight text-2xl leading-tight">
              Continue Settlement in Bitcoin
            </h1>
            <p className="text-xs text-gray-500 mt-1.5">
              On-chain or Lightning (Automatically selected based on amount)
            </p>
            {/* TODO(backend): Use `invoice.btcAmount` from BTCPay. */}
            <p className="text-btc-orange font-semibold text-base mt-1.5">
              {btcAmount} BTC
            </p>
          </header>

          {/* QR + escrow card */}
          <div className="flex justify-center">
            <div className="bg-gray-50 rounded-2xl py-3 inline-flex flex-col items-center">
              {/*
                TODO(backend): The QR payload should be `invoice.btcPaymentUri`
                               returned by BTCPay (supports on-chain + BOLT11
                               Lightning). Hand-building a `bitcoin:` URI only
                               works for on-chain — Lightning invoices encode
                               totally differently.
              */}
              <QRCodeSVG
                value={`bitcoin:${MOCK_BTC_ADDRESS}?amount=${btcAmount}`}
                size={180}
                level="M"
                bgColor="#f9fafb"
                fgColor="#121212"
              />
              <p className="text-[11px] text-gray-500 text-center mt-3 max-w-[220px] leading-snug inline-flex items-center justify-center flex-wrap gap-1">
                Funds are held with escrow until settlement is confirmed on the
                Bitcoin network.
                <img
                  src={bitcoinIcon}
                  alt=""
                  aria-hidden="true"
                  className="inline-block h-3 w-3 ml-0.5 align-middle"
                />
              </p>
            </div>
          </div>

          {/* Wallet address pill */}
          <div className="mt-3">
            <div className="bg-[#fff3e6] rounded-2xl px-5 py-2.5 relative">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.12em] text-center mb-0.5">
                BTC Wallet Address
              </p>
              <div className="flex items-center justify-center gap-3">
                {/* TODO(backend): Render `invoice.btcAddress` from BTCPay. */}
                <code className="truncate text-xs text-gray-800 font-mono">
                  {MOCK_BTC_ADDRESS}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                aria-label="Copy address"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg inline-flex items-center justify-center text-btc-orange hover:bg-btc-orange/10 transition-colors"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            {/*
              TODO(backend): `totalUSD` should come from the fetched order,
                             not location.state. Also consider showing the
                             BTC amount here instead of USD once the invoice
                             is live (since that's the amount the user must
                             actually send on-chain).
            */}
            <p className="text-[11px] text-gray-500 text-center mt-1.5 px-4 leading-snug">
              Send exactly{" "}
              <span className="font-semibold text-gray-800">
                {formatCurrency(totalUSD)}
              </span>{" "}
              in BTC to this address. Sending any other asset will result in
              loss of payment.
            </p>
          </div>

          {/* Warnings list */}
          {!warningsDismissed && (
            <div className="bg-gray-100/80 rounded-xl px-4 py-2.5 mt-3 relative">
              <ul className="space-y-0.5 text-xs text-gray-600 pr-6">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-500 shrink-0" />
                  Settlement is final once confirmed
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-500 shrink-0" />
                  Ownership updates after confirmation
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-500 shrink-0" />
                  The action cannot be reversed
                </li>
              </ul>
              <button
                type="button"
                onClick={() => setWarningsDismissed(true)}
                aria-label="Dismiss warnings"
                className="absolute right-2 top-2 h-6 w-6 inline-flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Footer note */}
          <p className="text-[11px] text-gray-500 mt-2.5 flex items-center justify-center gap-1.5 text-center">
            <AlertTriangle className="h-3 w-3 text-gray-400 shrink-0" />
            Ownership will transfer to your inventory once settlement confirms
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center gap-2 mt-3">
            <Button
              type="button"
              onClick={handleComplete}
              disabled={completing}
              className="w-full h-10 rounded-xl bg-btc-orange hover:bg-btc-orange/90 text-white font-medium text-sm shadow-none"
            >
              {completing ? "Waiting for confirmation…" : "Complete Settlement"}
            </Button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs font-semibold text-gray-900 hover:text-gray-700 transition-colors mt-4 mb-24"
            >
              Cancel and return to listing
            </button>
          </div>
        </div>
      </main>

      <Footer variant="marketplace" />
    </div>
  );
};

export default PaymentCheckout;
