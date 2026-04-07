export type CardImageMatch = {
  frontImageFull: string
  frontImageThumb: string
  backImageFull: string | null
  backImageThumb: string | null
  cardBackText: string | null
}

type AirtableAttachment = {
  url: string
  thumbnails?: {
    large?: { url: string }
  }
}

type AirtableRecord = {
  fields: {
    "Card Name"?: string
    "Card Number"?: string
    Series?: string
    "Front Picture"?: AirtableAttachment[]
    "Back Picture"?: AirtableAttachment[]
    "Card Back Text"?: string
  }
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ")
}

// Composite key: name|number|series
function compositeKey(name: string, number?: string, series?: string): string {
  return [normalize(name), normalize(number ?? ""), normalize(series ?? "")].join("|")
}

// Two-level index: composite key (precise) and name-only (fallback)
let indexByComposite: Map<string, CardImageMatch> | null = null
let indexByName: Map<string, CardImageMatch> | null = null
let nameHasDuplicates: Set<string> | null = null
let loadPromise: Promise<void> | null = null

function toMatch(rec: AirtableRecord): CardImageMatch | null {
  const front = rec.fields["Front Picture"]?.[0]
  if (!front?.url) return null

  const back = rec.fields["Back Picture"]?.[0]

  return {
    frontImageFull: front.url,
    frontImageThumb: front.thumbnails?.large?.url ?? front.url,
    backImageFull: back?.url ?? null,
    backImageThumb: back?.thumbnails?.large?.url ?? back?.url ?? null,
    cardBackText: rec.fields["Card Back Text"] ?? null,
  }
}

export function loadCardImages(): Promise<void> {
  if (loadPromise) return loadPromise

  loadPromise = fetch("/output.json")
    .then((res) => res.json())
    .then((data: { records: AirtableRecord[] }) => {
      const byComposite = new Map<string, CardImageMatch>()
      const byName = new Map<string, CardImageMatch>()
      const nameCounts = new Map<string, number>()
      const dupes = new Set<string>()

      for (const rec of data.records) {
        const name = rec.fields["Card Name"]
        if (!name) continue

        const match = toMatch(rec)
        if (!match) continue

        const nName = normalize(name)
        const key = compositeKey(name, rec.fields["Card Number"], rec.fields.Series)

        // Always store by composite key (most precise)
        if (!byComposite.has(key)) {
          byComposite.set(key, match)
        }

        // Track name-only: first wins, but mark duplicates
        const count = (nameCounts.get(nName) ?? 0) + 1
        nameCounts.set(nName, count)
        if (count === 1) {
          byName.set(nName, match)
        } else {
          dupes.add(nName)
        }
      }

      indexByComposite = byComposite
      indexByName = byName
      nameHasDuplicates = dupes
    })
    .catch((err) => {
      console.error("Failed to load card images:", err)
      indexByComposite = new Map()
      indexByName = new Map()
      nameHasDuplicates = new Set()
    })

  return loadPromise
}

export function isLoaded(): boolean {
  return indexByComposite !== null
}

export function getCardImages(
  name: string,
  cardNumber?: string,
  series?: string
): CardImageMatch | null {
  if (!indexByComposite || !indexByName || !nameHasDuplicates) return null

  // Try composite key first
  const key = compositeKey(name, cardNumber, series)
  const composite = indexByComposite.get(key)
  if (composite) return composite

  // Fallback: name-only (only if no duplicates for this name)
  const nName = normalize(name)
  if (!nameHasDuplicates.has(nName)) {
    return indexByName.get(nName) ?? null
  }

  return null
}
