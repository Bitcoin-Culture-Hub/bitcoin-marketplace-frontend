import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth, type Customer } from "@/context/AuthContext"
import { getMyVendor, ApiError, type VendorRecord } from "@/services/store.api"

/**
 * Centralized hook for user role + storefront state.
 *
 * Import anywhere to gate UI, enforce access, or branch logic by role:
 *
 *   const { isStorefrontOwner, canListCards, vendor } = useUserRole()
 *   if (!canListCards) return <PromptCreateStore />
 */

export type UserRole = "guest" | "buyer" | "storefront_owner"

export type UserRoleState = {
  /** Raw customer (null if not logged in). */
  customer: Customer | null
  /** Raw vendor record (null if user has no storefront or isn't logged in). */
  vendor: VendorRecord | null

  /** Primary role — guest < buyer < storefront_owner. */
  role: UserRole

  /** True while auth or vendor data is still loading. Gate UI on this to avoid flicker. */
  isLoading: boolean

  /** Convenience booleans — derived from `role`. */
  isGuest: boolean
  isAuthenticated: boolean
  isBuyer: boolean
  isStorefrontOwner: boolean

  /** Capability booleans — what the user is allowed to do. */
  canBrowseMarketplace: boolean   // everyone
  canMakeOffers: boolean           // authenticated only
  canCheckout: boolean             // authenticated only
  canCreateStorefront: boolean     // authenticated AND no existing vendor
  canListCards: boolean            // storefront owners only
  canManageStorefront: boolean     // storefront owners only
  canAccessSellerDashboard: boolean // storefront owners only

  /** Identity helpers. */
  userId: string | null
  vendorId: string | null
  vendorSlug: string | null

  /** True if a given vendorId belongs to the current user. Useful for "my listing" checks. */
  isOwnVendor: (vendorId: string | null | undefined) => boolean
}

export function useVendorQuery(customer: Customer | null) {
  return useQuery({
    queryKey: ["vendor", "me", customer?.id ?? "anon"],
    queryFn: getMyVendor,
    enabled: !!customer,
    staleTime: 60_000,
    // 404 is an expected "no storefront" response — don't retry it.
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false
      return failureCount < 2
    },
  })
}

export function useUserRole(): UserRoleState {
  const { customer, loading: authLoading } = useAuth()
  const vendorQuery = useVendorQuery(customer)

  return useMemo<UserRoleState>(() => {
    const isAuthenticated = !!customer
    const isLoading = authLoading || (isAuthenticated && vendorQuery.isLoading)

    // getMyVendor throws ApiError(404) when user has no vendor — treat as "no storefront"
    const vendorError = vendorQuery.error
    const has404 =
      vendorError instanceof ApiError && vendorError.status === 404
    const vendor: VendorRecord | null = has404
      ? null
      : vendorQuery.data?.vendor ?? null

    const isStorefrontOwner = isAuthenticated && !!vendor
    const role: UserRole = !isAuthenticated
      ? "guest"
      : isStorefrontOwner
      ? "storefront_owner"
      : "buyer"

    return {
      customer,
      vendor,
      role,
      isLoading,

      isGuest: role === "guest",
      isAuthenticated,
      isBuyer: role === "buyer",
      isStorefrontOwner,

      canBrowseMarketplace: true,
      canMakeOffers: isAuthenticated,
      canCheckout: isAuthenticated,
      canCreateStorefront: isAuthenticated && !vendor && !vendorQuery.isLoading,
      canListCards: isStorefrontOwner,
      canManageStorefront: isStorefrontOwner,
      canAccessSellerDashboard: isStorefrontOwner,

      userId: customer?.id ?? null,
      vendorId: vendor?.id ?? null,
      vendorSlug: vendor?.slug ?? null,

      isOwnVendor: (vendorId) =>
        !!vendor && !!vendorId && vendor.id === vendorId,
    }
  }, [
    customer,
    authLoading,
    vendorQuery.isLoading,
    vendorQuery.data,
    vendorQuery.error,
  ])
}
