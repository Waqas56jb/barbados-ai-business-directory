import type { Inquiry } from '@/types'

export const mockInquiries: Inquiry[] = [
  {
    id: 'inq-001',
    businessId: 'biz-001',
    visitorName: 'Jordan Blake',
    visitorEmail: 'jordan.blake@example.com',
    subject: 'Family cruise availability',
    message:
      'Hi, we are visiting next month with two children. Do you have morning catamaran availability and life jackets?',
    status: 'unread',
    createdAt: '2026-10-10T09:15:00.000Z',
  },
  {
    id: 'inq-002',
    businessId: 'biz-002',
    visitorName: 'Amelia Chen',
    visitorEmail: 'amelia.chen@example.com',
    subject: 'Sunset seating for two',
    message: 'Could we reserve a sunset table this Friday evening? Looking for ocean-view seating if available.',
    status: 'read',
    internalNotes: 'Demo note: suggest confirming capacity in owner reply.',
    createdAt: '2026-10-09T18:40:00.000Z',
  },
  {
    id: 'inq-003',
    businessId: 'biz-003',
    visitorName: 'Marcus Hall',
    visitorEmail: 'marcus.hall@example.com',
    subject: 'Airport transfer from late flight',
    message: 'Landing at 10:20 PM next Tuesday. Do you offer late airport pickup to Holetown?',
    status: 'responded',
    createdAt: '2026-10-07T11:05:00.000Z',
  },
]
