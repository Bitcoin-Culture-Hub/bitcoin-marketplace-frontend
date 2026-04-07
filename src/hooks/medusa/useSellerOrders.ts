import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { listSellerOrders, type SellerOrderRow } from "@/services/store.api";

export function useSellerOrders() {
  const { customer } = useAuth();

  return useQuery<SellerOrderRow[]>({
    queryKey: ["vendor", "orders"],
    queryFn: async () => {
      const res = await listSellerOrders();
      return res.orders;
    },
    enabled: !!customer,
    staleTime: 30_000,
  });
}
