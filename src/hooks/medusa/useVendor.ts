import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  getMyVendor,
  updateVendor,
  getVendorSummary,
  type VendorResponse,
  type VendorSummary,
} from "@/services/store.api";

export function useVendorProfile() {
  const { customer } = useAuth();

  return useQuery<VendorResponse>({
    queryKey: ["vendor", "me"],
    queryFn: getMyVendor,
    enabled: !!customer,
    staleTime: 60_000,
  });
}

export function useVendorSummary() {
  const { customer } = useAuth();

  return useQuery<{ summary: VendorSummary }>({
    queryKey: ["vendor", "summary"],
    queryFn: getVendorSummary,
    enabled: !!customer,
    staleTime: 30_000,
  });
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; slug?: string; email?: string; phone?: string | null };
    }) => {
      return updateVendor(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
}
