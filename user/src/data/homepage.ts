export const heroContent = {
  headline: 'Discover Barbados, Your Way.',
  supporting:
    'Find unforgettable experiences, beautiful places, local businesses, and hidden gems across the island.',
  placeholder: "Try 'catamaran cruise', 'restaurants in Holetown' or 'airport transfers'",
  image:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
  imageAlt: 'Turquoise Caribbean shoreline with soft sand and palms at golden hour',
}

export const quickSearchChips = [
  { label: 'Beach Experiences', query: 'beach', category: 'beaches-attractions' },
  { label: 'Local Restaurants', query: 'restaurant', category: 'restaurants-cafes' },
  { label: 'Island Tours', query: 'tour', category: 'tours-excursions' },
  { label: 'Places to Stay', query: '', category: 'hotels-guesthouses' },
  { label: 'Airport Transfers', query: 'airport transfers', category: 'transportation' },
] as const

export const trustHighlights = [
  {
    title: 'Explore Local Businesses',
    description: 'Browse curated demo listings across experiences, dining, stays, and more.',
  },
  {
    title: 'Find Experiences by Location',
    description: 'Filter by parish and coastal hubs to shape an island itinerary.',
  },
  {
    title: 'Discover Hidden Gems',
    description: 'Spot lesser-known viewpoints, gardens, and local food moments.',
  },
  {
    title: 'Get Answers with AI',
    description: 'Ask the demo AI guide questions grounded in the directory data.',
  },
] as const

export const howItWorks = [
  {
    step: '01',
    title: 'Explore',
    description: 'Search categories, places, and businesses across the island directory.',
  },
  {
    step: '02',
    title: 'Discover',
    description: 'Compare listing details, services, amenities, and available information.',
  },
  {
    step: '03',
    title: 'Ask AI',
    description: 'Get answers grounded in the available directory data for this demo.',
  },
] as const

export const aiPromo = {
  heading: 'Your Personal Barbados Travel Companion.',
  supporting:
    'Ask questions, discover local experiences, compare options, and find businesses that match your plans.',
  questions: [
    'Where can I find a snorkeling experience?',
    'Which restaurants are listed near Holetown?',
    'What transportation options are available?',
    'Which businesses offer family-friendly activities?',
    'What information is available about Coral Breeze Catamaran Tours?',
  ],
}

export const hiddenGemsIntro = {
  title: 'Find Your Own Little Piece of Paradise.',
  supporting:
    'A quieter edit of scenic lookouts, garden hours, and local food walks from the fictional dataset.',
}
