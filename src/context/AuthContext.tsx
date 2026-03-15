import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { medusa } from "@/lib/medusa"

export type Customer = {
  id: string
  email: string
  first_name: string
  last_name: string
  metadata?: Record<string, unknown>
}

type AuthContextType = {
  customer: Customer | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export type RegisterData = {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session on mount
  useEffect(() => {
    medusa.store.customer
      .retrieve()
      .then(({ customer }) => setCustomer(customer as Customer))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await medusa.auth.login("customer", "emailpass", { email, password })
    const { customer } = await medusa.store.customer.retrieve()
    setCustomer(customer as Customer)
  }, [])

  const register = useCallback(
    async ({ email, password, first_name = "", last_name = "" }: RegisterData) => {
      // 1. Create auth identity and get registration token
      const registerRes = await fetch(
        `${import.meta.env.VITE_MEDUSA_BACKEND_URL}/auth/customer/emailpass/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      )
      const { token } = await registerRes.json()
      if (!token) throw new Error("Registration failed — no token returned")

      // 2. Create customer profile using that token
      const customerRes = await fetch(
        `${import.meta.env.VITE_MEDUSA_BACKEND_URL}/store/customers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ email, first_name, last_name }),
        }
      )
      if (!customerRes.ok) {
        const err = await customerRes.json()
        throw new Error(err.message || "Failed to create customer profile")
      }

      // 3. Auto-login
      await login(email, password)
    },
    [login]
  )

  const logout = useCallback(async () => {
    await medusa.auth.logout()
    setCustomer(null)
  }, [])

  return (
    <AuthContext.Provider value={{ customer, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
