import type { Listing } from '@/types'

export const mockListings: Listing[] = [
  {
    id: 'lst-001',
    businessId: 'biz-001',
    title: 'Coral Breeze Catamaran Tours',
    status: 'published',
    featured: true,
    publishedAt: '2026-08-15T12:00:00.000Z',
    lastUpdated: '2026-10-08T14:20:00.000Z',
    completionScore: 92,
  },
  {
    id: 'lst-002',
    businessId: 'biz-002',
    title: 'Ocean Pearl Beach Lounge',
    status: 'pending_review',
    featured: false,
    lastUpdated: '2026-10-09T11:10:00.000Z',
    completionScore: 78,
  },
  {
    id: 'lst-003',
    businessId: 'biz-003',
    title: 'Island Link Transfers',
    status: 'draft',
    featured: false,
    lastUpdated: '2026-10-07T16:45:00.000Z',
    completionScore: 64,
  },
]
