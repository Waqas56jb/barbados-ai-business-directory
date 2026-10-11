import type { Owner, OwnerSettings } from '@/types'

export const mockOwner: Owner = {
  id: 'owner-001',
  name: 'Sarah Mendes',
  email: 'sarah@coralbreeze.demo',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  phone: '+1-246-555-0100',
  preferredLanguage: 'English',
}

export const defaultSettings: OwnerSettings = {
  listingStatusNotifications: true,
  inquiryNotifications: true,
  advertisingUpdates: true,
  productAnnouncements: false,
  compactTables: false,
  language: 'English',
  theme: 'light',
}
