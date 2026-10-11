import type { Location } from '@/types/category'

export const locations: Location[] = [
  {
    id: 'loc-christ-church',
    slug: 'christ-church',
    name: 'Christ Church',
    shortDescription: 'South coast energy, beaches, and evening dining.',
    description:
      'Christ Church is presented here as a lively south-coast parish for beaches, nightlife-adjacent dining, and transfer hubs in this fictional directory.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Coastal dining', 'Beach access', 'Airport corridor'],
  },
  {
    id: 'loc-st-michael',
    slug: 'st-michael',
    name: 'St. Michael',
    shortDescription: 'Bridgetown harbor life and urban discovery.',
    description:
      'St. Michael includes Bridgetown-area demo listings for harbor tours, shopping, and cultural stops.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Harbor views', 'City walks', 'Cultural stops'],
  },
  {
    id: 'loc-st-james',
    slug: 'st-james',
    name: 'St. James',
    shortDescription: 'West coast calm, resorts, and refined dining.',
    description:
      'St. James features west-coast style stays, lounges, and coastal leisure listings for the demo experience.',
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    highlights: ['West coast beaches', 'Boutique stays', 'Sunset dining'],
  },
  {
    id: 'loc-st-peter',
    slug: 'st-peter',
    name: 'St. Peter',
    shortDescription: 'Speightstown charm and north-west exploration.',
    description:
      'St. Peter showcases Speightstown-centered demo listings for snorkeling, waterfront walks, and quieter coastal finds.',
    image:
      'https://images.unsplash.com/photo-1473116763249-2faa89e60b60?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Speightstown', 'Snorkeling', 'Quiet coasts'],
  },
  {
    id: 'loc-st-lucy',
    slug: 'st-lucy',
    name: 'St. Lucy',
    shortDescription: 'Northern cliffs, open skies, and scenic drives.',
    description:
      'St. Lucy is presented as a northern parish for scenic overlooks and less-crowded discovery stops.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Scenic cliffs', 'Open landscapes', 'Day trips'],
  },
  {
    id: 'loc-st-philip',
    slug: 'st-philip',
    name: 'St. Philip',
    shortDescription: 'East and southeast shores with open Atlantic views.',
    description:
      'St. Philip includes southeast coastal demo listings for spacious beaches and outdoor-minded activities.',
    image:
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Atlantic views', 'Open beaches', 'Outdoor days'],
  },
  {
    id: 'loc-st-joseph',
    slug: 'st-joseph',
    name: 'St. Joseph',
    shortDescription: 'East coast drama and hillside scenery.',
    description:
      'St. Joseph highlights rugged east-coast scenery and nature-forward demo experiences.',
    image:
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
    highlights: ['East coast views', 'Nature walks', 'Photo stops'],
  },
  {
    id: 'loc-st-andrew',
    slug: 'st-andrew',
    name: 'St. Andrew',
    shortDescription: 'Highland hills and countryside calm.',
    description:
      'St. Andrew features countryside and highland-inspired listings for quieter island exploration.',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Hillsides', 'Countryside', 'Quiet escapes'],
  },
  {
    id: 'loc-st-john',
    slug: 'st-john',
    name: 'St. John',
    shortDescription: 'Garden views and coastal overlooks.',
    description:
      'St. John is framed here with garden-and-overlook style attractions for scenic day exploring.',
    image:
      'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Overlooks', 'Gardens', 'Heritage stops'],
  },
  {
    id: 'loc-st-thomas',
    slug: 'st-thomas',
    name: 'St. Thomas',
    shortDescription: 'Central island routes and hidden pockets.',
    description:
      'St. Thomas includes central-island demo listings useful for cross-island itineraries.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Central routes', 'Local finds', 'Day touring'],
  },
  {
    id: 'loc-st-george',
    slug: 'st-george',
    name: 'St. George',
    shortDescription: 'Inland character and neighborhood discovery.',
    description:
      'St. George offers inland parish character for visitors exploring beyond the shoreline in this demo directory.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Inland exploring', 'Local character', 'Quiet drives'],
  },
]

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((location) => location.slug === slug)
}
