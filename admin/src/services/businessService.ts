import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'
import type { Business, ListingStatus } from '@/types'

export interface BusinessFilters {
  search?: string
  category?: string
  parish?: string
  ownerId?: string
  status?: string
  featured?: string
  sponsored?: string
}

export async function getBusinesses(filters: BusinessFilters = {}) {
  await mockDelay()
  let items = [...useAdminStore.getState().businesses]
  const search = filters.search?.toLowerCase().trim()
  if (search) {
    items = items.filter(
      (b) =>
        b.name.toLowerCase().includes(search) ||
        b.slug.toLowerCase().includes(search) ||
        b.id.toLowerCase().includes(search),
    )
  }
  if (filters.category) items = items.filter((b) => b.categoryId === filters.category)
  if (filters.parish) items = items.filter((b) => b.parish === filters.parish)
  if (filters.ownerId) items = items.filter((b) => b.ownerId === filters.ownerId)
  if (filters.status) items = items.filter((b) => b.status === filters.status)
  if (filters.featured === 'yes') items = items.filter((b) => b.featured)
  if (filters.featured === 'no') items = items.filter((b) => !b.featured)
  if (filters.sponsored === 'yes') items = items.filter((b) => b.sponsored)
  if (filters.sponsored === 'no') items = items.filter((b) => !b.sponsored)
  return items
}

export async function getBusinessById(id: string) {
  await mockDelay()
  return useAdminStore.getState().businesses.find((b) => b.id === id)
}

export async function updateBusiness(id: string, input: Partial<Business>) {
  await mockDelay()
  useAdminStore.getState().updateBusiness(id, input)
  return useAdminStore.getState().businesses.find((b) => b.id === id)
}

export async function setBusinessStatus(id: string, status: ListingStatus, notes?: string) {
  await mockDelay()
  useAdminStore.getState().setBusinessStatus(id, status, notes)
}
