import { parishes } from '@/config/site'
import { slugify } from '@/lib/formatters'
import type { LocationRecord } from '@/types'

const images = [
  'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1473116763249-2faa89e60b60?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
]

export const mockLocations: LocationRecord[] = parishes.map((name, index) => ({
  id: `loc-${slugify(name)}`,
  name,
  slug: slugify(name),
  description: `Fictional parish overview for ${name}, used in the Barbados Explorer admin demo for location page management.`,
  image: images[index % images.length]!,
  active: true,
  displayOrder: index + 1,
}))
