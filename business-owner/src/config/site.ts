export const siteConfig = {
  brandName: 'Barbados Explorer Business',
  shortName: 'Barbados Explorer',
  tagline: 'Manage your Barbados tourism listings with confidence.',
  description:
    'Business owner dashboard for managing tourism listings, media, AI knowledge, and promotional placements.',
  url: import.meta.env.VITE_SITE_URL ?? 'http://localhost:5174',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
  demoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
  demoEmail: 'sarah@coralbreeze.demo',
  publicDirectoryHint: 'Public visitor site lives in the separate user/ application.',
} as const

export const parishes = [
  'Christ Church',
  'St. Andrew',
  'St. George',
  'St. James',
  'St. John',
  'St. Joseph',
  'St. Lucy',
  'St. Michael',
  'St. Peter',
  'St. Philip',
  'St. Thomas',
] as const

export const businessCategories = [
  'Tours & Excursions',
  'Restaurants & Cafés',
  'Hotels & Guesthouses',
  'Water Sports',
  'Transportation',
  'Beaches & Attractions',
  'Culture & Heritage',
  'Shopping & Local Markets',
] as const

export const amenityOptions = [
  'Family-friendly',
  'Outdoor activities',
  'Accessible facilities',
  'Parking',
  'Wi-Fi',
  'Air conditioning',
  'Equipment rental',
  'Guided experiences',
  'Pickup service',
  'Restaurant facilities',
  'Waterfront access',
] as const

export const languageOptions = [
  'English',
  'Spanish',
  'French',
  'Portuguese',
  'German',
  'Dutch',
] as const

export const placementTypes = [
  {
    id: 'featured-directory',
    name: 'Featured Directory Listing',
    description: 'Highlight your business near the top of filtered directory results.',
    durationHint: '7–30 days',
  },
  {
    id: 'homepage-featured',
    name: 'Homepage Featured Business',
    description: 'Appear in the visitor homepage featured experiences section.',
    durationHint: '7–14 days',
  },
  {
    id: 'category-featured',
    name: 'Featured Category Placement',
    description: 'Promote within a selected tourism category page.',
    durationHint: '14–30 days',
  },
  {
    id: 'sponsored-search',
    name: 'Sponsored Search Placement',
    description: 'Show as a clearly labeled sponsored result for relevant searches.',
    durationHint: '7–21 days',
  },
  {
    id: 'seasonal',
    name: 'Seasonal Tourism Promotion',
    description: 'Campaign-style placement for holidays and peak visitor periods.',
    durationHint: '14–45 days',
  },
] as const
