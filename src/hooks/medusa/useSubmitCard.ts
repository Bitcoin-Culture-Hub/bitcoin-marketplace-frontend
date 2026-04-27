import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { useAuth } from "@/context/AuthContext";

export type SubmitCardData = {
  // Card identity
  cardSet: string;
  cardName: string;
  // Grading
  gradingCompany: string;
  certNumber: string;
  grade: string;
  serialNumber?: string;
  // Listing intent
  listingIntent: "private" | "fixed" | "both";
  askPrice?: string; // BTC string, e.g. "0.125"
};

/**
 * Creates a product (if template doesn't exist yet) + a variant for this
 * specific graded copy. In production you'd likely look up the template first
 * and only create a variant — but for MVP this creates the product each time
 * and you can deduplicate in the Admin later.
 *
 * Posts to a custom /store/inventory/submit endpoint on your Medusa backend.
 */
export function useSubmitCard() {
  const queryClient = useQueryClient();
  const { customer } = useAuth();

  return useMutation({
    mutationFn: async (data: SubmitCardData) => {
      const response = await fetch(
        `${import.meta.env.VITE_MEDUSA_BACKEND_URL}/store/inventory/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
          },
          credentials: "include",
          body: JSON.stringify({
            title: data.cardName,
            series: data.cardSet,
            seller_id: customer?.id,
            grading_company: data.gradingCompany,
            cert_number: data.certNumber,
            grade: data.grade,
            serial_number: data.serialNumber,
            listing_intent: data.listingIntent,
            price_btc:
              data.listingIntent !== "private" && data.askPrice
                ? parseFloat(data.askPrice)
                : null,
            accepts_offers: data.listingIntent === "both",
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to submit card");
      }

      return response.json();
    },
    onSuccess: async () => {
      // Force every downstream view that reads from the product catalog to
      // refetch — not just mark-as-stale. `invalidateQueries` alone leaves
      // inactive queries (e.g. /dashboard/products when you're still on the
      // /submit page) stale-but-unrefreshed until they remount, which is
      // why sellers would land on the products page and still not see the
      // card they just added.
      //
      // Using partial keys (e.g. ["inventory"]) invalidates every variant
      // of that key, including the user-scoped ["inventory", customer.id].
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["inventory"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["templates"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["vendor"],
          refetchType: "all",
        }),
      ]);

      if (customer?.id) {
        await queryClient.refetchQueries({
          queryKey: ["inventory", customer.id],
        });
      }
    },
  });
}
