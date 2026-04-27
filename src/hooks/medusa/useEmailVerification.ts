import { useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  resendCustomerEmailVerification,
  verifyCustomerEmailCode,
} from "@/services/store.api"

type MetadataCarrier = {
  metadata?: Record<string, unknown> | null
} | null | undefined

export type CustomerEmailVerificationState = {
  code_hash?: string | null
  expires_at?: string | null
  last_sent_at?: string | null
  verified_at?: string | null
}

export function getCustomerEmailVerificationState(
  customer: MetadataCarrier
): CustomerEmailVerificationState {
  const raw = customer?.metadata?.email_verification

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {}
  }

  const state = raw as Record<string, unknown>

  return {
    code_hash:
      typeof state.code_hash === "string" ? state.code_hash : null,
    expires_at:
      typeof state.expires_at === "string" ? state.expires_at : null,
    last_sent_at:
      typeof state.last_sent_at === "string" ? state.last_sent_at : null,
    verified_at:
      typeof state.verified_at === "string" ? state.verified_at : null,
  }
}

export function isCustomerEmailVerified(customer: MetadataCarrier) {
  return Boolean(getCustomerEmailVerificationState(customer).verified_at)
}

export function useEmailVerificationActions() {
  const { refreshCustomer } = useAuth()

  const verifyCode = useCallback(
    async (code: string) => {
      const result = await verifyCustomerEmailCode(code)
      await refreshCustomer()
      return result
    },
    [refreshCustomer]
  )

  const resendCode = useCallback(async () => {
    const result = await resendCustomerEmailVerification()
    await refreshCustomer()
    return result
  }, [refreshCustomer])

  return {
    verifyCode,
    resendCode,
  }
}
