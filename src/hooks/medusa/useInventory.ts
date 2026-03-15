import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { useAuth } from "@/context/AuthContext";
import type { CollectionTemplate, CopyState } from "@/components/collection/CollectionRow";

// ─── Map Medusa product variants → CollectionTemplate ────────────────────────
// Each Medusa product = a card template
// Each variant = one physical graded copy owned by this seller

function toCollectionTemplate(product: any): CollectionTemplate {
  const meta = product.metadata ?? {};

  const copies = (product.variants ?? []).map((v: any): any => {
    const vm = v.metadata ?? {};
    // Derive copy state from variant metadata flags
    let state: CopyState = "in_collection";
    if (vm.state) state = vm.state as CopyState;
    else if (vm.in_escrow) state = "in_escrow";
    else if (vm.sold) state = "sold";
    else if (vm.listed) state = "listed";

    return {
      id: v.id,
      gradingCompany: vm.grading_company ?? "—",
      grade: vm.grade ?? v.title ?? "—",
      certNumber: vm.cert_number ?? "—",
      state,
      isPublic: vm.is_public === true,
      priceBTC: vm.price_btc != null ? Number(vm.price_btc) : undefined,
      acceptsOffers: vm.accepts_offers === true,
      orderId: vm.order_id as string | undefined,
      soldDate: vm.sold_date as string | undefined,
      soldPriceBTC: vm.sold_price_btc != null ? Number(vm.sold_price_btc) : undefined,
    };
  });

  return {
    id: product.id,
    name: product.title,
    series: product.collection?.title ?? meta.series ?? "—",
    year: meta.year ?? "—",
    cardNumber: meta.card_number ?? product.handle ?? "—",
    copies,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInventory() {
  const { customer } = useAuth();

  return useQuery({
    queryKey: ["inventory", customer?.id],
    queryFn: async () => {
      // Fetch products where seller metadata matches current customer
      const { products } = await medusa.store.product.list({
        limit: 100,
        fields:
          "id,title,handle,collection.*,metadata,variants.*,variants.prices.*",
      });

      // Filter to only this seller's products (by metadata.seller_id)
      const mine = (products as any[]).filter(
        (p) => p.metadata?.seller_id === customer?.id
      );

      return mine.map(toCollectionTemplate);
    },
    enabled: !!customer,
    staleTime: 30_000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Update a variant's metadata (toggle listing, set price, etc.)
 * Uses the admin API — only works if the customer has admin rights,
 * OR you expose a custom /store/inventory/variants/:id PATCH endpoint on Medusa.
 */
export function useUpdateVariantMeta() {
  const queryClient = useQueryClient();
  const { customer } = useAuth();

  return useMutation({
    mutationFn: async ({
      variantId,
      metadata,
    }: {
      variantId: string;
      metadata: Record<string, unknown>;
    }) => {
      // Custom endpoint: PATCH /store/inventory/variants/:id
      // See src/api/store/inventory/variants/[id]/route.ts
      const response = await fetch(
        `${import.meta.env.VITE_MEDUSA_BACKEND_URL}/store/inventory/variants/${variantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
          },
          credentials: "include",
          body: JSON.stringify({ metadata }),
        }
      );
      if (!response.ok) throw new Error("Failed to update variant");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", customer?.id] });
    },
  });
}
