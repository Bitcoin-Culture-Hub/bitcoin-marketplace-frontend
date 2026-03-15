import { useState, useCallback } from "react";
import { medusa } from "@/lib/medusa";
import { useAuth } from "@/context/AuthContext";

export type CheckoutStep = "address" | "shipping" | "escrow" | "complete";

export type ShippingAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country_code: string;
  postal_code: string;
  phone?: string;
};

export type EscrowDetails = {
  amountBTC: number;
  address: string;
  network: "lightning" | "onchain";
  expiresAt: Date;
};

const CART_KEY = "btc_cart_id";

export function useCheckout() {
  const { customer } = useAuth();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [cartId, setCartId] = useState<string | null>(
    () => localStorage.getItem(CART_KEY)
  );
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [escrowDetails, setEscrowDetails] = useState<EscrowDetails | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Initialise / get cart ─────────────────────────────────────────────────
  const getOrCreateCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;
    const { regions } = await medusa.store.region.list();
    const { cart } = await medusa.store.cart.create({
      region_id: regions[0]?.id,
    });
    localStorage.setItem(CART_KEY, cart.id);
    setCartId(cart.id);
    return cart.id;
  }, [cartId]);

  // ── Add a listing variant to the cart ────────────────────────────────────
  const addToCart = useCallback(
    async (variantId: string) => {
      setLoading(true);
      setError(null);
      try {
        const id = await getOrCreateCart();
        await medusa.store.cart.createLineItem(id, {
          variant_id: variantId,
          quantity: 1,
        });
        return id;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [getOrCreateCart]
  );

  // ── Step 1: set shipping address + email ─────────────────────────────────
  const setAddress = useCallback(
    async (address: ShippingAddress, email: string) => {
      setLoading(true);
      setError(null);
      try {
        const id = await getOrCreateCart();
        await medusa.store.cart.update(id, {
          email: email || customer?.email,
          shipping_address: address,
          billing_address: address,
        });
        const { shipping_options } =
          await medusa.store.fulfillment.listCartOptions({ cart_id: id });
        setShippingOptions(shipping_options);
        setStep("shipping");
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [getOrCreateCart, customer]
  );

  // ── Step 2: select shipping method ───────────────────────────────────────
  const selectShipping = useCallback(
    async (optionId: string) => {
      const id = cartId ?? (await getOrCreateCart());
      setLoading(true);
      setError(null);
      try {
        await medusa.store.cart.addShippingMethod(id, { option_id: optionId });
        setStep("escrow");
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [cartId, getOrCreateCart]
  );

  // ── Step 3: initiate BTC escrow payment ──────────────────────────────────
  const initiateEscrow = useCallback(async () => {
    const id = cartId ?? (await getOrCreateCart());
    setLoading(true);
    setError(null);
    try {
      // Retrieve cart total
      const { cart } = await medusa.store.cart.retrieve(id, {
        fields: "id,total,region_id",
      });

      // Initiate payment session with your BTC/escrow provider
      // Provider id must match what's configured in medusa-config.ts
      const { payment_providers } =
        await medusa.store.payment.listPaymentProviders({
          region_id: (cart as any).region_id,
        });

      const escrowProvider = payment_providers.find((p: any) =>
        p.id.includes("escrow")
      ) ?? payment_providers[0];

      await medusa.store.payment.initiatePaymentSession(cart as any, {
        provider_id: escrowProvider?.id,
      });

      // In production your escrow provider returns a BTC address + invoice.
      // We mock the shape here — replace with the actual session data.
      const amountBTC = (cart as any).total / 100 / 65000; // USD → BTC at ~$65k
      const network: "lightning" | "onchain" = amountBTC < 0.01 ? "lightning" : "onchain";

      setEscrowDetails({
        amountBTC,
        address:
          network === "lightning"
            ? "lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl"
            : "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        network,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [cartId, getOrCreateCart]);

  // ── Step 4: complete order once escrow is confirmed ───────────────────────
  const completeOrder = useCallback(async () => {
    const id = cartId;
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { order } = await medusa.store.cart.complete(id);
      setCompletedOrder(order);
      localStorage.removeItem(CART_KEY);
      setCartId(null);
      setStep("complete");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  const resetCart = useCallback(() => {
    localStorage.removeItem(CART_KEY);
    setCartId(null);
    setStep("address");
    setEscrowDetails(null);
    setCompletedOrder(null);
    setError(null);
  }, []);

  return {
    step,
    shippingOptions,
    escrowDetails,
    completedOrder,
    loading,
    error,
    addToCart,
    setAddress,
    selectShipping,
    initiateEscrow,
    completeOrder,
    resetCart,
  };
}
