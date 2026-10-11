import type { AdminRole } from '@/config/site'

export type AccountStatus = 'active' | 'restricted' | 'suspended' | 'invited'
export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'in_review'
  | 'changes_requested'
  | 'published'
  | 'rejected'
  | 'suspended'
  | 'archived'

export type ReviewStatus = 'published' | 'hidden' | 'flagged'
export type ReportStatus = 'new' | 'under_review' | 'resolved' | 'dismissed'
export type PromoStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected'
  | 'cancelled'

export type DemoIndexStatus = 'pending' | 'indexed_demo' | 'failed_demo' | 'out_of_date_demo'
export type EvalStatus = 'pass_demo' | 'needs_review' | 'fail_demo'
export type ConversationReviewStatus = 'open' | 'flagged' | 'reviewed'

export interface Administrator {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AccountStatus
  createdAt: string
  lastActivityAt: string
}

export interface BusinessOwner {
  id: string
  name: string
  email: string
  status: AccountStatus
  businessIds: string[]
  createdAt: string
  lastActivityAt: string
  notes?: string
}

export interface BusinessService {
  id: string
  name: string
  description: string
  priceLabel?: string
  priceFrom?: number
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
  isCover?: boolean
}

export interface Business {
  id: string
  ownerId: string
  name: string
  slug: string
  category: string
  categoryId: string
  shortDescription: string
  description: string
  parish: string
  locationLabel: string
  address?: string
  email?: string
  phone?: string
  website?: string
  services: BusinessService[]
  amenities: string[]
  languages: string[]
  gallery: GalleryImage[]
  coverImage?: string
  status: ListingStatus
  featured: boolean
  sponsored: boolean
  completionPercentage: number
  createdAt: string
  updatedAt: string
  demoRecord: true
}

export interface ListingReview {
  id: string
  businessId: string
  submittedAt: string
  reviewStatus: ListingStatus
  reviewerId?: string
  reviewNotes?: string
  changeRequests?: string
  decisionAt?: string
  version: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  coverImage: string
  active: boolean
  displayOrder: number
}

export interface LocationRecord {
  id: string
  name: string
  slug: string
  description: string
  image: string
  active: boolean
  displayOrder: number
}

export interface Review {
  id: string
  businessId: string
  visitorName: string
  rating: number
  title: string
  body: string
  createdAt: string
  status: ReviewStatus
  ownerReply?: string
  moderationNote?: string
}

export interface Report {
  id: string
  entityType: 'business' | 'review' | 'promotion' | 'other'
  entityId: string
  reportType:
    | 'incorrect_information'
    | 'spam'
    | 'inappropriate_content'
    | 'impersonation'
    | 'misleading_advertising'
    | 'incorrect_contact'
    | 'other'
  reason: string
  status: ReportStatus
  assignedAdminId?: string
  resolutionNotes?: string
  createdAt: string
}

export interface KnowledgeRecord {
  id: string
  sourceType: 'business_listing' | 'business_service' | 'business_faq' | 'manual_tourism' | 'approved_website'
  sourceId: string
  businessId?: string
  title: string
  content: string
  visibility: 'public' | 'hidden' | 'draft'
  demoIndexStatus: DemoIndexStatus
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ChatConversation {
  id: string
  createdAt: string
  messages: ChatMessage[]
  referencedBusinessIds: string[]
  hasFallback: boolean
  reviewStatus: ConversationReviewStatus
  categoryHint?: string
  internalNote?: string
}

export interface Promotion {
  id: string
  businessId: string
  ownerId: string
  name: string
  placement: string
  description: string
  startDate: string
  endDate: string
  budget?: number
  status: PromoStatus
  updatedAt: string
  demoImpressions?: number
  demoClicks?: number
}

export interface PlacementConfig {
  id: string
  name: string
  description: string
  placementType: string
  maxCampaigns: number
  durationOptions: string
  eligibility: string
  active: boolean
}

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  role: AdminRole
  action: string
  entityType: string
  entityId: string
  summary: string
  previousState?: string
  newState?: string
  createdAt: string
}

export interface NotificationItem {
  id: string
  type:
    | 'listing_moderation'
    | 'owner_account'
    | 'advertising'
    | 'ai_knowledge'
    | 'report'
    | 'announcement'
  title: string
  message: string
  read: boolean
  createdAt: string
  href?: string
}

export interface AnalyticsPoint {
  date: string
  newListings: number
  listingViews: number
  searches: number
  ownerRegistrations: number
  aiConversations: number
  fallbacks: number
}

export interface EvalCase {
  id: string
  question: string
  expectedSource: string
  expectedBehavior: string
  actualAnswer?: string
  status: EvalStatus
  reviewerNotes?: string
}

export interface ChatbotSettings {
  displayName: string
  welcomeMessage: string
  languages: string[]
  suggestedQuestions: string[]
  responseStyle: 'concise' | 'balanced' | 'detailed'
  maxResults: number
  fallbackMessage: string
  escalationGuidance: string
  visibleOnPublicSite: boolean
  useRetrievedBusinessInfo: boolean
  showListingReferences: boolean
  preferSourceBackedAnswers: boolean
  avoidGuessingContact: boolean
  distinguishNotListed: boolean
  clarifyAmbiguous: boolean
}

export interface PlatformSettings {
  displayName: string
  publicSiteUrl: string
  supportContact: string
  timezone: string
  defaultLanguage: string
  maintenanceMode: boolean
  moderationRequired: boolean
  defaultListingVisibility: 'pending_review' | 'draft'
  sponsoredLabel: string
  campaignReviewRequired: boolean
}

export interface IntegrationStatus {
  id: string
  name: string
  purpose: string
  status: 'not_configured' | 'demo_ready' | 'future'
  lastCheckedAt: string
  guidance: string
}
