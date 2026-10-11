import { describe, expect, it } from 'vitest'
import { mockBusinesses } from '@/data/mockBusinesses'
import { mockFAQs } from '@/data/mockFAQs'
import { previewAnswer } from '@/lib/knowledgePreview'

describe('AI knowledge preview', () => {
  const business = mockBusinesses[0]!
  const faqs = mockFAQs.filter((item) => item.businessId === business.id)

  it('answers location from the current business profile', () => {
    const result = previewAnswer(business, faqs, 'Where is this business located?')
    expect(result.grounded).toBe(true)
    expect(result.answer).toContain('Bridgetown')
  })

  it('returns a missing-info fallback for absent phone numbers', () => {
    const withoutPhone = { ...business, phone: undefined }
    const result = previewAnswer(withoutPhone, faqs, 'What is the business telephone number?')
    expect(result.grounded).toBe(false)
    expect(result.answer).toContain('couldn’t find this information')
  })

  it('uses FAQ answers when available', () => {
    const result = previewAnswer(business, faqs, 'Do you provide life jackets?')
    expect(result.sources).toContain('FAQ')
    expect(result.answer.toLowerCase()).toContain('life jackets')
  })
})
