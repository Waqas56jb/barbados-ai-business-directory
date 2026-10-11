import { categories, getCategoryBySlug } from '@/data/categories'
import { getLocationBySlug, locations } from '@/data/locations'
import { searchBusinesses as runSearch } from '@/lib/search'
import { useBusinessStore } from '@/store/businessStore'
import type {
  Business,
  BusinessFilters,
  BusinessSort,
  SearchBusinessesParams,
  SearchBusinessesResult,
} from '@/types/business'
import type { Category, Location } from '@/types/category'

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })
}

export async function getBusinesses(): Promise<Business[]> {
  return delay(useBusinessStore.getState().getBusinesses())
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  return delay(useBusinessStore.getState().getBusinessBySlug(slug))
}

export async function searchBusinesses(
  params: SearchBusinessesParams = {},
): Promise<SearchBusinessesResult> {
  const businesses = useBusinessStore.getState().getBusinesses()
  const result = runSearch(
    businesses,
    params.filters,
    params.sort ?? 'relevance',
    params.page ?? 1,
    params.pageSize ?? 9,
  )
  return delay(result)
}

export async function getFeaturedBusinesses(limit = 6): Promise<Business[]> {
  const featured = useBusinessStore
    .getState()
    .getBusinesses()
    .filter((business) => business.featured)
    .slice(0, limit)
  return delay(featured)
}

export async function getBusinessesByCategory(category: string): Promise<Business[]> {
  return delay(
    useBusinessStore
      .getState()
      .getBusinesses()
      .filter((business) => business.categorySlug === category),
  )
}

export async function getBusinessesByLocation(location: string): Promise<Business[]> {
  return delay(
    useBusinessStore
      .getState()
      .getBusinesses()
      .filter((business) => business.parishSlug === location),
  )
}

export async function getRelatedBusinesses(business: Business, limit = 3): Promise<Business[]> {
  const related = useBusinessStore
    .getState()
    .getBusinesses()
    .filter((item) => item.id !== business.id)
    .map((item) => {
      let score = 0
      if (item.categorySlug === business.categorySlug) score += 3
      if (item.parishSlug === business.parishSlug) score += 2
      score += item.tags.filter((tag) => business.tags.includes(tag)).length
      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item)

  return delay(related)
}

export async function getCategories(): Promise<Category[]> {
  return delay(categories)
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return delay(getCategoryBySlug(slug))
}

export async function getLocations(): Promise<Location[]> {
  return delay(locations)
}

export async function getLocation(slug: string): Promise<Location | undefined> {
  return delay(getLocationBySlug(slug))
}

export type { BusinessFilters, BusinessSort }
