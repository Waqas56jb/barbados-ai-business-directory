import type { FAQ } from '@/types'

export const mockFAQs: FAQ[] = [
  {
    id: 'faq-001',
    businessId: 'biz-001',
    question: 'Do you provide life jackets?',
    answer: 'Yes. The demo listing states that life jackets are provided for guests on catamaran cruises.',
    visibility: 'public',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'faq-002',
    businessId: 'biz-001',
    question: 'Are children welcome on the cruise?',
    answer: 'The demo profile marks Coral Breeze experiences as family-friendly with life jackets available.',
    visibility: 'public',
    updatedAt: '2026-09-22T12:00:00.000Z',
  },
  {
    id: 'faq-003',
    businessId: 'biz-002',
    question: 'Do you take reservations for sunset seating?',
    answer: 'Sunset seating is listed as available. Contact details in the demo profile can be used for reservation questions.',
    visibility: 'public',
    updatedAt: '2026-10-01T09:30:00.000Z',
  },
  {
    id: 'faq-004',
    businessId: 'biz-003',
    question: 'Do you offer airport pickup?',
    answer: 'Yes. Airport transfers are listed among Island Link Transfers services in this demo profile.',
    visibility: 'public',
    updatedAt: '2026-10-03T15:00:00.000Z',
  },
]
