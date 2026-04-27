import test from "node:test"
import assert from "node:assert/strict"

import {
  buildMarketplaceFilterOptions,
  filterMarketplaceTemplates,
  getMarketplaceYearFilterLabel,
  isMarketplaceListedPublicUnsold,
  type MarketplaceFilterState,
  type MarketplaceTemplateFilterRecord,
} from "../src/lib/marketplace-filters.ts"

const baseFilterState: MarketplaceFilterState = {
  availableOnly: false,
  searchQuery: "",
  selectedGrades: [],
  selectedGradingCompanies: [],
  selectedSeries: [],
  sortBy: "floor-asc",
  yearFrom: "",
  yearTo: "",
}

const templates: MarketplaceTemplateFilterRecord[] = [
  {
    name: "Alpha Card",
    cardNumber: "001",
    series: "Series 1 OPP",
    seriesKey: "series 1 opp",
    availableGrades: ["10", "9"],
    availableGradingCompanies: ["PSA", "BGS"],
    year: 2024,
    availableCount: 2,
    floorPriceBTC: 0.12,
    newestSupplyAt: new Date("2026-04-20T10:00:00.000Z"),
  },
  {
    name: "Beta Card",
    cardNumber: "002",
    series: "Series 2 OPP",
    seriesKey: "series 2 opp",
    availableGrades: ["9.5"],
    availableGradingCompanies: ["SGC"],
    year: 2023,
    availableCount: 1,
    floorPriceBTC: 0.08,
    newestSupplyAt: new Date("2026-04-19T10:00:00.000Z"),
  },
  {
    name: "Gamma Card",
    cardNumber: "003",
    series: "Commemorative",
    seriesKey: "commemorative",
    availableGrades: [],
    availableGradingCompanies: [],
    year: 2022,
    availableCount: 0,
    floorPriceBTC: null,
    newestSupplyAt: new Date("2026-04-18T10:00:00.000Z"),
  },
  {
    name: "Delta Card",
    cardNumber: "010",
    series: "Series 1 OPP",
    seriesKey: "series 1 opp",
    availableGrades: ["8.5"],
    availableGradingCompanies: ["TAG"],
    year: 2021,
    availableCount: 5,
    floorPriceBTC: 0.25,
    newestSupplyAt: new Date("2026-04-17T10:00:00.000Z"),
  },
]

function ids(records: MarketplaceTemplateFilterRecord[]): string[] {
  return records.map((record) => `${record.name}#${record.cardNumber}`)
}

test("series filtering uses normalized series keys", () => {
  const result = filterMarketplaceTemplates(templates, {
    ...baseFilterState,
    selectedSeries: ["series 1 opp"],
  })

  assert.deepEqual(ids(result), ["Alpha Card#001", "Delta Card#010"])
})

test("grade filtering matches available template grades", () => {
  const result = filterMarketplaceTemplates(templates, {
    ...baseFilterState,
    selectedGrades: ["10"],
  })

  assert.deepEqual(ids(result), ["Alpha Card#001"])
})

test("grading company filtering matches available template graders", () => {
  const result = filterMarketplaceTemplates(templates, {
    ...baseFilterState,
    selectedGradingCompanies: ["SGC"],
  })

  assert.deepEqual(ids(result), ["Beta Card#002"])
})

test("year filtering supports range endpoints", () => {
  const result = filterMarketplaceTemplates(templates, {
    ...baseFilterState,
    yearFrom: "2023",
    yearTo: "2024",
  })

  assert.deepEqual(ids(result), ["Beta Card#002", "Alpha Card#001"])
  assert.equal(getMarketplaceYearFilterLabel("2023", "2024"), "Year 2023-2024")
})

test("combined filters apply all predicates together", () => {
  const result = filterMarketplaceTemplates(templates, {
    ...baseFilterState,
    availableOnly: true,
    selectedSeries: ["series 1 opp"],
    selectedGrades: ["10"],
    selectedGradingCompanies: ["PSA"],
    yearFrom: "2024",
    yearTo: "2024",
  })

  assert.deepEqual(ids(result), ["Alpha Card#001"])
})

test("availability semantics use listed/public unsold copies", () => {
  assert.equal(
    isMarketplaceListedPublicUnsold({
      state: "listed",
      listed: true,
      is_public: true,
    }),
    true
  )
  assert.equal(
    isMarketplaceListedPublicUnsold({
      listed: true,
      is_sold: true,
    }),
    false
  )
  assert.equal(
    isMarketplaceListedPublicUnsold({
      is_public: true,
      sold: true,
    }),
    false
  )
  assert.equal(
    isMarketplaceListedPublicUnsold({
      state: "in_collection",
      listed: false,
      is_public: false,
    }),
    false
  )
})

test("clearing filters restores the full sorted result set", () => {
  const filtered = filterMarketplaceTemplates(templates, {
    ...baseFilterState,
    availableOnly: true,
    selectedSeries: ["series 1 opp"],
    selectedGrades: ["10"],
    selectedGradingCompanies: ["PSA"],
    yearFrom: "2024",
    yearTo: "2024",
  })
  const cleared = filterMarketplaceTemplates(templates, baseFilterState)

  assert.deepEqual(ids(filtered), ["Alpha Card#001"])
  assert.deepEqual(ids(cleared), [
    "Beta Card#002",
    "Alpha Card#001",
    "Delta Card#010",
    "Gamma Card#003",
  ])
})

test("facet options are derived from actual template data", () => {
  const options = buildMarketplaceFilterOptions(templates)

  assert.deepEqual(options.seriesOptions, [
    { value: "commemorative", label: "Commemorative" },
    { value: "series 1 opp", label: "Series 1 OPP" },
    { value: "series 2 opp", label: "Series 2 OPP" },
  ])
  assert.deepEqual(options.gradeOptions, [
    { value: "10", label: "10" },
    { value: "9.5", label: "9.5" },
    { value: "9", label: "9" },
    { value: "8.5", label: "8.5" },
  ])
  assert.deepEqual(options.gradingCompanyOptions, [
    { value: "BGS", label: "BGS" },
    { value: "PSA", label: "PSA" },
    { value: "SGC", label: "SGC" },
    { value: "TAG", label: "TAG" },
  ])
})
