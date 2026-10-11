import type { Business, FAQ } from '@/types'

export interface KnowledgeAnswer {
  answer: string
  sources: string[]
  grounded: boolean
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function buildKnowledgeSources(business: Business, faqs: FAQ[]) {
  return [
    {
      type: 'Business description',
      available: Boolean(business.description.trim()),
      summary: business.shortDescription || 'Not provided',
    },
    {
      type: 'Services and experiences',
      available: business.services.length > 0,
      summary:
        business.services.length > 0
          ? business.services.map((service) => service.name).join(', ')
          : 'Not provided',
    },
    {
      type: 'Prices where available',
      available: business.services.some((service) => service.priceFrom !== undefined || service.priceLabel),
      summary:
        business.services
          .filter((service) => service.priceFrom !== undefined || service.priceLabel)
          .map((service) => `${service.name}: ${service.priceLabel ?? `from ${service.priceFrom}`}`)
          .join('; ') || 'Not provided',
    },
    {
      type: 'Location and contact details',
      available: Boolean(business.parish || business.email || business.phone || business.website),
      summary: [
        `${business.locationLabel}, ${business.parish}`,
        business.email ? `Email: ${business.email}` : null,
        business.phone ? `Phone: ${business.phone}` : null,
        business.website ? `Website: ${business.website}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    },
    {
      type: 'Opening hours',
      available: business.openingHours.some((day) => day.status !== 'unspecified'),
      summary: `${business.openingHours.filter((day) => day.status === 'open').length} open day(s) configured`,
    },
    {
      type: 'Amenities',
      available: business.amenities.length > 0,
      summary: business.amenities.join(', ') || 'Not provided',
    },
    {
      type: 'Frequently asked questions',
      available: faqs.length > 0,
      summary: `${faqs.length} FAQ(s) available`,
    },
    {
      type: 'Approved website information',
      available: false,
      summary: 'Future functionality — website scraping/indexing is not implemented in this frontend.',
    },
  ]
}

export function previewAnswer(business: Business, faqs: FAQ[], question: string): KnowledgeAnswer {
  const q = normalize(question)
  if (!q) {
    return {
      answer: 'Enter a question to preview how the demo assistant would respond from this profile.',
      sources: [],
      grounded: false,
    }
  }

  const faqMatch = faqs.find((item) => {
    const nq = normalize(item.question)
    return q.includes(nq) || nq.includes(q) || q.split(' ').some((token) => token.length > 3 && nq.includes(token))
  })
  if (faqMatch) {
    return {
      answer: faqMatch.answer,
      sources: ['FAQ'],
      grounded: true,
    }
  }

  if (/(where|located|location|parish|address)/.test(q)) {
    return {
      answer: `${business.name} is listed in ${business.locationLabel}, ${business.parish}${
        business.address ? ` (${business.address})` : ''
      }.`,
      sources: ['Location'],
      grounded: true,
    }
  }

  if (/(service|offer|experience|do you provide|available)/.test(q)) {
    if (business.services.length === 0) {
      return {
        answer: 'I couldn’t find this information in the current business profile.',
        sources: ['Services'],
        grounded: false,
      }
    }
    return {
      answer: `${business.name} lists these services: ${business.services
        .map((service) => service.name)
        .join(', ')}.`,
      sources: ['Services'],
      grounded: true,
    }
  }

  if (/(price|cost|how much|budget)/.test(q)) {
    const priced = business.services.filter((service) => service.priceFrom !== undefined || service.priceLabel)
    if (priced.length === 0) {
      return {
        answer: 'I couldn’t find this information in the current business profile.',
        sources: ['Prices'],
        grounded: false,
      }
    }
    return {
      answer: `Available demo pricing includes: ${priced
        .map((service) => `${service.name} (${service.priceLabel ?? `from $${service.priceFrom}`})`)
        .join('; ')}.`,
      sources: ['Prices'],
      grounded: true,
    }
  }

  if (/(phone|telephone|call)/.test(q)) {
    if (!business.phone) {
      return {
        answer: 'I couldn’t find this information in the current business profile.',
        sources: ['Contact'],
        grounded: false,
      }
    }
    return {
      answer: `The business telephone listed in this demo profile is ${business.phone}.`,
      sources: ['Contact'],
      grounded: true,
    }
  }

  if (/(airport pickup|airport transfer|pickup)/.test(q)) {
    const mentions = [...business.services.map((service) => service.name + ' ' + service.description), ...business.amenities]
      .some((field) => normalize(field).includes('airport') || normalize(field).includes('pickup'))
    if (!mentions) {
      return {
        answer:
          'The available listing does not confirm whether airport pickup is offered. Missing information is not treated as proof that the service is unavailable.',
        sources: ['Services', 'Amenities'],
        grounded: false,
      }
    }
    return {
      answer: `${business.name} mentions pickup/airport-related services in the current demo profile.`,
      sources: ['Services', 'Amenities'],
      grounded: true,
    }
  }

  if (business.description) {
    return {
      answer: `${business.name}: ${business.shortDescription} Open the full profile for complete demo details.`,
      sources: ['Business description'],
      grounded: true,
    }
  }

  return {
    answer: 'I couldn’t find this information in the current business profile.',
    sources: [],
    grounded: false,
  }
}
