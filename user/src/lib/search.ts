import type {
  Business,
  BusinessFilters,
  BusinessSort,
  PriceRange,
  SearchBusinessesResult,
} from '@/types/business'

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function includesNormalized(haystack: string, needle: string): boolean {
  return normalize(haystack).includes(normalize(needle))
}

function toArray<T>(value?: T | T[]): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export function matchesQuery(business: Business, query?: string): boolean {
  if (!query?.trim()) return true
  const q = normalize(query)
  const haystacks = [
    business.name,
    business.description,
    business.shortDescription,
    business.category,
    business.parish,
    business.locationLabel,
    business.address ?? '',
    ...business.tags,
    ...business.services,
    ...business.amenities,
  ]
  return haystacks.some((field) => normalize(field).includes(q))
}

export function filterBusinesses(
  businesses: Business[],
  filters: BusinessFilters = {},
): Business[] {
  const priceRanges = toArray(filters.priceRange)
  const listingTypes = toArray(filters.listingType)
  const amenities = filters.amenities ?? []
  const services = filters.services ?? []

  return businesses.filter((business) => {
    if (!matchesQuery(business, filters.q)) return false

    if (filters.category && business.categorySlug !== filters.category) return false
    if (filters.parish && business.parishSlug !== filters.parish) return false

    if (priceRanges.length > 0 && (!business.priceRange || !priceRanges.includes(business.priceRange))) {
      return false
    }

    if (listingTypes.length > 0 && !listingTypes.includes(business.listingType)) {
      return false
    }

    if (amenities.length > 0 && !amenities.every((item) =>
      business.amenities.some((amenity) => includesNormalized(amenity, item)),
    )) {
      return false
    }

    if (services.length > 0 && !services.every((item) =>
      business.services.some((service) => includesNormalized(service, item)),
    )) {
      return false
    }

    if (filters.familyFriendly && !business.familyFriendly) return false
    if (filters.outdoor && !business.outdoor) return false
    if (filters.accessibility && (!business.accessibility || business.accessibility.length === 0)) {
      return false
    }
    if (filters.featured && !business.featured) return false

    if (filters.favoritesOnly) {
      const favoriteIds = filters.favoriteIds ?? []
      if (!favoriteIds.includes(business.id)) return false
    }

    return true
  })
}

function relevanceScore(business: Business, query?: string): number {
  if (!query?.trim()) {
    return (business.featured ? 20 : 0) + (business.sponsored ? 5 : 0)
  }

  const q = normalize(query)
  let score = 0
  if (normalize(business.name).includes(q)) score += 50
  if (normalize(business.locationLabel).includes(q)) score += 20
  if (normalize(business.parish).includes(q)) score += 15
  if (normalize(business.category).includes(q)) score += 15
  if (business.tags.some((tag) => normalize(tag).includes(q))) score += 12
  if (business.services.some((service) => normalize(service).includes(q))) score += 12
  if (normalize(business.shortDescription).includes(q)) score += 8
  if (normalize(business.description).includes(q)) score += 4
  if (business.featured) score += 6
  return score
}

export function sortBusinesses(
  businesses: Business[],
  sort: BusinessSort = 'relevance',
  query?: string,
): Business[] {
  const items = [...businesses]

  switch (sort) {
    case 'name-asc':
      return items.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return items.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-asc':
      return items.sort((a, b) => (a.priceFrom ?? Number.POSITIVE_INFINITY) - (b.priceFrom ?? Number.POSITIVE_INFINITY))
    case 'price-desc':
      return items.sort((a, b) => (b.priceFrom ?? -1) - (a.priceFrom ?? -1))
    case 'featured':
      return items.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name))
    case 'relevance':
    default:
      return items.sort((a, b) => relevanceScore(b, query) - relevanceScore(a, query) || a.name.localeCompare(b.name))
  }
}

export function paginateBusinesses(
  businesses: Business[],
  page = 1,
  pageSize = 9,
): SearchBusinessesResult {
  const safePageSize = Math.max(1, pageSize)
  const pageCount = Math.max(1, Math.ceil(businesses.length / safePageSize))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const start = (safePage - 1) * safePageSize

  return {
    items: businesses.slice(start, start + safePageSize),
    total: businesses.length,
    page: safePage,
    pageSize: safePageSize,
    pageCount,
  }
}

export function searchBusinesses(
  businesses: Business[],
  filters: BusinessFilters = {},
  sort: BusinessSort = 'relevance',
  page = 1,
  pageSize = 9,
): SearchBusinessesResult {
  const filtered = filterBusinesses(businesses, filters)
  const sorted = sortBusinesses(filtered, sort, filters.q)
  return paginateBusinesses(sorted, page, pageSize)
}

export const PRICE_RANGE_OPTIONS: PriceRange[] = ['$', '$$', '$$$', '$$$$']
