import type { HelpArticle } from '@/types'

export const helpArticles: HelpArticle[] = [
  {
    id: 'help-001',
    title: 'How to complete your business profile',
    category: 'Listings',
    summary: 'Fill identity, location, services, and contact details for a stronger public listing.',
    body: 'Start with a clear short description, then expand the full description with services visitors care about. Add parish, town, and contact options. Upload a cover image before submitting for review.',
    tags: ['listing', 'profile', 'completion'],
  },
  {
    id: 'help-002',
    title: 'Photography recommendations',
    category: 'Media',
    summary: 'Use bright, high-quality images that show the experience, place, or product.',
    body: 'Prefer landscape photos with strong natural light. Include at least one cover image and two supporting gallery images. Add alt text that describes the scene for accessibility.',
    tags: ['photos', 'media', 'gallery'],
  },
  {
    id: 'help-003',
    title: 'AI knowledge profile guidance',
    category: 'AI Knowledge',
    summary: 'Keep services, FAQs, and contact fields accurate so chatbot answers stay grounded.',
    body: 'The public AI assistant will later use approved listing information. Missing fields should remain unanswered rather than guessed. Use FAQs for common visitor questions that are not obvious from the description.',
    tags: ['ai', 'faq', 'chatbot'],
  },
  {
    id: 'help-004',
    title: 'Advertising request basics',
    category: 'Advertising',
    summary: 'Choose a placement, set dates, and submit a campaign for review.',
    body: 'Promotions in this demo are request workflows only. Real approvals, scheduling, and payments will be handled by the future admin panel and server.',
    tags: ['advertising', 'promotions'],
  },
  {
    id: 'help-005',
    title: 'Responding to inquiries',
    category: 'Inquiries',
    summary: 'Mark messages read, draft replies, and keep internal notes for your team.',
    body: 'Inquiry replies in this dashboard are demo-only and are not emailed. Use status controls to track unread, responded, and archived conversations.',
    tags: ['inquiries', 'messages'],
  },
]
