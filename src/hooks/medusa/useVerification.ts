import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { createVendor } from "@/services/store.api";
import { useAuth } from "@/context/AuthContext";

export type VerificationPayload = {
  // Address step
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  // Payout
  btcPayoutAddress: string;
  // Storefront
  storefrontName: string;
  termsAccepted: boolean;
};

type SellerMetadataCarrier = {
  metadata?: Record<string, unknown> | null;
} | null | undefined;

/** Generates a URL-friendly slug from a store name. */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Saves seller verification data to the customer's metadata and
 * shipping address. The `is_verified_seller` flag is what gates
 * seller actions throughout the app.
 *
 * Also creates a vendor record via POST /vendor so the seller has
 * a proper storefront identity linked across cards, offers, and orders.
 */
export function useVerification() {
  const queryClient = useQueryClient();
  const { refreshCustomer } = useAuth();

  return useMutation({
    mutationFn: async (data: VerificationPayload) => {
      // 1. Update customer metadata with seller verification details
      await medusa.store.customer.update({
        metadata: {
          is_verified_seller: true,
          storefront_name: data.storefrontName,
          btc_payout_address: data.btcPayoutAddress,
          terms_accepted_at: new Date().toISOString(),
        },
      });

      // 2. Add shipping/return address
      await medusa.store.customer.createAddress({
        first_name: data.fullName.split(" ")[0] ?? data.fullName,
        last_name: data.fullName.split(" ").slice(1).join(" ") || "",
        address_1: data.addressLine1,
        address_2: data.addressLine2,
        city: data.city,
        province: data.state,
        postal_code: data.postalCode,
        country_code: data.country.toLowerCase(),
        phone: data.phone,
        metadata: { is_return_address: true },
      });

      // 3. Create vendor record (storefront identity)
      const { customer } = await medusa.store.customer.retrieve();
      await createVendor({
        name: data.storefrontName,
        slug: toSlug(data.storefrontName),
        email: customer.email ?? "",
        phone: data.phone || null,
      });
    },
    onSuccess: () => {
      // Bust the customer cache so Header/ProtectedRoute see updated metadata
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      void refreshCustomer();
    },
  });
}

/**
 * Simple hook to check if the current customer is a verified seller.
 * Reads from customer metadata set during verification.
 */
export function useIsVerifiedSeller(customer: SellerMetadataCarrier) {
  return customer?.metadata?.is_verified_seller === true;
}
