import { create } from 'zustand'
import { mockActivity, mockNotifications } from '@/data/mockNotifications'
import { mockAnalytics } from '@/data/mockAnalytics'
import { mockBusinesses, mockReusableServices } from '@/data/mockBusinesses'
import { mockFAQs } from '@/data/mockFAQs'
import { mockInquiries } from '@/data/mockInquiries'
import { mockListings } from '@/data/mockListings'
import { defaultSettings, mockOwner } from '@/data/mockOwner'
import { mockPromotions } from '@/data/mockPromotions'
import { mockReviews } from '@/data/mockReviews'
import { calculateCompletion } from '@/lib/completion'
import { slugify } from '@/lib/formatters'
import { readStorage, storageKeys, writeStorage } from '@/lib/storage'
import type {
  ActivityItem,
  AnalyticsPoint,
  Business,
  BusinessService,
  BusinessStatus,
  FAQ,
  Inquiry,
  InquiryStatus,
  Listing,
  NotificationItem,
  Owner,
  OwnerSettings,
  Promotion,
  Review,
} from '@/types'

export interface DemoStateSnapshot {
  owner: Owner
  businesses: Business[]
  listings: Listing[]
  services: BusinessService[]
  faqs: FAQ[]
  promotions: Promotion[]
  inquiries: Inquiry[]
  notifications: NotificationItem[]
  reviews: Review[]
  analytics: AnalyticsPoint[]
  activity: ActivityItem[]
  settings: OwnerSettings
  activeBusinessId: string
  authenticated: boolean
  onboardingComplete: boolean
}

function seedState(): DemoStateSnapshot {
  return {
    owner: structuredClone(mockOwner),
    businesses: structuredClone(mockBusinesses).map((business) => ({
      ...business,
      completionPercentage: calculateCompletion(business),
    })),
    listings: structuredClone(mockListings),
    services: structuredClone(mockReusableServices),
    faqs: structuredClone(mockFAQs),
    promotions: structuredClone(mockPromotions),
    inquiries: structuredClone(mockInquiries),
    notifications: structuredClone(mockNotifications),
    reviews: structuredClone(mockReviews),
    analytics: structuredClone(mockAnalytics),
    activity: structuredClone(mockActivity),
    settings: structuredClone(defaultSettings),
    activeBusinessId: mockBusinesses[0]?.id ?? '',
    authenticated: false,
    onboardingComplete: true,
  }
}

function loadState(): DemoStateSnapshot {
  const stored = readStorage<Partial<DemoStateSnapshot> | null>(storageKeys.demoState, null)
  if (!stored) return seedState()
  const seed = seedState()
  return {
    ...seed,
    ...stored,
    owner: stored.owner ?? seed.owner,
    businesses: stored.businesses ?? seed.businesses,
    listings: stored.listings ?? seed.listings,
    services: stored.services ?? seed.services,
    faqs: stored.faqs ?? seed.faqs,
    promotions: stored.promotions ?? seed.promotions,
    inquiries: stored.inquiries ?? seed.inquiries,
    notifications: stored.notifications ?? seed.notifications,
    reviews: stored.reviews ?? seed.reviews,
    analytics: stored.analytics ?? seed.analytics,
    activity: stored.activity ?? seed.activity,
    settings: stored.settings ?? seed.settings,
    activeBusinessId: stored.activeBusinessId ?? seed.activeBusinessId,
    authenticated: Boolean(stored.authenticated),
    onboardingComplete: stored.onboardingComplete ?? true,
  }
}

function persist(state: DemoStateSnapshot) {
  writeStorage(storageKeys.demoState, state)
}

function syncListingFromBusiness(listings: Listing[], business: Business): Listing[] {
  const existing = listings.find((listing) => listing.businessId === business.id)
  if (!existing) {
    return [
      ...listings,
      {
        id: `lst-${business.id}`,
        businessId: business.id,
        title: business.name,
        status: business.status,
        featured: false,
        publishedAt: business.status === 'published' ? business.updatedAt : undefined,
        lastUpdated: business.updatedAt,
        completionScore: business.completionPercentage,
      },
    ]
  }
  return listings.map((listing) =>
    listing.businessId === business.id
      ? {
          ...listing,
          title: business.name,
          status: business.status,
          lastUpdated: business.updatedAt,
          completionScore: business.completionPercentage,
          publishedAt:
            business.status === 'published'
              ? listing.publishedAt ?? business.updatedAt
              : listing.publishedAt,
        }
      : listing,
  )
}

interface DemoStore extends DemoStateSnapshot {
  loginDemo: () => void
  logout: () => void
  registerDemo: (input: { name: string; email: string; businessName: string }) => void
  completeOnboarding: (business: Business) => void
  setActiveBusiness: (id: string) => void
  resetDemoData: () => void
  updateOwner: (patch: Partial<Owner>) => void
  updateSettings: (patch: Partial<OwnerSettings>) => void
  upsertBusiness: (business: Business) => void
  createBusiness: (input: Partial<Business> & { name: string; category: string; parish: string }) => Business
  duplicateBusiness: (id: string) => Business | undefined
  archiveBusiness: (id: string) => void
  setBusinessStatus: (id: string, status: BusinessStatus) => void
  upsertService: (service: BusinessService) => void
  deleteService: (id: string) => void
  reorderServices: (orderedIds: string[]) => void
  upsertFaq: (faq: FAQ) => void
  deleteFaq: (id: string) => void
  upsertPromotion: (promotion: Promotion) => void
  updateInquiry: (id: string, patch: Partial<Inquiry>) => void
  setInquiryStatus: (id: string, status: InquiryStatus) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  replyToReview: (id: string, reply: string) => void
  flagReview: (id: string) => void
  addActivity: (item: Omit<ActivityItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void
  getActiveBusiness: () => Business | undefined
}

function withPersist(set: (fn: (state: DemoStore) => Partial<DemoStore>) => void, updater: (state: DemoStore) => Partial<DemoStore>) {
  set((state) => {
    const patch = updater(state)
    const next = { ...state, ...patch }
    const snapshot: DemoStateSnapshot = {
      owner: next.owner,
      businesses: next.businesses,
      listings: next.listings,
      services: next.services,
      faqs: next.faqs,
      promotions: next.promotions,
      inquiries: next.inquiries,
      notifications: next.notifications,
      reviews: next.reviews,
      analytics: next.analytics,
      activity: next.activity,
      settings: next.settings,
      activeBusinessId: next.activeBusinessId,
      authenticated: next.authenticated,
      onboardingComplete: next.onboardingComplete,
    }
    persist(snapshot)
    return patch
  })
}

const initial = loadState()

export const useDemoStore = create<DemoStore>((set, get) => ({
  ...initial,

  loginDemo: () =>
    withPersist(set, () => ({
      authenticated: true,
      onboardingComplete: true,
    })),

  logout: () =>
    withPersist(set, () => ({
      authenticated: false,
    })),

  registerDemo: (input) =>
    withPersist(set, (state) => ({
      authenticated: true,
      onboardingComplete: false,
      owner: {
        ...state.owner,
        name: input.name,
        email: input.email,
      },
    })),

  completeOnboarding: (business) =>
    withPersist(set, (state) => {
      const completed = {
        ...business,
        completionPercentage: calculateCompletion(business),
        updatedAt: new Date().toISOString(),
      }
      return {
        onboardingComplete: true,
        businesses: [completed, ...state.businesses.filter((item) => item.id !== completed.id)],
        listings: syncListingFromBusiness(state.listings, completed),
        activeBusinessId: completed.id,
        activity: [
          {
            id: `act-${crypto.randomUUID()}`,
            businessId: completed.id,
            title: 'Listing submitted for review',
            description: `${completed.name} was submitted through the demo onboarding flow.`,
            createdAt: new Date().toISOString(),
            type: 'listing',
          },
          ...state.activity,
        ],
      }
    }),

  setActiveBusiness: (id) => withPersist(set, () => ({ activeBusinessId: id })),

  resetDemoData: () => {
    const fresh = seedState()
    fresh.authenticated = get().authenticated
    persist(fresh)
    set({ ...fresh })
  },

  updateOwner: (patch) =>
    withPersist(set, (state) => ({
      owner: { ...state.owner, ...patch },
    })),

  updateSettings: (patch) =>
    withPersist(set, (state) => ({
      settings: { ...state.settings, ...patch },
    })),

  upsertBusiness: (business) =>
    withPersist(set, (state) => {
      const nextBusiness = {
        ...business,
        completionPercentage: calculateCompletion(business),
        updatedAt: new Date().toISOString(),
      }
      const exists = state.businesses.some((item) => item.id === nextBusiness.id)
      const businesses = exists
        ? state.businesses.map((item) => (item.id === nextBusiness.id ? nextBusiness : item))
        : [nextBusiness, ...state.businesses]
      return {
        businesses,
        listings: syncListingFromBusiness(state.listings, nextBusiness),
        services: nextBusiness.services.reduce((acc, service) => {
          const idx = acc.findIndex((item) => item.id === service.id)
          if (idx >= 0) {
            const clone = [...acc]
            clone[idx] = service
            return clone
          }
          return [...acc, service]
        }, state.services),
        activity: [
          {
            id: `act-${crypto.randomUUID()}`,
            businessId: nextBusiness.id,
            title: 'Business profile updated',
            description: `${nextBusiness.name} profile changes were saved in local demo state.`,
            createdAt: new Date().toISOString(),
            type: 'profile',
          },
          ...state.activity,
        ],
      }
    }),

  createBusiness: (input) => {
    const id = `biz-${crypto.randomUUID().slice(0, 8)}`
    const now = new Date().toISOString()
    const business: Business = {
      id,
      ownerId: get().owner.id,
      name: input.name,
      slug: input.slug || slugify(input.name),
      category: input.category,
      secondaryCategories: input.secondaryCategories ?? [],
      shortDescription: input.shortDescription ?? '',
      description: input.description ?? '',
      parish: input.parish,
      locationLabel: input.locationLabel ?? input.parish,
      address: input.address,
      email: input.email,
      phone: input.phone,
      website: input.website,
      services: [],
      openingHours: input.openingHours ?? [],
      amenities: input.amenities ?? [],
      languages: input.languages ?? ['English'],
      socialLinks: input.socialLinks ?? [],
      gallery: input.gallery ?? [],
      coverImage: input.coverImage,
      status: 'draft',
      completionPercentage: 0,
      createdAt: now,
      updatedAt: now,
    }
    business.completionPercentage = calculateCompletion(business)
    get().upsertBusiness(business)
    get().setActiveBusiness(business.id)
    return business
  },

  duplicateBusiness: (id) => {
    const source = get().businesses.find((item) => item.id === id)
    if (!source) return undefined
    const copy: Business = {
      ...structuredClone(source),
      id: `biz-${crypto.randomUUID().slice(0, 8)}`,
      name: `${source.name} (Copy)`,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    copy.completionPercentage = calculateCompletion(copy)
    get().upsertBusiness(copy)
    return copy
  },

  archiveBusiness: (id) => get().setBusinessStatus(id, 'archived'),

  setBusinessStatus: (id, status) =>
    withPersist(set, (state) => {
      const businesses = state.businesses.map((business) =>
        business.id === id
          ? { ...business, status, updatedAt: new Date().toISOString() }
          : business,
      )
      const business = businesses.find((item) => item.id === id)
      return {
        businesses,
        listings: business ? syncListingFromBusiness(state.listings, business) : state.listings,
        activity: business
          ? [
              {
                id: `act-${crypto.randomUUID()}`,
                businessId: business.id,
                title: status === 'pending_review' ? 'Listing submitted for review' : 'Listing status updated',
                description: `${business.name} is now ${status.replaceAll('_', ' ')} in demo state.`,
                createdAt: new Date().toISOString(),
                type: 'listing',
              },
              ...state.activity,
            ]
          : state.activity,
      }
    }),

  upsertService: (service) =>
    withPersist(set, (state) => {
      const exists = state.services.some((item) => item.id === service.id)
      const services = exists
        ? state.services.map((item) => (item.id === service.id ? service : item))
        : [service, ...state.services]
      const businesses = state.businesses.map((business) => {
        const linked = services.filter((item) => item.businessIds.includes(business.id))
        const next = { ...business, services: linked, updatedAt: new Date().toISOString() }
        return { ...next, completionPercentage: calculateCompletion(next) }
      })
      return { services, businesses }
    }),

  deleteService: (id) =>
    withPersist(set, (state) => {
      const services = state.services.filter((item) => item.id !== id)
      const businesses = state.businesses.map((business) => {
        const next = {
          ...business,
          services: business.services.filter((service) => service.id !== id),
          updatedAt: new Date().toISOString(),
        }
        return { ...next, completionPercentage: calculateCompletion(next) }
      })
      return { services, businesses }
    }),

  reorderServices: (orderedIds) =>
    withPersist(set, (state) => {
      const map = new Map(state.services.map((service) => [service.id, service]))
      const ordered = orderedIds.map((id) => map.get(id)).filter(Boolean) as BusinessService[]
      const remainder = state.services.filter((service) => !orderedIds.includes(service.id))
      return { services: [...ordered, ...remainder] }
    }),

  upsertFaq: (faq) =>
    withPersist(set, (state) => {
      const exists = state.faqs.some((item) => item.id === faq.id)
      return {
        faqs: exists
          ? state.faqs.map((item) => (item.id === faq.id ? faq : item))
          : [faq, ...state.faqs],
        notifications: [
          {
            id: `ntf-${crypto.randomUUID()}`,
            type: 'ai_knowledge_updated',
            title: 'AI knowledge information updated',
            message: 'FAQ changes are reflected immediately in the demo knowledge preview.',
            read: false,
            createdAt: new Date().toISOString(),
            href: '/ai-knowledge',
          },
          ...state.notifications,
        ],
      }
    }),

  deleteFaq: (id) =>
    withPersist(set, (state) => ({
      faqs: state.faqs.filter((item) => item.id !== id),
    })),

  upsertPromotion: (promotion) =>
    withPersist(set, (state) => {
      const exists = state.promotions.some((item) => item.id === promotion.id)
      return {
        promotions: exists
          ? state.promotions.map((item) => (item.id === promotion.id ? promotion : item))
          : [promotion, ...state.promotions],
        activity: [
          {
            id: `act-${crypto.randomUUID()}`,
            businessId: promotion.businessId,
            title: 'Promotion request created',
            description: `${promotion.name} was saved in local demo advertising state.`,
            createdAt: new Date().toISOString(),
            type: 'promotion',
          },
          ...state.activity,
        ],
      }
    }),

  updateInquiry: (id, patch) =>
    withPersist(set, (state) => ({
      inquiries: state.inquiries.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),

  setInquiryStatus: (id, status) => get().updateInquiry(id, { status }),

  markNotificationRead: (id) =>
    withPersist(set, (state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    })),

  markAllNotificationsRead: () =>
    withPersist(set, (state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
    })),

  replyToReview: (id, reply) =>
    withPersist(set, (state) => ({
      reviews: state.reviews.map((item) =>
        item.id === id
          ? { ...item, ownerReply: reply, ownerRepliedAt: new Date().toISOString() }
          : item,
      ),
    })),

  flagReview: (id) =>
    withPersist(set, (state) => ({
      reviews: state.reviews.map((item) =>
        item.id === id ? { ...item, status: 'flagged' } : item,
      ),
    })),

  addActivity: (item) =>
    withPersist(set, (state) => ({
      activity: [
        {
          id: item.id ?? `act-${crypto.randomUUID()}`,
          createdAt: item.createdAt ?? new Date().toISOString(),
          businessId: item.businessId,
          title: item.title,
          description: item.description,
          type: item.type,
        },
        ...state.activity,
      ],
    })),

  getActiveBusiness: () => {
    const state = get()
    return (
      state.businesses.find((business) => business.id === state.activeBusinessId) ??
      state.businesses[0]
    )
  },
}))
