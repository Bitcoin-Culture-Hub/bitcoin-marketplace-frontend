export type MarketplaceFilterOption = {
  value: string
  label: string
}

export type MarketplaceFilterType =
  | "availability"
  | "grade"
  | "grading"
  | "series"
  | "year"

export type MarketplaceFilterOptions = {
  seriesOptions: MarketplaceFilterOption[]
  gradeOptions: MarketplaceFilterOption[]
  gradingCompanyOptions: MarketplaceFilterOption[]
}

export interface MarketplaceTemplateFacetSource {
  series: string
  seriesKey: string
  availableGrades: string[]
  availableGradingCompanies: string[]
}

export interface MarketplaceTemplateFilterRecord
  extends MarketplaceTemplateFacetSource {
  name: string
  cardNumber: string
  year: number | null
  availableCount: number
  floorPriceBTC: number | null
  newestSupplyAt: Date | null
}

export type MarketplaceSortOption =
  | "available"
  | "floor-asc"
  | "floor-desc"
  | "newest"

export type MarketplaceFilterState = {
  availableOnly: boolean
  searchQuery: string
  selectedGrades: string[]
  selectedGradingCompanies: string[]
  selectedSeries: string[]
  sortBy: MarketplaceSortOption
  yearFrom: string
  yearTo: string
}

export type MarketplaceAvailabilityMetadata = {
  is_public?: boolean
  is_sold?: boolean
  listed?: boolean
  sold?: boolean
  state?: string
}

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ")
}

function compareLabels(a: MarketplaceFilterOption, b: MarketplaceFilterOption): number {
  return a.label.localeCompare(b.label, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

export function getMarketplaceDisplayLabel(
  value: string | null | undefined,
  fallback = "—"
): string {
  const normalized = collapseWhitespace(value ?? "")
  return normalized.length > 0 ? normalized : fallback
}

export function normalizeMarketplaceText(value: string | null | undefined): string {
  return collapseWhitespace(value ?? "").toLowerCase()
}

export function isMarketplaceVariantSold(
  metadata: MarketplaceAvailabilityMetadata | null | undefined
): boolean {
  return (
    metadata?.is_sold === true ||
    metadata?.sold === true ||
    metadata?.state === "sold"
  )
}

export function isMarketplaceListedPublic(
  metadata: MarketplaceAvailabilityMetadata | null | undefined
): boolean {
  return (
    metadata?.state === "listed" ||
    metadata?.listed === true ||
    metadata?.is_public === true
  )
}

export function isMarketplaceListedPublicUnsold(
  metadata: MarketplaceAvailabilityMetadata | null | undefined
): boolean {
  return (
    isMarketplaceListedPublic(metadata) &&
    !isMarketplaceVariantSold(metadata)
  )
}

export function normalizeMarketplaceSeries(value: string | null | undefined): string {
  return normalizeMarketplaceText(value)
}

export function normalizeMarketplaceGrade(
  value: string | null | undefined
): string | null {
  const normalized = collapseWhitespace(value ?? "")
  return normalized.length > 0 ? normalized : null
}

export function normalizeMarketplaceGradingCompany(
  value: string | null | undefined
): string | null {
  const normalized = collapseWhitespace(value ?? "").toUpperCase()
  return normalized.length > 0 ? normalized : null
}

export function parseMarketplaceYear(
  value: string | number | null | undefined
): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 1000 && value <= 9999 ? value : null
  }

  const normalized = collapseWhitespace(value ?? "")
  if (!/^\d{4}$/.test(normalized)) {
    return null
  }

  const parsed = Number(normalized)
  return Number.isInteger(parsed) ? parsed : null
}

export function matchesMarketplaceYearRange(
  year: number | null,
  from: string,
  to: string
): boolean {
  const fromYear = parseMarketplaceYear(from)
  const toYear = parseMarketplaceYear(to)

  if (fromYear === null && toYear === null) {
    return true
  }

  if (year === null) {
    return false
  }

  if (fromYear !== null && toYear !== null) {
    const lower = Math.min(fromYear, toYear)
    const upper = Math.max(fromYear, toYear)
    return year >= lower && year <= upper
  }

  if (fromYear !== null) {
    return year >= fromYear
  }

  return year <= (toYear as number)
}

export function getMarketplaceYearFilterLabel(
  from: string,
  to: string
): string | null {
  const fromYear = parseMarketplaceYear(from)
  const toYear = parseMarketplaceYear(to)

  if (fromYear !== null && toYear !== null) {
    const lower = Math.min(fromYear, toYear)
    const upper = Math.max(fromYear, toYear)
    return `Year ${lower}-${upper}`
  }

  if (fromYear !== null) {
    return `Year ${fromYear}+`
  }

  if (toYear !== null) {
    return `Year <= ${toYear}`
  }

  return null
}

export function buildMarketplaceFilterOptions(
  templates: MarketplaceTemplateFacetSource[]
): MarketplaceFilterOptions {
  const seriesMap = new Map<string, string>()
  const gradeSet = new Set<string>()
  const gradingCompanySet = new Set<string>()

  for (const template of templates) {
    if (template.seriesKey.length > 0 && !seriesMap.has(template.seriesKey)) {
      seriesMap.set(template.seriesKey, template.series)
    }

    for (const grade of template.availableGrades) {
      gradeSet.add(grade)
    }

    for (const company of template.availableGradingCompanies) {
      gradingCompanySet.add(company)
    }
  }

  const seriesOptions = [...seriesMap.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort(compareLabels)

  const gradeOptions = [...gradeSet]
    .map((grade) => ({ value: grade, label: grade }))
    .sort((a, b) => {
      const aNumber = Number.parseFloat(a.label)
      const bNumber = Number.parseFloat(b.label)
      const aIsNumeric = Number.isFinite(aNumber)
      const bIsNumeric = Number.isFinite(bNumber)

      if (aIsNumeric && bIsNumeric && aNumber !== bNumber) {
        return bNumber - aNumber
      }

      return compareLabels(a, b)
    })

  const gradingCompanyOptions = [...gradingCompanySet]
    .map((company) => ({ value: company, label: company }))
    .sort(compareLabels)

  return {
    seriesOptions,
    gradeOptions,
    gradingCompanyOptions,
  }
}

export function filterMarketplaceTemplates<T extends MarketplaceTemplateFilterRecord>(
  templates: T[],
  filters: MarketplaceFilterState
): T[] {
  let result = [...templates]

  if (filters.searchQuery) {
    const query = normalizeMarketplaceText(filters.searchQuery)
    result = result.filter(
      (template) =>
        normalizeMarketplaceText(template.name).includes(query) ||
        normalizeMarketplaceText(template.series).includes(query) ||
        normalizeMarketplaceText(template.cardNumber).includes(query)
    )
  }

  if (filters.availableOnly) {
    result = result.filter((template) => template.availableCount > 0)
  }

  if (filters.selectedSeries.length > 0) {
    result = result.filter((template) =>
      filters.selectedSeries.includes(template.seriesKey)
    )
  }

  if (filters.selectedGrades.length > 0) {
    result = result.filter((template) =>
      template.availableGrades.some((grade) =>
        filters.selectedGrades.includes(grade)
      )
    )
  }

  if (filters.selectedGradingCompanies.length > 0) {
    result = result.filter((template) =>
      template.availableGradingCompanies.some((company) =>
        filters.selectedGradingCompanies.includes(company)
      )
    )
  }

  if (filters.yearFrom || filters.yearTo) {
    result = result.filter((template) =>
      matchesMarketplaceYearRange(template.year, filters.yearFrom, filters.yearTo)
    )
  }

  switch (filters.sortBy) {
    case "floor-asc":
      result.sort((a, b) => {
        if (a.floorPriceBTC === null) return 1
        if (b.floorPriceBTC === null) return -1
        return a.floorPriceBTC - b.floorPriceBTC
      })
      break
    case "floor-desc":
      result.sort((a, b) => {
        if (a.floorPriceBTC === null) return 1
        if (b.floorPriceBTC === null) return -1
        return b.floorPriceBTC - a.floorPriceBTC
      })
      break
    case "available":
      result.sort((a, b) => b.availableCount - a.availableCount)
      break
    case "newest":
      result.sort((a, b) => {
        if (!a.newestSupplyAt) return 1
        if (!b.newestSupplyAt) return -1
        return b.newestSupplyAt.getTime() - a.newestSupplyAt.getTime()
      })
      break
  }

  return result
}
