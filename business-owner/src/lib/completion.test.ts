import { describe, expect, it } from 'vitest'
import { mockBusinesses } from '@/data/mockBusinesses'
import { calculateCompletion } from '@/lib/completion'

describe('business completion', () => {
  it('scores a complete published business highly', () => {
    const score = calculateCompletion(mockBusinesses[0]!)
    expect(score).toBeGreaterThan(80)
  })

  it('drops when key fields are removed', () => {
    const incomplete = {
      ...mockBusinesses[0]!,
      description: '',
      services: [],
      gallery: [],
      coverImage: undefined,
      email: undefined,
      phone: undefined,
      website: undefined,
    }
    const score = calculateCompletion(incomplete)
    expect(score).toBeLessThan(70)
    expect(score).toBeLessThan(calculateCompletion(mockBusinesses[0]!))
  })
})
