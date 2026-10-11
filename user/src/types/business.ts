export type PriceRange = '$' | '$$' | '$$$' | '$$$$'

export type ListingType =
  | 'experience'
  | 'accommodation'
  | 'restaurant'
  | 'attraction'
  | 'transport'
  | 'retail'
  | 'activity'

export interface OpeningHours {
  day: string
  hours: string
}

export interface Business {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  listingType: ListingType
  description: string
  shortDescription: string
  parish: string
  parishSlug: string
  locationLabel: string
  address?: string
  coverImage: string
  gallery: string[]
  services: string[]
  tags: string[]
  priceRange?: PriceRange
  priceFrom?: number
  currency?: string
  website?: string
  phone?: string
  openingHours?: OpeningHours[]
  amenities: string[]
  accessibility?: string[]
  familyFriendly?: boolean
  outdoor?: boolean
  languages?: string[]
  featured: boolean
  sponsored: boolean
  demoRecord: boolean
  demoRating?: number
  demoReviewCount?: number
  lastUpdated: string
}

export interface BusinessFilters {
  q?: string
  category?: string
  parish?: string
  priceRange?: PriceRange | PriceRange[]
  listingType?: ListingType | ListingType[]
  amenities?: string[]
  services?: string[]
  familyFriendly?: boolean
  outdoor?: boolean
  accessibility?: boolean
  featured?: boolean
  favoritesOnly?: boolean
  favoriteIds?: string[]
}

export type BusinessSort =
  | 'relevance'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'featured'

export interface SearchBusinessesParams {
  filters?: BusinessFilters
  sort?: BusinessSort
  page?: number
  pageSize?: number
}

export interface SearchBusinessesResult {
  items: Business[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}
