import type { Business, KnowledgeRecord } from '@/types'

function normalize(value: string) {
  return value.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function getActivePublishedBusinesses(businesses: Business[]): Business[] {
  return businesses.filter((business) => business.status === 'published')
}

export function previewAdminChatAnswer(
  question: string,
  businesses: Business[],
  knowledge: KnowledgeRecord[],
): { answer: string; referencedBusinessIds: string[]; hasFallback: boolean } {
  const q = normalize(question)
  const active = getActivePublishedBusinesses(businesses)

  if (!q) {
    return {
      answer: 'Enter a question to preview grounded demo answers.',
      referencedBusinessIds: [],
      hasFallback: true,
    }
  }

  const faqHit = knowledge.find(
    (record) =>
      record.sourceType === 'business_faq' &&
      record.visibility === 'public' &&
      (normalize(record.title).includes(q) ||
        q.split(' ').some((token) => token.length > 3 && normalize(record.title).includes(token))),
  )
  if (faqHit) {
    return {
      answer: faqHit.content,
      referencedBusinessIds: faqHit.businessId ? [faqHit.businessId] : [],
      hasFallback: false,
    }
  }

  const matches = active
    .map((business) => {
      const haystack = normalize(
        [
          business.name,
          business.category,
          business.parish,
          business.locationLabel,
          business.description,
          ...business.services.map((service) => `${service.name} ${service.description}`),
          ...business.amenities,
        ].join(' '),
      )
      const score = q.split(' ').filter((token) => token.length > 2 && haystack.includes(token)).length
      return { business, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  if (/(phone|telephone)/.test(q)) {
    const named = active.find((business) => q.includes(normalize(business.name))) ?? matches[0]?.business
    if (!named?.phone) {
      return {
        answer: 'I couldn’t find a phone number in the current published listing data. Missing information is not treated as confirmation that the business has no phone number.',
        referencedBusinessIds: named ? [named.id] : [],
        hasFallback: true,
      }
    }
    return {
      answer: `${named.name} lists this demo phone number: ${named.phone}.`,
      referencedBusinessIds: [named.id],
      hasFallback: false,
    }
  }

  if (/(where|located|location|parish)/.test(q)) {
    const named = active.find((business) => q.includes(normalize(business.name))) ?? matches[0]?.business
    if (!named) {
      return {
        answer: 'I could not find a matching published listing for that location question in the demo directory.',
        referencedBusinessIds: [],
        hasFallback: true,
      }
    }
    return {
      answer: `${named.name} is listed in ${named.locationLabel}, ${named.parish}.`,
      referencedBusinessIds: [named.id],
      hasFallback: false,
    }
  }

  if (matches.length === 0) {
    return {
      answer: 'I could not find matching information in the current published demo directory data. Try another keyword or review the knowledge base.',
      referencedBusinessIds: [],
      hasFallback: true,
    }
  }

  const top = matches.slice(0, 3).map((entry) => entry.business)
  return {
    answer: `Based on published demo listings: ${top
      .map((business) => `${business.name} (${business.locationLabel})`)
      .join('; ')}. Open a listing to review available details.`,
    referencedBusinessIds: top.map((business) => business.id),
    hasFallback: false,
  }
}
