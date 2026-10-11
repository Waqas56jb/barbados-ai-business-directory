export const siteConfig = {
  brandName: 'Barbados Explorer',
  tagline: 'Discover Barbados, Your Way.',
  description:
    'Find unforgettable experiences, beautiful places, local businesses, and hidden gems across the island.',
  announcement: 'Discover the best of Barbados, beyond the ordinary.',
  url: import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
  demoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
  chatbotName: 'Barbados AI Guide',
  social: {
    instagram: '#',
    facebook: '#',
    youtube: '#',
  },
} as const

export const navigation = [
  { label: 'Discover', href: '/' },
  { label: 'Things to Do', href: '/things-to-do' },
  { label: 'Places to Stay', href: '/directory?category=hotels-guesthouses' },
  { label: 'Food & Drink', href: '/directory?category=restaurants-cafes' },
  { label: 'Tours & Experiences', href: '/directory?category=tours-excursions' },
  { label: 'Explore the Island', href: '/locations' },
] as const

export const footerDiscoverLinks = [
  { label: 'Directory', href: '/directory' },
  { label: 'Categories', href: '/categories' },
  { label: 'Locations', href: '/locations' },
  { label: 'Things to Do', href: '/things-to-do' },
  { label: 'Favorites', href: '/favorites' },
] as const

export const legalLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
] as const
