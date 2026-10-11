import type { PriceRange } from '@/types/business'

export function formatPriceRange(priceRange?: PriceRange): string {
  if (!priceRange) return 'Price not listed'
  return priceRange
}

export function formatPriceFrom(priceFrom?: number, currency = 'USD'): string {
  if (priceFrom === undefined) return 'From price not listed'
  if (priceFrom === 0) return 'Free entry listed'
  return `From ${currency} ${priceFrom}`
}

export function formatParishLabel(parish: string, locationLabel?: string): string {
  if (!locationLabel || locationLabel === parish) return parish
  return `${locationLabel}, ${parish}`
}

export function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}
