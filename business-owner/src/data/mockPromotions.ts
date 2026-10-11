import type { Promotion } from '@/types'

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-001',
    businessId: 'biz-001',
    name: 'Autumn Coastal Featured Push',
    placement: 'homepage-featured',
    description: 'Feature Coral Breeze on the visitor homepage for seasonal discovery.',
    startDate: '2026-10-01',
    endDate: '2026-10-21',
    budget: 450,
    targetCategory: 'Tours & Excursions',
    status: 'active',
    demoImpressions: 1840,
    demoClicks: 212,
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    createdAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'promo-002',
    businessId: 'biz-002',
    name: 'Holetown Dining Spotlight',
    placement: 'category-featured',
    description: 'Category placement request for restaurants near Holetown.',
    startDate: '2026-10-15',
    endDate: '2026-11-05',
    budget: 300,
    targetCategory: 'Restaurants & Cafés',
    targetParish: 'St. James',
    status: 'pending_review',
    createdAt: '2026-10-08T13:00:00.000Z',
  },
]
