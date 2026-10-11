import { formatPriceFrom, formatPriceRange } from '@/lib/formatters'
import type { Business } from '@/types/business'
import type { ChatContext, ChatIntent, ChatResponse } from '@/types/chatbot'

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function tokenize(value: string): string[] {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'with', 'what', 'where', 'which', 'who', 'how',
  'can', 'you', 'about', 'this', 'that', 'from', 'have', 'has', 'does', 'do',
  'is', 'in', 'on', 'of', 'to', 'a', 'an', 'me', 'my', 'any', 'available',
  'listed', 'listing', 'business', 'businesses', 'find', 'show', 'tell',
])

function scoreBusiness(business: Business, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const fields = [
    business.name,
    business.category,
    business.parish,
    business.locationLabel,
    business.shortDescription,
    business.description,
    ...business.tags,
    ...business.services,
    ...business.amenities,
  ].map(normalize)

  let score = 0
  for (const token of tokens) {
    for (const field of fields) {
      if (field.includes(token)) score += field === normalize(business.name) ? 5 : 1
    }
  }
  return score
}

function toReference(business: Business) {
  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    parish: business.parish,
    category: business.category,
  }
}

function detectIntent(message: string): ChatIntent {
  const q = normalize(message)
  if (/(phone|email|website|address|hours|opening|contact|pickup|airport pickup)/.test(q)) {
    return 'missing_info'
  }
  if (/(where|located|location|parish|near|in )/.test(q)) return 'location'
  if (/(price|cost|how much|budget)/.test(q)) return 'price'
  if (/(service|offer|provide|amenities|family|outdoor|snorkel|transfer|tour)/.test(q)) {
    return 'service'
  }
  if (/(restaurant|hotel|tour|beach|transport|shopping|culture|water)/.test(q)) {
    return 'category'
  }
  if (/(which|find|show|recommend|looking for)/.test(q)) return 'discovery'
  return 'business_detail'
}

function findBusinessByName(businesses: Business[], message: string, context?: ChatContext): Business | undefined {
  if (context?.businessSlug) {
    const contextual = businesses.find((item) => item.slug === context.businessSlug)
    if (contextual) return contextual
  }

  const normalizedMessage = normalize(message)
  return businesses.find((business) => normalizedMessage.includes(normalize(business.name)))
}

function retrieveMatches(businesses: Business[], message: string, limit = 5): Business[] {
  const tokens = tokenize(message)
  return businesses
    .map((business) => ({ business, score: scoreBusiness(business, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.business)
}

function answerMissingField(business: Business, message: string): ChatResponse | null {
  const q = normalize(message)

  if (/(phone|call|telephone)/.test(q)) {
    if (business.phone) {
      return {
        message: `${business.name} lists this demo phone number: ${business.phone}.`,
        references: [toReference(business)],
        matchedBusinesses: [business],
        intent: 'business_detail',
      }
    }
    return {
      message: `I couldn’t find a phone number in this business listing. You can review the available details on its profile.`,
      references: [toReference(business)],
      matchedBusinesses: [business],
      intent: 'missing_info',
    }
  }

  if (/website/.test(q)) {
    if (business.website) {
      return {
        message: `${business.name} lists this demo website: ${business.website}.`,
        references: [toReference(business)],
        matchedBusinesses: [business],
        intent: 'business_detail',
      }
    }
    return {
      message: `The available listing does not include a website for ${business.name}.`,
      references: [toReference(business)],
      matchedBusinesses: [business],
      intent: 'missing_info',
    }
  }

  if (/(opening hours|hours|open)/.test(q)) {
    if (business.openingHours?.length) {
      const hours = business.openingHours.map((item) => `${item.day}: ${item.hours}`).join('; ')
      return {
        message: `${business.name} lists these demo opening hours: ${hours}.`,
        references: [toReference(business)],
        matchedBusinesses: [business],
        intent: 'business_detail',
      }
    }
    return {
      message: `The available listing does not include opening hours for ${business.name}.`,
      references: [toReference(business)],
      matchedBusinesses: [business],
      intent: 'missing_info',
    }
  }

  if (/(airport pickup|airport transfer|pickup)/.test(q)) {
    const mentionsAirport = [...business.services, ...business.tags, business.description]
      .some((field) => normalize(field).includes('airport'))
    if (mentionsAirport) {
      return {
        message: `${business.name} mentions airport-related services in its demo listing: ${business.services.join(', ')}.`,
        references: [toReference(business)],
        matchedBusinesses: [business],
        intent: 'service',
      }
    }
    return {
      message: `The available listing does not confirm whether airport pickup is offered.`,
      references: [toReference(business)],
      matchedBusinesses: [business],
      intent: 'missing_info',
    }
  }

  return null
}

function summarizeBusiness(business: Business): string {
  const parts = [
    `${business.name} is listed in ${business.locationLabel}, ${business.parish}.`,
    `Category: ${business.category}.`,
    `Demo summary: ${business.shortDescription}`,
  ]
  if (business.services.length) {
    parts.push(`Listed services include ${business.services.slice(0, 4).join(', ')}.`)
  }
  if (business.priceRange) {
    parts.push(`Price indicator: ${formatPriceRange(business.priceRange)}${business.priceFrom !== undefined ? ` (${formatPriceFrom(business.priceFrom, business.currency)})` : ''}.`)
  }
  parts.push('Open the listing to review the available details.')
  return parts.join(' ')
}

export function generateChatResponse(
  message: string,
  businesses: Business[],
  context?: ChatContext,
): ChatResponse {
  const trimmed = message.trim()
  if (!trimmed) {
    return {
      message: 'Please enter a question about Barbados listings in this demo directory.',
      references: [],
      matchedBusinesses: [],
      intent: 'clarification',
    }
  }

  const intent = detectIntent(trimmed)
  const namedBusiness = findBusinessByName(businesses, trimmed, context)

  if (namedBusiness) {
    const missing = answerMissingField(namedBusiness, trimmed)
    if (missing) return missing

    if (intent === 'location' || /where|located|location|parish/.test(normalize(trimmed))) {
      return {
        message: `${namedBusiness.name} is currently listed in ${namedBusiness.locationLabel}, ${namedBusiness.parish}${namedBusiness.address ? ` (${namedBusiness.address})` : ''}.`,
        references: [toReference(namedBusiness)],
        matchedBusinesses: [namedBusiness],
        intent: 'location',
      }
    }

    if (intent === 'price') {
      if (!namedBusiness.priceRange && namedBusiness.priceFrom === undefined) {
        return {
          message: `The available listing does not include price information for ${namedBusiness.name}.`,
          references: [toReference(namedBusiness)],
          matchedBusinesses: [namedBusiness],
          intent: 'missing_info',
        }
      }
      return {
        message: `${namedBusiness.name} lists ${formatPriceRange(namedBusiness.priceRange)}${namedBusiness.priceFrom !== undefined ? ` and ${formatPriceFrom(namedBusiness.priceFrom, namedBusiness.currency)}` : ''} in this demo directory.`,
        references: [toReference(namedBusiness)],
        matchedBusinesses: [namedBusiness],
        intent: 'price',
      }
    }

    if (intent === 'service' || /service|offer|family|outdoor/.test(normalize(trimmed))) {
      const familyNote = namedBusiness.familyFriendly === undefined
        ? 'Family suitability is not specified in the listing.'
        : namedBusiness.familyFriendly
          ? 'The listing marks this business as family-friendly.'
          : 'The listing does not mark this business as family-friendly.'
      return {
        message: `${namedBusiness.name} lists these services: ${namedBusiness.services.join(', ') || 'none listed'}. ${familyNote}`,
        references: [toReference(namedBusiness)],
        matchedBusinesses: [namedBusiness],
        intent: 'service',
      }
    }

    return {
      message: summarizeBusiness(namedBusiness),
      references: [toReference(namedBusiness)],
      matchedBusinesses: [namedBusiness],
      intent: 'business_detail',
    }
  }

  const matches = retrieveMatches(businesses, trimmed)

  if (matches.length === 0) {
    if (tokenize(trimmed).length < 2) {
      return {
        message: 'Could you share a category, parish, or business name? For example: snorkeling in Speightstown, restaurants in Holetown, or airport transfers.',
        references: [],
        matchedBusinesses: [],
        intent: 'clarification',
      }
    }
    return {
      message: 'I could not find matching information in the current demo directory data. Try a different keyword, browse the directory, or ask about a specific listing name.',
      references: [],
      matchedBusinesses: [],
      intent: 'fallback',
    }
  }

  if (/family/.test(normalize(trimmed))) {
    const familyMatches = matches.filter((item) => item.familyFriendly)
    const list = (familyMatches.length ? familyMatches : matches).slice(0, 4)
    return {
      message: `Here are demo listings that match your family-friendly search: ${list.map((item) => `${item.name} (${item.locationLabel})`).join('; ')}. Open a listing to review the available details.`,
      references: list.map(toReference),
      matchedBusinesses: list,
      intent: 'discovery',
    }
  }

  if (intent === 'location' && matches.length > 1 && !/holetown|speightstown|bridgetown|oistins|christ church|st\.? /.test(normalize(trimmed))) {
    return {
      message: 'I found several matching listings. Which parish or coastal area should I focus on?',
      references: matches.slice(0, 3).map(toReference),
      matchedBusinesses: matches.slice(0, 3),
      intent: 'clarification',
    }
  }

  const top = matches.slice(0, 4)
  const lines = top.map((item) => {
    const serviceHint = item.services[0] ? ` Its demo listing describes ${item.services[0].toLowerCase()}.` : ''
    return `${item.name} is listed in ${item.locationLabel}.${serviceHint}`
  })

  return {
    message: `${lines.join(' ')} Open a listing to review the available details.`,
    references: top.map(toReference),
    matchedBusinesses: top,
    intent: intent === 'missing_info' ? 'discovery' : intent,
  }
}
