import { mockBusinesses } from '@/data/mockBusinesses'
import type {
  AnalyticsPoint,
  AuditLog,
  ChatbotSettings,
  ChatConversation,
  EvalCase,
  IntegrationStatus,
  KnowledgeRecord,
  ListingReview,
  NotificationItem,
  PlacementConfig,
  PlatformSettings,
  Promotion,
  Report,
  Review,
} from '@/types'

export const mockListingReviews: ListingReview[] = mockBusinesses
  .filter((business) =>
    ['pending_review', 'in_review', 'changes_requested', 'rejected', 'published'].includes(business.status),
  )
  .map((business, index) => ({
    id: `revw-${business.id}`,
    businessId: business.id,
    submittedAt: business.updatedAt,
    reviewStatus: business.status,
    reviewerId: business.status === 'pending_review' ? undefined : 'adm-002',
    reviewNotes:
      business.status === 'changes_requested'
        ? 'Please clarify opening hours and add a cover caption.'
        : business.status === 'rejected'
          ? 'Demo rejection: incomplete service details.'
          : undefined,
    changeRequests:
      business.status === 'changes_requested'
        ? 'Add clearer contact details and confirm parish consistency.'
        : undefined,
    decisionAt: ['published', 'rejected', 'changes_requested'].includes(business.status)
      ? business.updatedAt
      : undefined,
    version: 1 + (index % 3),
  }))

export const mockReviews: Review[] = [
  {
    id: 'urev-001',
    businessId: 'biz-001',
    visitorName: 'Priya N.',
    rating: 5,
    title: 'Beautiful coastal morning',
    body: 'Demo review for Coral Breeze describing a family-friendly fictional cruise.',
    createdAt: '2026-09-28T14:00:00.000Z',
    status: 'published',
    ownerReply: 'Thank you for the kind demo feedback!',
  },
  {
    id: 'urev-002',
    businessId: 'biz-004',
    visitorName: 'Ethan R.',
    rating: 4,
    title: 'Clear reef swim notes',
    body: 'Demo review highlighting snorkeling services from the sample listing.',
    createdAt: '2026-10-02T16:20:00.000Z',
    status: 'published',
  },
  {
    id: 'urev-003',
    businessId: 'biz-002',
    visitorName: 'Lucia M.',
    rating: 5,
    title: 'Sunset lounge atmosphere',
    body: 'Demo review for coastal dining near Holetown.',
    createdAt: '2026-10-05T19:10:00.000Z',
    status: 'flagged',
    moderationNote: 'Flagged for tone review in the demo queue.',
  },
  {
    id: 'urev-004',
    businessId: 'biz-006',
    visitorName: 'Noah S.',
    rating: 3,
    title: 'Food walk timing question',
    body: 'Demo review asking for clearer start-time details.',
    createdAt: '2026-10-06T08:45:00.000Z',
    status: 'hidden',
  },
]

export const mockReports: Report[] = [
  {
    id: 'rpt-001',
    entityType: 'business',
    entityId: 'biz-010',
    reportType: 'incorrect_information',
    reason: 'Demo report: contact details appear incomplete.',
    status: 'new',
    createdAt: '2026-10-09T10:00:00.000Z',
  },
  {
    id: 'rpt-002',
    entityType: 'review',
    entityId: 'urev-003',
    reportType: 'inappropriate_content',
    reason: 'Demo report requesting a tone check on a flagged review.',
    status: 'under_review',
    assignedAdminId: 'adm-005',
    createdAt: '2026-10-08T12:00:00.000Z',
  },
  {
    id: 'rpt-003',
    entityType: 'promotion',
    entityId: 'promo-002',
    reportType: 'misleading_advertising',
    reason: 'Demo report: sponsored claim needs clearer labeling review.',
    status: 'resolved',
    assignedAdminId: 'adm-003',
    resolutionNotes: 'Confirmed sponsored label is present in demo preview.',
    createdAt: '2026-10-04T09:00:00.000Z',
  },
]

export const mockKnowledge: KnowledgeRecord[] = [
  ...mockBusinesses
    .filter((business) => business.status === 'published')
    .slice(0, 10)
    .map((business) => ({
      id: `know-${business.id}`,
      sourceType: 'business_listing' as const,
      sourceId: business.id,
      businessId: business.id,
      title: business.name,
      content: `${business.name}. ${business.description} Services: ${business.services
        .map((service) => service.name)
        .join(', ')}. Location: ${business.locationLabel}, ${business.parish}.`,
      visibility: 'public' as const,
      demoIndexStatus: 'indexed_demo' as const,
      updatedAt: business.updatedAt,
    })),
  {
    id: 'know-faq-001',
    sourceType: 'business_faq',
    sourceId: 'faq-001',
    businessId: 'biz-001',
    title: 'Do you provide life jackets?',
    content: 'Yes. The demo listing states that life jackets are provided for guests on catamaran cruises.',
    visibility: 'public',
    demoIndexStatus: 'indexed_demo',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'know-faq-002',
    sourceType: 'business_faq',
    sourceId: 'faq-002',
    businessId: 'biz-004',
    title: 'Is snorkeling beginner-friendly?',
    content: 'Blue Horizon Snorkeling lists beginner guidance and gear rental in the demo profile.',
    visibility: 'public',
    demoIndexStatus: 'indexed_demo',
    updatedAt: '2026-09-22T12:00:00.000Z',
  },
  {
    id: 'know-manual-001',
    sourceType: 'manual_tourism',
    sourceId: 'manual-001',
    title: 'West Coast Discovery Notes',
    content: 'Manually curated fictional notes about west-coast dining and coastal walks for demo retrieval.',
    visibility: 'public',
    demoIndexStatus: 'pending',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'know-web-001',
    sourceType: 'approved_website',
    sourceId: 'web-001',
    businessId: 'biz-001',
    title: 'Approved website excerpt (future)',
    content: 'Placeholder for future approved website content. Scraping is not implemented in this frontend.',
    visibility: 'draft',
    demoIndexStatus: 'out_of_date_demo',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
]

export const mockConversations: ChatConversation[] = [
  {
    id: 'conv-001',
    createdAt: '2026-10-10T09:20:00.000Z',
    referencedBusinessIds: ['biz-004'],
    hasFallback: false,
    reviewStatus: 'open',
    categoryHint: 'Water Sports',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Which businesses offer snorkeling experiences?',
        createdAt: '2026-10-10T09:20:00.000Z',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'Blue Horizon Snorkeling is listed in Speightstown and describes snorkeling experiences.',
        createdAt: '2026-10-10T09:20:08.000Z',
      },
    ],
  },
  {
    id: 'conv-002',
    createdAt: '2026-10-09T15:10:00.000Z',
    referencedBusinessIds: ['biz-002'],
    hasFallback: true,
    reviewStatus: 'flagged',
    categoryHint: 'Restaurants & Cafés',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'What is the exact phone number of Ocean Pearl Beach Lounge?',
        createdAt: '2026-10-09T15:10:00.000Z',
      },
      {
        id: 'm4',
        role: 'assistant',
        content: 'Ocean Pearl Beach Lounge lists +1-246-555-0142 in the demo profile.',
        createdAt: '2026-10-09T15:10:06.000Z',
      },
    ],
  },
  {
    id: 'conv-003',
    createdAt: '2026-10-08T11:00:00.000Z',
    referencedBusinessIds: [],
    hasFallback: true,
    reviewStatus: 'reviewed',
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: 'Can you book a table for me tonight?',
        createdAt: '2026-10-08T11:00:00.000Z',
      },
      {
        id: 'm6',
        role: 'assistant',
        content: 'I could not find booking-completion information in the current published demo directory data.',
        createdAt: '2026-10-08T11:00:05.000Z',
      },
    ],
  },
]

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-001',
    businessId: 'biz-001',
    ownerId: 'own-001',
    name: 'Autumn Coastal Featured Push',
    placement: 'homepage-featured',
    description: 'Homepage featured request for Coral Breeze.',
    startDate: '2026-10-01',
    endDate: '2026-10-21',
    budget: 450,
    status: 'active',
    updatedAt: '2026-09-25T10:00:00.000Z',
    demoImpressions: 1840,
    demoClicks: 212,
  },
  {
    id: 'promo-002',
    businessId: 'biz-002',
    ownerId: 'own-001',
    name: 'Holetown Dining Spotlight',
    placement: 'category-featured',
    description: 'Category placement for restaurants near Holetown.',
    startDate: '2026-10-15',
    endDate: '2026-11-05',
    budget: 300,
    status: 'pending_review',
    updatedAt: '2026-10-08T13:00:00.000Z',
  },
  {
    id: 'promo-003',
    businessId: 'biz-017',
    ownerId: 'own-001',
    name: 'Boutique Search Boost',
    placement: 'sponsored-search',
    description: 'Sponsored search request for Coral Street Boutique.',
    startDate: '2026-10-12',
    endDate: '2026-10-26',
    budget: 180,
    status: 'approved',
    updatedAt: '2026-10-09T09:00:00.000Z',
  },
]

export const mockPlacements: PlacementConfig[] = [
  {
    id: 'place-001',
    name: 'Homepage Featured Business',
    description: 'Feature selected businesses on the visitor homepage.',
    placementType: 'homepage-featured',
    maxCampaigns: 6,
    durationOptions: '7–14 days',
    eligibility: 'Published listings with complete cover image',
    active: true,
  },
  {
    id: 'place-002',
    name: 'Featured Directory Listing',
    description: 'Highlight listings near the top of filtered directory results.',
    placementType: 'featured-directory',
    maxCampaigns: 12,
    durationOptions: '7–30 days',
    eligibility: 'Published listings only',
    active: true,
  },
  {
    id: 'place-003',
    name: 'Featured Category Placement',
    description: 'Promote within a selected tourism category page.',
    placementType: 'category-featured',
    maxCampaigns: 8,
    durationOptions: '14–30 days',
    eligibility: 'Matching category + published status',
    active: true,
  },
  {
    id: 'place-004',
    name: 'Sponsored Search Placement',
    description: 'Clearly labeled sponsored results for relevant searches.',
    placementType: 'sponsored-search',
    maxCampaigns: 10,
    durationOptions: '7–21 days',
    eligibility: 'Published listings with services',
    active: true,
  },
  {
    id: 'place-005',
    name: 'Seasonal Tourism Promotion',
    description: 'Campaign-style placement for peak visitor periods.',
    placementType: 'seasonal',
    maxCampaigns: 4,
    durationOptions: '14–45 days',
    eligibility: 'Admin-reviewed seasonal campaigns',
    active: false,
  },
]

export const mockNotifications: NotificationItem[] = [
  {
    id: 'ntf-001',
    type: 'listing_moderation',
    title: 'New listing awaiting review',
    message: 'Ocean Pearl Beach Lounge is pending review.',
    read: false,
    createdAt: '2026-10-10T08:00:00.000Z',
    href: '/approvals?status=pending_review',
  },
  {
    id: 'ntf-002',
    type: 'advertising',
    title: 'Promotion request received',
    message: 'Holetown Dining Spotlight needs advertising review.',
    read: false,
    createdAt: '2026-10-09T13:10:00.000Z',
    href: '/advertising',
  },
  {
    id: 'ntf-003',
    type: 'report',
    title: 'New content report',
    message: 'A demo report was filed about incomplete contact details.',
    read: false,
    createdAt: '2026-10-09T10:05:00.000Z',
    href: '/reports',
  },
  {
    id: 'ntf-004',
    type: 'ai_knowledge',
    title: 'Knowledge preview outdated',
    message: 'An approved website excerpt is marked Out of Date (Demo).',
    read: true,
    createdAt: '2026-10-07T11:00:00.000Z',
    href: '/knowledge',
  },
  {
    id: 'ntf-005',
    type: 'announcement',
    title: 'Platform demo announcement',
    message: 'Reminder: all metrics and moderation actions are simulated.',
    read: true,
    createdAt: '2026-10-01T09:00:00.000Z',
  },
]

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-001',
    actorId: 'adm-002',
    actorName: 'Jordan Blake',
    role: 'listing_moderator',
    action: 'listing_approved',
    entityType: 'business',
    entityId: 'biz-001',
    summary: 'Approved Coral Breeze Catamaran Tours in demo moderation.',
    previousState: 'pending_review',
    newState: 'published',
    createdAt: '2026-08-15T12:05:00.000Z',
  },
  {
    id: 'aud-002',
    actorId: 'adm-003',
    actorName: 'Priya Shah',
    role: 'advertising_manager',
    action: 'promotion_approved',
    entityType: 'promotion',
    entityId: 'promo-003',
    summary: 'Approved Boutique Search Boost campaign request.',
    previousState: 'pending_review',
    newState: 'approved',
    createdAt: '2026-10-09T09:05:00.000Z',
  },
  {
    id: 'aud-003',
    actorId: 'adm-004',
    actorName: 'Sam Okonkwo',
    role: 'ai_manager',
    action: 'knowledge_refresh_simulated',
    entityType: 'knowledge',
    entityId: 'know-biz-004',
    summary: 'Simulated knowledge refresh for Blue Horizon Snorkeling.',
    previousState: 'pending',
    newState: 'indexed_demo',
    createdAt: '2026-10-08T10:00:00.000Z',
  },
]

function buildAnalytics(): AnalyticsPoint[] {
  const points: AnalyticsPoint[] = []
  const start = new Date('2026-07-14T00:00:00.000Z')
  for (let i = 0; i < 90; i += 1) {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + i)
    points.push({
      date: date.toISOString().slice(0, 10),
      newListings: 1 + (i % 3),
      listingViews: 120 + (i % 17) * 8,
      searches: 90 + (i % 13) * 6,
      ownerRegistrations: i % 5 === 0 ? 2 : 1,
      aiConversations: 40 + (i % 11) * 3,
      fallbacks: 4 + (i % 7),
    })
  }
  return points
}

export const mockAnalytics = buildAnalytics()

export const defaultChatbotSettings: ChatbotSettings = {
  displayName: 'Barbados AI Guide',
  welcomeMessage:
    'Hi, I’m the Barbados AI Guide. I answer using published directory information in this demo.',
  languages: ['English'],
  suggestedQuestions: [
    'Which businesses offer snorkeling experiences?',
    'What restaurants are listed in Holetown?',
    'Where can I find transportation services?',
    'Which listings mention family-friendly activities?',
    'What information is available about this tour?',
  ],
  responseStyle: 'balanced',
  maxResults: 5,
  fallbackMessage:
    'I could not find matching information in the current published demo directory data.',
  escalationGuidance: 'Review the listing profile or contact the business using listed details when available.',
  visibleOnPublicSite: true,
  useRetrievedBusinessInfo: true,
  showListingReferences: true,
  preferSourceBackedAnswers: true,
  avoidGuessingContact: true,
  distinguishNotListed: true,
  clarifyAmbiguous: true,
}

export const defaultPlatformSettings: PlatformSettings = {
  displayName: 'Barbados Explorer',
  publicSiteUrl: 'http://localhost:5173',
  supportContact: 'support@barbadosexplorer.demo',
  timezone: 'America/Barbados',
  defaultLanguage: 'English',
  maintenanceMode: false,
  moderationRequired: true,
  defaultListingVisibility: 'pending_review',
  sponsoredLabel: 'Sponsored',
  campaignReviewRequired: true,
}

export const mockIntegrations: IntegrationStatus[] = [
  {
    id: 'int-openai',
    name: 'OpenAI API',
    purpose: 'Future server-side generation for the tourism assistant.',
    status: 'future',
    lastCheckedAt: '2026-10-11T08:00:00.000Z',
    guidance: 'Configure only on the server. Never place API secrets in the admin frontend.',
  },
  {
    id: 'int-db',
    name: 'Business directory database',
    purpose: 'Persistent listings, owners, moderation, and audit data.',
    status: 'not_configured',
    lastCheckedAt: '2026-10-11T08:00:00.000Z',
    guidance: 'Will be provided by the future server/ database layer.',
  },
  {
    id: 'int-rag',
    name: 'RAG retrieval service',
    purpose: 'Embeddings, indexing, and grounded retrieval for chatbot answers.',
    status: 'demo_ready',
    lastCheckedAt: '2026-10-11T08:00:00.000Z',
    guidance: 'This admin panel currently simulates retrieval over local mock records.',
  },
  {
    id: 'int-storage',
    name: 'File storage',
    purpose: 'Business images and media hosting.',
    status: 'not_configured',
    lastCheckedAt: '2026-10-11T08:00:00.000Z',
    guidance: 'Image uploads remain local object-URL demos until server storage exists.',
  },
  {
    id: 'int-email',
    name: 'Email provider',
    purpose: 'Owner notifications and support messaging.',
    status: 'future',
    lastCheckedAt: '2026-10-11T08:00:00.000Z',
    guidance: 'No email delivery is performed from this frontend.',
  },
  {
    id: 'int-analytics',
    name: 'Analytics service',
    purpose: 'Search, listing views, and chatbot conversation analytics.',
    status: 'demo_ready',
    lastCheckedAt: '2026-10-11T08:00:00.000Z',
    guidance: 'Charts use fictional series for operational UI demonstrations.',
  },
]

export const mockEvalCases: EvalCase[] = [
  {
    id: 'eval-001',
    question: 'Which businesses offer snorkeling experiences?',
    expectedSource: 'Published water-sports listings',
    expectedBehavior: 'Return published snorkeling listings with references.',
    status: 'needs_review',
  },
  {
    id: 'eval-002',
    question: 'Where is Coral Breeze Catamaran Tours located?',
    expectedSource: 'Business listing location fields',
    expectedBehavior: 'Return Bridgetown / St. Michael from published data.',
    status: 'needs_review',
  },
  {
    id: 'eval-003',
    question: 'What is the exact phone number of Island Roots Food Experiences?',
    expectedSource: 'Contact fields',
    expectedBehavior: 'Fallback because phone is not listed.',
    status: 'needs_review',
  },
  {
    id: 'eval-004',
    question: 'Does Northern Light Café provide airport pickup?',
    expectedSource: 'Suspended listing should be excluded',
    expectedBehavior: 'Do not treat suspended listing as an active published result.',
    status: 'needs_review',
  },
  {
    id: 'eval-005',
    question: 'What restaurants are listed in Holetown?',
    expectedSource: 'Published restaurants in St. James / Holetown',
    expectedBehavior: 'Return matching published restaurant listings.',
    status: 'needs_review',
  },
]
