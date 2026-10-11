import { describe, expect, it } from 'vitest'
import { seedBusinesses } from '@/data/businesses'
import { generateChatResponse } from '@/lib/chatbot-retrieval'
import type { Business } from '@/types/business'

describe('chatbot retrieval', () => {
  it('returns grounded snorkeling matches from the dataset', () => {
    const response = generateChatResponse('Which businesses offer snorkeling experiences?', seedBusinesses)
    expect(response.matchedBusinesses.some((item) => item.slug === 'blue-horizon-snorkeling')).toBe(true)
    expect(response.message.toLowerCase()).toContain('blue horizon snorkeling')
  })

  it('reads the current location from shared listing data', () => {
    const updated: Business[] = seedBusinesses.map((business) =>
      business.slug === 'coral-breeze-catamaran-tours'
        ? { ...business, locationLabel: 'Holetown', parish: 'St. James' }
        : business,
    )
    const response = generateChatResponse('Where is Coral Breeze Catamaran Tours located?', updated)
    expect(response.message).toContain('Holetown')
    expect(response.message).toContain('St. James')
  })

  it('does not invent a missing phone number', () => {
    const business = seedBusinesses.find((item) => item.slug === 'island-roots-food-experiences')!
    expect(business.phone).toBeUndefined()
    const response = generateChatResponse(
      'What is the exact phone number of Island Roots Food Experiences?',
      seedBusinesses,
    )
    expect(response.intent).toBe('missing_info')
    expect(response.message.toLowerCase()).toContain('couldn’t find a phone number')
  })

  it('distinguishes unlisted airport pickup from confirmed denial', () => {
    const response = generateChatResponse(
      'Does Ocean Pearl Beach Lounge provide airport pickup?',
      seedBusinesses,
      { businessSlug: 'ocean-pearl-beach-lounge' },
    )
    expect(response.message).toContain('does not confirm whether airport pickup is offered')
  })
})
