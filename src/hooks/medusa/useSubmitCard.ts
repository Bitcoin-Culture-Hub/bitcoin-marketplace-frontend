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
    onSuccess: () => {
      // Refresh the seller's inventory
      queryClient.invalidateQueries({ queryKey: ["inventory", customer?.id] });
    },
  });
}
