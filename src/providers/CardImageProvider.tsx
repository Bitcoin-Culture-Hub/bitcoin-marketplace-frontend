import { useEffect, useState, type ReactNode } from "react"
import { loadCardImages } from "@/services/cardImageLookup"

export function CardImageProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadCardImages().then(() => setReady(true))
  }, [])

  if (!ready) return null

  return <>{children}</>
}
