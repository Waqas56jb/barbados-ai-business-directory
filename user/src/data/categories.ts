import type { Category } from '@/types/category'

export const categories: Category[] = [
  {
    id: 'cat-beaches',
    slug: 'beaches-attractions',
    name: 'Beaches & Attractions',
    shortDescription: 'Coastal viewpoints, scenic shores, and island landmarks.',
    description:
      'Explore fictional demo listings for beaches, scenic lookouts, and popular attraction-style experiences across Barbados.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['attraction', 'activity'],
  },
  {
    id: 'cat-tours',
    slug: 'tours-excursions',
    name: 'Tours & Excursions',
    shortDescription: 'Guided island tours, catamarans, and curated outings.',
    description:
      'Browse demo tour operators offering coastal sails, heritage stops, and curated day experiences.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['experience'],
  },
  {
    id: 'cat-food',
    slug: 'restaurants-cafes',
    name: 'Restaurants & Cafés',
    shortDescription: 'Local flavors, coastal dining, and café culture.',
    description:
      'Discover sample restaurants and cafés featuring Caribbean-inspired menus and coastal dining atmospheres.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['restaurant'],
  },
  {
    id: 'cat-hotels',
    slug: 'hotels-guesthouses',
    name: 'Hotels & Guesthouses',
    shortDescription: 'Boutique stays and welcoming guesthouse escapes.',
    description:
      'Find fictional accommodations ranging from boutique guesthouses to coastal stays for planning inspiration.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['accommodation'],
  },
  {
    id: 'cat-water',
    slug: 'water-sports',
    name: 'Water Sports',
    shortDescription: 'Snorkeling, sailing, and ocean adventures.',
    description:
      'Explore water-focused demo experiences including snorkeling, paddle sessions, and coastal adventure listings.',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['activity', 'experience'],
  },
  {
    id: 'cat-transport',
    slug: 'transportation',
    name: 'Transportation',
    shortDescription: 'Airport transfers and island mobility options.',
    description:
      'Review sample transportation listings such as airport transfers and private island travel services.',
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['transport'],
  },
  {
    id: 'cat-culture',
    slug: 'culture-heritage',
    name: 'Culture & Heritage',
    shortDescription: 'Stories, landmarks, and cultural experiences.',
    description:
      'Learn about fictional culture and heritage listings that highlight local stories, crafts, and historic atmospheres.',
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['attraction', 'experience'],
  },
  {
    id: 'cat-shopping',
    slug: 'shopping-markets',
    name: 'Shopping & Local Markets',
    shortDescription: 'Artisan goods, markets, and island finds.',
    description:
      'Browse demo shopping and market listings featuring artisan crafts, local goods, and coastal boutique stops.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    listingTypes: ['retail'],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug)
}
