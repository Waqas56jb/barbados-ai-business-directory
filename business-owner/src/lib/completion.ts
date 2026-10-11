import type { Business } from '@/types'

export function calculateCompletion(business: Business): number {
  const checks = [
    Boolean(business.name.trim()),
    Boolean(business.shortDescription.trim()),
    Boolean(business.description.trim() && business.description.length > 40),
    Boolean(business.category),
    Boolean(business.parish && business.locationLabel),
    Boolean(business.email || business.phone || business.website),
    business.services.length > 0,
    business.amenities.length > 0,
    Boolean(business.coverImage || business.gallery.some((image) => image.isCover)),
    business.gallery.length > 0,
    business.openingHours.some((day) => day.status !== 'unspecified'),
    business.languages.length > 0,
  ]

  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100)
  return score
}

export function getSetupChecklist(business: Business) {
  return [
    {
      id: 'description',
      label: 'Add a business description',
      done: Boolean(business.description.trim() && business.description.length > 40),
      href: `/businesses/${business.id}/edit#identity`,
    },
    {
      id: 'cover',
      label: 'Upload a cover image',
      done: Boolean(business.coverImage || business.gallery.some((image) => image.isCover)),
      href: '/media',
    },
    {
      id: 'services',
      label: 'Add service information',
      done: business.services.length > 0,
      href: '/services',
    },
    {
      id: 'contact',
      label: 'Complete contact details',
      done: Boolean(business.email || business.phone || business.website),
      href: `/businesses/${business.id}/edit#contact`,
    },
    {
      id: 'ai',
      label: 'Review AI knowledge information',
      done: Boolean(business.description && business.services.length > 0),
      href: '/ai-knowledge',
    },
    {
      id: 'preview',
      label: 'Preview the public listing',
      done: business.completionPercentage >= 70,
      href: `/businesses/${business.id}`,
    },
  ]
}
