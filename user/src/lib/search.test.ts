import { describe, expect, it } from 'vitest'
import { seedBusinesses } from '@/data/businesses'
import { filterBusinesses, searchBusinesses, sortBusinesses } from '@/lib/search'

describe('search and filtering', () => {
  it('finds snorkeling businesses by keyword', () => {
    const results = filterBusinesses(seedBusinesses, { q: 'snorkeling' })
    expect(results.some((item) => item.slug === 'blue-horizon-snorkeling')).toBe(true)
  })

  it('filters by category and parish together', () => {
    const results = filterBusinesses(seedBusinesses, {
      category: 'restaurants-cafes',
      parish: 'st-james',
    })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((item) => item.categorySlug === 'restaurants-cafes')).toBe(true)
    expect(results.every((item) => item.parishSlug === 'st-james')).toBe(true)
  })

  it('sorts featured first', () => {
    const sorted = sortBusinesses(seedBusinesses, 'featured')
    expect(sorted[0]?.featured).toBe(true)
  })

  it('paginates search results', () => {
    const page = searchBusinesses(seedBusinesses, {}, 'name-asc', 1, 5)
    expect(page.items).toHaveLength(5)
    expect(page.total).toBe(seedBusinesses.length)
    expect(page.pageCount).toBeGreaterThan(1)
  })
})
