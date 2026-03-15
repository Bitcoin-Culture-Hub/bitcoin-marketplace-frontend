import { useState } from "react"

// ── Types ─────────────────────────────────────────────────────────────────────

export type CardRow = {
  card_name: string
  series_name: string
  series_number?: string
  year?: string
  grading_company: string
  cert_number: string
  grade: string
  edition_number?: string
  supply?: string
  price_usd?: number
  owner?: string
  category?: string
  image_url?: string
}

export type ImportResult = {
  created: number
  skipped: number
  products_created: number
  errors: { cert_number: string; reason: string }[]
  summary: {
    card_name: string
    cert_number: string
    grade: string | number
    owner: string
    product_id: string
    variant_id: string
  }[]
}

export type ImportStatus = "idle" | "parsing" | "importing" | "done" | "error"

// ── CSV column name aliases ───────────────────────────────────────────────────
// Maps every column header variant from your spreadsheet → our CardRow field

const COL_MAP: Record<string, keyof CardRow> = {
  // card_name
  "card name": "card_name",
  "cardname": "card_name",
  "card": "card_name",
  "name": "card_name",
  // series_name
  "series name": "series_name",
  "seriesname": "series_name",
  "series": "series_name",
  // series_number
  "series number": "series_number",
  "seriesnumber": "series_number",
  "series #": "series_number",
  // year
  "year": "year",
  // grading_company
  "grading co.": "grading_company",
  "grading co": "grading_company",
  "grading company": "grading_company",
  "gradingcompany": "grading_company",
  "grader": "grading_company",
  // cert_number
  "cert #": "cert_number",
  "cert#": "cert_number",
  "cert number": "cert_number",
  "certnumber": "cert_number",
  "certification": "cert_number",
  // grade
  "grade": "grade",
  // edition_number
  "edition #": "edition_number",
  "edition#": "edition_number",
  "edition number": "edition_number",
  "editionnumber": "edition_number",
  "edition": "edition_number",
  // supply
  "supply": "supply",
  "print run": "supply",
  "printrun": "supply",
  // price_usd
  "price (usd)": "price_usd",
  "price(usd)": "price_usd",
  "price usd": "price_usd",
  "priceusd": "price_usd",
  "price": "price_usd",
  // owner
  "owner": "owner",
  // category
  "category": "category",
  // image_url
  "web image link": "image_url",
  "image url": "image_url",
  "imageurl": "image_url",
  "image": "image_url",
}

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(text: string): CardRow[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row")

  // Parse headers — lowercase + trim to normalise
  const headers = lines[0].split("\t").map((h) => h.trim().toLowerCase())

  // Map header index → CardRow field
  const fieldMap: (keyof CardRow | null)[] = headers.map((h) => COL_MAP[h] ?? null)

  const rows: CardRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const cells = line.split("\t").map((c) => c.trim())
    const row: Partial<CardRow> = {}

    for (let j = 0; j < fieldMap.length; j++) {
      const field = fieldMap[j]
      if (!field) continue
      const raw = cells[j] ?? ""
      if (!raw || raw === "??" || raw.toLowerCase() === "vlookup" || raw === "N/a" || raw === "n/a") continue

      if (field === "price_usd") {
        const n = parseFloat(raw.replace(/[$,]/g, ""))
        if (!isNaN(n)) row.price_usd = n
      } else {
        ;(row as any)[field] = raw
      }
    }

    // Skip rows missing the required fields
    if (!row.card_name || !row.cert_number || !row.grading_company || !row.grade) continue

    rows.push(row as CardRow)
  }

  if (rows.length === 0) throw new Error("No valid rows found — check column headers match the expected format")
  return rows
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useBulkImport() {
  const [status, setStatus] = useState<ImportStatus>("idle")
  const [parsed, setParsed] = useState<CardRow[]>([])
  const [result, setResult] = useState<ImportResult | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const parseFile = (file: File) => {
    setStatus("parsing")
    setParseError(null)
    setParsed([])
    setResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const rows = parseCSV(text)
        setParsed(rows)
        setStatus("idle")
      } catch (err: any) {
        setParseError(err.message)
        setStatus("error")
      }
    }
    reader.readAsText(file)
  }

  const runImport = async (listingIntent: "listed" | "private" = "listed") => {
    if (parsed.length === 0) return
    setStatus("importing")
    setResult(null)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_MEDUSA_BACKEND_URL}/admin/inventory/bulk-import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_MEDUSA_ADMIN_TOKEN ?? ""}`,
          },
          credentials: "include",
          body: JSON.stringify({ cards: parsed, default_listing_intent: listingIntent }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Import failed")

      setResult(data)
      setStatus("done")
    } catch (err: any) {
      setParseError(err.message)
      setStatus("error")
    }
  }

  const reset = () => {
    setStatus("idle")
    setParsed([])
    setResult(null)
    setParseError(null)
  }

  return { status, parsed, result, parseError, parseFile, runImport, reset }
}
