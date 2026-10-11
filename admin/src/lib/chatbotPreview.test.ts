import { describe, expect, it } from 'vitest'
import { mockBusinesses } from '@/data/mockBusinesses'
import { mockKnowledge } from '@/data/mockSeedExtras'
import { getActivePublishedBusinesses, previewAdminChatAnswer } from '@/lib/chatbotPreview'

describe('chatbot preview grounding', () => {
  it('excludes non-published listings from active results', () => {
    const active = getActivePublishedBusinesses(mockBusinesses)
    expect(active.every((business) => business.status === 'published')).toBe(true)
    expect(active.some((business) => business.status === 'suspended')).toBe(false)
  })

  it('returns grounded answers for published snorkeling listings', () => {
    const result = previewAdminChatAnswer(
      'Which businesses offer snorkeling experiences?',
      mockBusinesses,
      mockKnowledge,
    )
    expect(result.hasFallback).toBe(false)
    expect(result.referencedBusinessIds.length).toBeGreaterThan(0)
  })

  it('falls back when phone information is missing', () => {
    const result = previewAdminChatAnswer(
      'What is the exact phone number of Island Roots Food Experiences?',
      mockBusinesses,
      mockKnowledge,
    )
    expect(result.hasFallback).toBe(true)
  })

  it('does not treat suspended listings as active published results', () => {
    const suspended = mockBusinesses.find((business) => business.status === 'suspended')
    expect(suspended).toBeTruthy()
    const result = previewAdminChatAnswer(
      `Does ${suspended!.name} provide airport pickup?`,
      mockBusinesses,
      mockKnowledge,
    )
    expect(result.referencedBusinessIds.includes(suspended!.id)).toBe(false)
  })
})
