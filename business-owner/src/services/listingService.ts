import { useDemoStore } from '@/store/demoStore'
import type { BusinessStatus, Listing } from '@/types'

const delay = <T,>(value: T, ms = 120) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export interface ListingFilters {
  q?: string
  status?: BusinessStatus | 'all'
  businessId?: string
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  let listings = useDemoStore.getState().listings
  if (filters.businessId) listings = listings.filter((item) => item.businessId === filters.businessId)
  if (filters.status && filters.status !== 'all') {
    listings = listings.filter((item) => item.status === filters.status)
  }
  if (filters.q?.trim()) {
    const q = filters.q.toLowerCase()
    listings = listings.filter((item) => item.title.toLowerCase().includes(q))
  }
  return delay(listings)
}

export async function submitListingForReview(businessId: string): Promise<void> {
  useDemoStore.getState().setBusinessStatus(businessId, 'pending_review')
  return delay(undefined)
}

export async function previewListing(businessId: string) {
  const business = useDemoStore.getState().businesses.find((item) => item.id === businessId)
  return delay(business)
}
