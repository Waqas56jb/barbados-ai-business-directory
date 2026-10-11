import { create } from 'zustand'
import type { AdminRole } from '@/config/site'
import { mockAdministrators } from '@/data/mockAdministrators'
import { mockBusinesses, mockBusinessOwners } from '@/data/mockBusinesses'
import { mockCategories } from '@/data/mockCategories'
import { mockLocations } from '@/data/mockLocations'
import {
  defaultChatbotSettings,
  defaultPlatformSettings,
  mockAnalytics,
  mockAuditLogs,
  mockConversations,
  mockEvalCases,
  mockIntegrations,
  mockKnowledge,
  mockListingReviews,
  mockNotifications,
  mockPlacements,
  mockPromotions,
  mockReports,
  mockReviews,
} from '@/data/mockSeedExtras'
import { previewAdminChatAnswer } from '@/lib/chatbotPreview'
import { readStorage, storageKeys, writeStorage } from '@/lib/storage'
import type {
  Administrator,
  AuditLog,
  Business,
  BusinessOwner,
  Category,
  ChatbotSettings,
  ChatConversation,
  EvalCase,
  KnowledgeRecord,
  ListingReview,
  ListingStatus,
  LocationRecord,
  NotificationItem,
  PlacementConfig,
  PlatformSettings,
  Promotion,
  PromoStatus,
  Report,
  Review,
} from '@/types'

export interface AdminSnapshot {
  authenticated: boolean
  activeAdminId: string
  activeRole: AdminRole
  administrators: Administrator[]
  owners: BusinessOwner[]
  businesses: Business[]
  listingReviews: ListingReview[]
  categories: Category[]
  locations: LocationRecord[]
  reviews: Review[]
  reports: Report[]
  knowledge: KnowledgeRecord[]
  conversations: ChatConversation[]
  promotions: Promotion[]
  placements: PlacementConfig[]
  notifications: NotificationItem[]
  auditLogs: AuditLog[]
  analytics: typeof mockAnalytics
  chatbotSettings: ChatbotSettings
  platformSettings: PlatformSettings
  integrations: typeof mockIntegrations
  evalCases: EvalCase[]
}

function seed(): AdminSnapshot {
  return {
    authenticated: false,
    activeAdminId: 'adm-001',
    activeRole: 'super_admin',
    administrators: structuredClone(mockAdministrators),
    owners: structuredClone(mockBusinessOwners),
    businesses: structuredClone(mockBusinesses),
    listingReviews: structuredClone(mockListingReviews),
    categories: structuredClone(mockCategories),
    locations: structuredClone(mockLocations),
    reviews: structuredClone(mockReviews),
    reports: structuredClone(mockReports),
    knowledge: structuredClone(mockKnowledge),
    conversations: structuredClone(mockConversations),
    promotions: structuredClone(mockPromotions),
    placements: structuredClone(mockPlacements),
    notifications: structuredClone(mockNotifications),
    auditLogs: structuredClone(mockAuditLogs),
    analytics: structuredClone(mockAnalytics),
    chatbotSettings: structuredClone(defaultChatbotSettings),
    platformSettings: structuredClone(defaultPlatformSettings),
    integrations: structuredClone(mockIntegrations),
    evalCases: structuredClone(mockEvalCases),
  }
}

function load(): AdminSnapshot {
  const stored = readStorage<Partial<AdminSnapshot> | null>(storageKeys.demoState, null)
  const base = seed()
  if (!stored) return base
  return {
    ...base,
    ...stored,
    authenticated: Boolean(stored.authenticated),
    activeRole: stored.activeRole ?? base.activeRole,
    activeAdminId: stored.activeAdminId ?? base.activeAdminId,
  }
}

function persist(state: AdminSnapshot) {
  writeStorage(storageKeys.demoState, state)
}

interface AdminStore extends AdminSnapshot {
  loginDemo: () => void
  logout: () => void
  setActiveRole: (role: AdminRole) => void
  resetDemoData: () => void
  addAudit: (input: Omit<AuditLog, 'id' | 'createdAt' | 'actorId' | 'actorName' | 'role'> & { actorId?: string }) => void
  updateBusiness: (id: string, patch: Partial<Business>) => void
  setBusinessStatus: (id: string, status: ListingStatus, notes?: string) => void
  updateOwnerStatus: (id: string, status: BusinessOwner['status'], notes?: string) => void
  upsertCategory: (category: Category) => void
  upsertLocation: (location: LocationRecord) => void
  updateReview: (id: string, patch: Partial<Review>) => void
  resolveReport: (id: string, status: Report['status'], notes: string) => void
  upsertKnowledge: (record: KnowledgeRecord) => void
  simulateKnowledgeRefresh: (id: string) => void
  updateConversation: (id: string, patch: Partial<ChatConversation>) => void
  updatePromotionStatus: (id: string, status: PromoStatus, reason?: string) => void
  upsertPlacement: (placement: PlacementConfig) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  createAnnouncement: (title: string, message: string) => void
  updateChatbotSettings: (patch: Partial<ChatbotSettings>) => void
  updatePlatformSettings: (patch: Partial<PlatformSettings>) => void
  upsertAdministrator: (admin: Administrator) => void
  runEvalCases: () => void
  previewAnswer: (question: string) => ReturnType<typeof previewAdminChatAnswer>
  getActiveAdmin: () => Administrator | undefined
}

function withPersist(
  set: (fn: (state: AdminStore) => Partial<AdminStore>) => void,
  updater: (state: AdminStore) => Partial<AdminStore>,
) {
  set((state) => {
    const patch = updater(state)
    const next = { ...state, ...patch }
    const snapshot: AdminSnapshot = {
      authenticated: next.authenticated,
      activeAdminId: next.activeAdminId,
      activeRole: next.activeRole,
      administrators: next.administrators,
      owners: next.owners,
      businesses: next.businesses,
      listingReviews: next.listingReviews,
      categories: next.categories,
      locations: next.locations,
      reviews: next.reviews,
      reports: next.reports,
      knowledge: next.knowledge,
      conversations: next.conversations,
      promotions: next.promotions,
      placements: next.placements,
      notifications: next.notifications,
      auditLogs: next.auditLogs,
      analytics: next.analytics,
      chatbotSettings: next.chatbotSettings,
      platformSettings: next.platformSettings,
      integrations: next.integrations,
      evalCases: next.evalCases,
    }
    persist(snapshot)
    return patch
  })
}

const initial = load()

export const useAdminStore = create<AdminStore>((set, get) => ({
  ...initial,

  loginDemo: () => withPersist(set, () => ({ authenticated: true })),
  logout: () => withPersist(set, () => ({ authenticated: false })),
  setActiveRole: (role) =>
    withPersist(set, (state) => {
      const match = state.administrators.find((admin) => admin.role === role)
      return {
        activeRole: role,
        activeAdminId: match?.id ?? state.activeAdminId,
      }
    }),
  resetDemoData: () => {
    const fresh = seed()
    fresh.authenticated = get().authenticated
    fresh.activeRole = get().activeRole
    persist(fresh)
    set(fresh)
  },

  addAudit: (input) =>
    withPersist(set, (state) => {
      const actor = state.administrators.find((admin) => admin.id === (input.actorId ?? state.activeAdminId))
      const entry: AuditLog = {
        id: `aud-${crypto.randomUUID().slice(0, 8)}`,
        actorId: actor?.id ?? state.activeAdminId,
        actorName: actor?.name ?? 'Administrator',
        role: state.activeRole,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        summary: input.summary,
        previousState: input.previousState,
        newState: input.newState,
        createdAt: new Date().toISOString(),
      }
      return { auditLogs: [entry, ...state.auditLogs] }
    }),

  updateBusiness: (id, patch) =>
    withPersist(set, (state) => {
      const businesses = state.businesses.map((business) =>
        business.id === id
          ? { ...business, ...patch, updatedAt: new Date().toISOString() }
          : business,
      )
      const business = businesses.find((item) => item.id === id)
      const knowledge: KnowledgeRecord[] = state.knowledge.map((record) => {
        if (record.businessId !== id || record.sourceType !== 'business_listing' || !business) {
          return record
        }
        return {
          ...record,
          title: business.name,
          content: `${business.name}. ${business.description} Services: ${business.services
            .map((service) => service.name)
            .join(', ')}. Location: ${business.locationLabel}, ${business.parish}.`,
          updatedAt: business.updatedAt,
          demoIndexStatus: business.status === 'published' ? 'indexed_demo' : 'out_of_date_demo',
          visibility: business.status === 'published' ? ('public' as const) : ('hidden' as const),
        }
      })
      return { businesses, knowledge }
    }),

  setBusinessStatus: (id, status, notes) => {
    const previous = get().businesses.find((business) => business.id === id)?.status
    get().updateBusiness(id, { status })
    withPersist(set, (state) => ({
      listingReviews: state.listingReviews.map((review) =>
        review.businessId === id
          ? {
              ...review,
              reviewStatus: status,
              reviewerId: state.activeAdminId,
              reviewNotes: notes ?? review.reviewNotes,
              changeRequests: status === 'changes_requested' ? notes : review.changeRequests,
              decisionAt: new Date().toISOString(),
            }
          : review,
      ),
    }))
    get().addAudit({
      action: `listing_${status}`,
      entityType: 'business',
      entityId: id,
      summary: `Updated listing status to ${status}${notes ? `: ${notes}` : ''}`,
      previousState: previous,
      newState: status,
    })
  },

  updateOwnerStatus: (id, status, notes) =>
    withPersist(set, (state) => {
      get().addAudit({
        action: 'owner_status_updated',
        entityType: 'owner',
        entityId: id,
        summary: `Owner status set to ${status}`,
        previousState: state.owners.find((owner) => owner.id === id)?.status,
        newState: status,
      })
      return {
        owners: state.owners.map((owner) =>
          owner.id === id
            ? {
                ...owner,
                status,
                notes: notes ?? owner.notes,
                lastActivityAt: new Date().toISOString(),
              }
            : owner,
        ),
      }
    }),

  upsertCategory: (category) =>
    withPersist(set, (state) => {
      const exists = state.categories.some((item) => item.id === category.id)
      get().addAudit({
        action: exists ? 'category_updated' : 'category_created',
        entityType: 'category',
        entityId: category.id,
        summary: `${exists ? 'Updated' : 'Created'} category ${category.name}`,
      })
      return {
        categories: exists
          ? state.categories.map((item) => (item.id === category.id ? category : item))
          : [...state.categories, category],
        businesses: state.businesses.map((business) =>
          business.categoryId === category.id
            ? { ...business, category: category.name }
            : business,
        ),
      }
    }),

  upsertLocation: (location) =>
    withPersist(set, (state) => {
      const exists = state.locations.some((item) => item.id === location.id)
      return {
        locations: exists
          ? state.locations.map((item) => (item.id === location.id ? location : item))
          : [...state.locations, location],
      }
    }),

  updateReview: (id, patch) =>
    withPersist(set, (state) => ({
      reviews: state.reviews.map((review) => (review.id === id ? { ...review, ...patch } : review)),
    })),

  resolveReport: (id, status, notes) =>
    withPersist(set, (state) => {
      get().addAudit({
        action: 'report_resolved',
        entityType: 'report',
        entityId: id,
        summary: `Report marked ${status}`,
        newState: status,
      })
      return {
        reports: state.reports.map((report) =>
          report.id === id
            ? {
                ...report,
                status,
                resolutionNotes: notes,
                assignedAdminId: state.activeAdminId,
              }
            : report,
        ),
      }
    }),

  upsertKnowledge: (record) =>
    withPersist(set, (state) => {
      const exists = state.knowledge.some((item) => item.id === record.id)
      get().addAudit({
        action: 'knowledge_updated',
        entityType: 'knowledge',
        entityId: record.id,
        summary: `${exists ? 'Updated' : 'Created'} knowledge record ${record.title}`,
      })
      return {
        knowledge: exists
          ? state.knowledge.map((item) => (item.id === record.id ? record : item))
          : [record, ...state.knowledge],
      }
    }),

  simulateKnowledgeRefresh: (id) =>
    withPersist(set, (state) => {
      get().addAudit({
        action: 'knowledge_refresh_simulated',
        entityType: 'knowledge',
        entityId: id,
        summary: 'Simulated knowledge refresh completed',
        previousState: state.knowledge.find((item) => item.id === id)?.demoIndexStatus,
        newState: 'indexed_demo',
      })
      return {
        knowledge: state.knowledge.map((item) =>
          item.id === id
            ? {
                ...item,
                demoIndexStatus: 'indexed_demo',
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      }
    }),

  updateConversation: (id, patch) =>
    withPersist(set, (state) => ({
      conversations: state.conversations.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    })),

  updatePromotionStatus: (id, status, reason) =>
    withPersist(set, (state) => {
      get().addAudit({
        action: `promotion_${status}`,
        entityType: 'promotion',
        entityId: id,
        summary: `Promotion status set to ${status}${reason ? `: ${reason}` : ''}`,
        previousState: state.promotions.find((item) => item.id === id)?.status,
        newState: status,
      })
      return {
        promotions: state.promotions.map((item) =>
          item.id === id
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item,
        ),
      }
    }),

  upsertPlacement: (placement) =>
    withPersist(set, (state) => {
      const exists = state.placements.some((item) => item.id === placement.id)
      return {
        placements: exists
          ? state.placements.map((item) => (item.id === placement.id ? placement : item))
          : [...state.placements, placement],
      }
    }),

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

  createAnnouncement: (title, message) =>
    withPersist(set, (state) => ({
      notifications: [
        {
          id: `ntf-${crypto.randomUUID().slice(0, 8)}`,
          type: 'announcement',
          title,
          message,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),

  updateChatbotSettings: (patch) =>
    withPersist(set, (state) => {
      get().addAudit({
        action: 'chatbot_settings_updated',
        entityType: 'settings',
        entityId: 'chatbot',
        summary: 'Updated chatbot configuration in demo settings',
      })
      return { chatbotSettings: { ...state.chatbotSettings, ...patch } }
    }),

  updatePlatformSettings: (patch) =>
    withPersist(set, (state) => ({
      platformSettings: { ...state.platformSettings, ...patch },
    })),

  upsertAdministrator: (admin) =>
    withPersist(set, (state) => {
      const exists = state.administrators.some((item) => item.id === admin.id)
      return {
        administrators: exists
          ? state.administrators.map((item) => (item.id === admin.id ? admin : item))
          : [...state.administrators, admin],
      }
    }),

  runEvalCases: () =>
    withPersist(set, (state) => {
      const evalCases = state.evalCases.map((testCase) => {
        const result = previewAdminChatAnswer(testCase.question, state.businesses, state.knowledge)
        let status: EvalCase['status'] = 'pass_demo'
        if (testCase.id === 'eval-003' && !result.hasFallback) status = 'fail_demo'
        if (testCase.id === 'eval-004' && result.referencedBusinessIds.includes('biz-014')) {
          status = 'fail_demo'
        }
        if (result.hasFallback && testCase.id === 'eval-001') status = 'needs_review'
        return {
          ...testCase,
          actualAnswer: result.answer,
          status,
          reviewerNotes: result.hasFallback ? 'Fallback returned in demo run' : 'Grounded demo answer returned',
        }
      })
      get().addAudit({
        action: 'ai_evaluation_ran',
        entityType: 'evaluation',
        entityId: 'eval-suite',
        summary: `Ran ${evalCases.length} demo AI evaluation cases`,
      })
      return { evalCases }
    }),

  previewAnswer: (question) => {
    const state = get()
    return previewAdminChatAnswer(question, state.businesses, state.knowledge)
  },

  getActiveAdmin: () => {
    const state = get()
    return state.administrators.find((admin) => admin.id === state.activeAdminId)
  },
}))
