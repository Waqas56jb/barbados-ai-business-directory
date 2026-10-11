import type { Business } from './business'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  references?: ChatBusinessReference[]
  isError?: boolean
}

export interface ChatBusinessReference {
  id: string
  slug: string
  name: string
  parish: string
  category: string
}

export interface ChatContext {
  businessSlug?: string
  businessName?: string
  prefillQuestion?: string
}

export interface ChatRequest {
  message: string
  context?: ChatContext
  conversationId?: string
}

export interface ChatResponse {
  message: string
  references: ChatBusinessReference[]
  matchedBusinesses: Business[]
  intent: ChatIntent
}

export type ChatIntent =
  | 'discovery'
  | 'location'
  | 'service'
  | 'category'
  | 'price'
  | 'business_detail'
  | 'missing_info'
  | 'clarification'
  | 'fallback'
