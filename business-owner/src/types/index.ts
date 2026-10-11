export type BusinessStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'changes_requested'
  | 'rejected'
  | 'suspended'
  | 'archived'

export type PromotionStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'rejected'
  | 'paused'

export type InquiryStatus = 'unread' | 'read' | 'responded' | 'archived'
export type FaqVisibility = 'public' | 'draft' | 'hidden'
export type ReviewStatus = 'published' | 'flagged'

export interface Owner {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  preferredLanguage: string
}

export interface OpeningInterval {
  open: string
  close: string
}

export interface OpeningHoursDay {
  day: string
  status: 'open' | 'closed' | 'unspecified'
  intervals: OpeningInterval[]
}

export interface BusinessService {
  id: string
  name: string
  description: string
  category?: string
  priceLabel?: string
  priceFrom?: number
  duration?: string
  availability?: string
  ageSuitability?: string
  familyFriendly?: boolean
  bookingUrl?: string
  businessIds: string[]
}

export interface GalleryImage {
  id: string
  url: string
  caption?: string
  alt: string
  isCover?: boolean
  order: number
}

export interface Business {
  id: string
  ownerId: string
  name: string
  slug: string
  category: string
  secondaryCategories: string[]
  shortDescription: string
  description: string
  establishedYear?: number
  logoUrl?: string
  parish: string
  locationLabel: string
  address?: string
  locationDescription?: string
  email?: string
  phone?: string
  website?: string
  whatsapp?: string
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp' | 'website'
  services: BusinessService[]
  openingHours: OpeningHoursDay[]
  amenities: string[]
  languages: string[]
  socialLinks: { label: string; url: string }[]
  gallery: GalleryImage[]
  coverImage?: string
  status: BusinessStatus
  completionPercentage: number
  createdAt: string
  updatedAt: string
}

export interface Listing {
  id: string
  businessId: string
  title: string
  status: BusinessStatus
  featured: boolean
  publishedAt?: string
  lastUpdated: string
  completionScore: number
}

export interface FAQ {
  id: string
  businessId: string
  question: string
  answer: string
  visibility: FaqVisibility
  updatedAt: string
}

export interface Promotion {
  id: string
  businessId: string
  name: string
  placement: string
  description: string
  startDate: string
  endDate: string
  budget?: number
  targetCategory?: string
  targetParish?: string
  imageUrl?: string
  status: PromotionStatus
  demoImpressions?: number
  demoClicks?: number
  createdAt: string
}

export interface Inquiry {
  id: string
  businessId: string
  visitorName: string
  visitorEmail: string
  subject: string
  message: string
  status: InquiryStatus
  internalNotes?: string
  createdAt: string
}

export interface NotificationItem {
  id: string
  type:
    | 'listing_changes_requested'
    | 'listing_approved'
    | 'new_inquiry'
    | 'promotion_reviewed'
    | 'profile_incomplete'
    | 'ai_knowledge_updated'
  title: string
  message: string
  read: boolean
  createdAt: string
  href?: string
}

export interface AnalyticsPoint {
  businessId: string
  date: string
  views: number
  searchAppearances: number
  clicks: number
  websiteClicks: number
  contactClicks: number
  inquiries: number
  favorites: number
  promoImpressions?: number
  promoClicks?: number
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
  ownerRepliedAt?: string
}

export interface ActivityItem {
  id: string
  businessId?: string
  title: string
  description: string
  createdAt: string
  type: 'profile' | 'listing' | 'media' | 'promotion' | 'review' | 'system'
}

export interface OwnerSettings {
  listingStatusNotifications: boolean
  inquiryNotifications: boolean
  advertisingUpdates: boolean
  productAnnouncements: boolean
  compactTables: boolean
  language: string
  theme: 'light' | 'system'
}

export interface HelpArticle {
  id: string
  title: string
  category: string
  summary: string
  body: string
  tags: string[]
}
