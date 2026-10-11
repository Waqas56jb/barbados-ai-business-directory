import { categories } from '@/data/categories'
import { locations } from '@/data/locations'
import type { BusinessFilters, BusinessSort, ListingType, PriceRange } from '@/types/business'

const validSorts: BusinessSort[] = [
  'relevance',
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
  'featured',
]

const validListingTypes: ListingType[] = [
  'experience',
  'accommodation',
  'restaurant',
  'attraction',
  'transport',
  'retail',
  'activity',
]

const validPrices: PriceRange[] = ['$', '$$', '$$$', '$$$$']

export interface DirectoryUrlState {
  q?: string
  category?: string
  parish?: string
  listingType?: ListingType
  priceRange?: PriceRange
  familyFriendly?: boolean
  outdoor?: boolean
  accessibility?: boolean
  featured?: boolean
  favoritesOnly?: boolean
  sort: BusinessSort
  page: number
}

export function parseDirectorySearchParams(params: URLSearchParams): DirectoryUrlState {
  const categoryParam = params.get('category') ?? undefined
  const parishParam = params.get('parish') ?? undefined
  const sortParam = params.get('sort') as BusinessSort | null
  const listingTypeParam = params.get('listingType') as ListingType | null
  const priceParam = params.get('price') as PriceRange | null
  const pageParam = Number(params.get('page') ?? '1')

  const category = categories.some((item) => item.slug === categoryParam) ? categoryParam : undefined
  const parish = locations.some((item) => item.slug === parishParam) ? parishParam : undefined
  const sort = sortParam && validSorts.includes(sortParam) ? sortParam : 'relevance'
  const listingType =
    listingTypeParam && validListingTypes.includes(listingTypeParam) ? listingTypeParam : undefined
  const priceRange = priceParam && validPrices.includes(priceParam) ? priceParam : undefined

  return {
    q: params.get('q') ?? undefined,
    category,
    parish,
    listingType,
    priceRange,
    familyFriendly: params.get('familyFriendly') === '1' || undefined,
    outdoor: params.get('outdoor') === '1' || undefined,
    accessibility: params.get('accessibility') === '1' || undefined,
    featured: params.get('featured') === '1' || undefined,
    favoritesOnly: params.get('favorites') === '1' || undefined,
    sort,
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
  }
}

export function toDirectorySearchParams(state: DirectoryUrlState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.q?.trim()) params.set('q', state.q.trim())
  if (state.category) params.set('category', state.category)
  if (state.parish) params.set('parish', state.parish)
  if (state.listingType) params.set('listingType', state.listingType)
  if (state.priceRange) params.set('price', state.priceRange)
  if (state.familyFriendly) params.set('familyFriendly', '1')
  if (state.outdoor) params.set('outdoor', '1')
  if (state.accessibility) params.set('accessibility', '1')
  if (state.featured) params.set('featured', '1')
  if (state.favoritesOnly) params.set('favorites', '1')
  if (state.sort && state.sort !== 'relevance') params.set('sort', state.sort)
  if (state.page > 1) params.set('page', String(state.page))
  return params
}

export function toBusinessFilters(state: DirectoryUrlState): BusinessFilters {
  return {
    q: state.q,
    category: state.category,
    parish: state.parish,
    listingType: state.listingType,
    priceRange: state.priceRange,
    familyFriendly: state.familyFriendly,
    outdoor: state.outdoor,
    accessibility: state.accessibility,
    featured: state.featured,
    favoritesOnly: state.favoritesOnly,
  }
}

export function describeActiveFilters(state: DirectoryUrlState): string[] {
  const chips: string[] = []
  if (state.q?.trim()) chips.push(`“${state.q.trim()}”`)
  if (state.category) {
    chips.push(categories.find((item) => item.slug === state.category)?.name ?? state.category)
  }
  if (state.parish) {
    chips.push(locations.find((item) => item.slug === state.parish)?.name ?? state.parish)
  }
  if (state.listingType) chips.push(state.listingType)
  if (state.priceRange) chips.push(state.priceRange)
  if (state.familyFriendly) chips.push('Family-friendly')
  if (state.outdoor) chips.push('Outdoor')
  if (state.accessibility) chips.push('Accessibility info')
  if (state.featured) chips.push('Featured')
  if (state.favoritesOnly) chips.push('Favorites')
  return chips
}
