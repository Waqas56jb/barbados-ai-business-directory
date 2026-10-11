import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState } from '@/components/common/EmptyState'
import { DirectorySkeleton } from '@/components/common/LoadingSkeleton'
import { SafeImage } from '@/components/common/SafeImage'
import { categories } from '@/data/categories'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { getBusinessesByLocation, getLocation } from '@/services/businessService'
import { useBusinessStore } from '@/store/businessStore'

export function LocationDetailPage() {
  const { slug = '' } = useParams()
  const overrides = useBusinessStore((state) => state.overrides)

  const locationQuery = useQuery({
    queryKey: ['location', slug],
    queryFn: () => getLocation(slug),
  })

  const businessesQuery = useQuery({
    queryKey: ['location-businesses', slug, overrides],
    queryFn: () => getBusinessesByLocation(slug),
    enabled: Boolean(locationQuery.data),
  })

  const location = locationQuery.data

  useDocumentMeta({
    title: location?.name ?? 'Location',
    description: location?.shortDescription,
    canonicalPath: slug ? `/locations/${slug}` : undefined,
  })

  if (locationQuery.isLoading) {
    return (
      <div className="container-shell section-padding py-14">
        <DirectorySkeleton count={3} />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="container-shell section-padding py-16 text-center">
        <h1 className="font-display text-4xl text-ocean">Location not found</h1>
        <Link to="/locations" className="mt-6 inline-flex text-turquoise">
          Back to locations
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="relative min-h-[320px] overflow-hidden">
        <SafeImage src={location.image} alt={location.name} className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-ocean/60" />
        <div className="container-shell section-padding relative flex min-h-[320px] flex-col justify-end pb-10 text-white">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Locations', href: '/locations' },
              { label: location.name },
            ]}
          />
          <h1 className="font-display text-4xl sm:text-5xl">{location.name}</h1>
          <p className="mt-3 max-w-2xl text-sand/90">{location.description}</p>
        </div>
      </div>

      <div className="container-shell section-padding py-12">
        <div className="mb-8">
          <h2 className="font-display text-2xl text-ocean">Related categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/directory?category=${category.slug}&parish=${location.slug}`}
                className="rounded-full bg-sand px-3 py-1.5 text-sm text-ocean hover:bg-turquoise hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {businessesQuery.isLoading ? <DirectorySkeleton /> : null}
        {businessesQuery.data?.length === 0 ? (
          <EmptyState
            title="No businesses found for your search."
            description="This parish has no matching demo listings yet. Try another location or browse all categories."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {businessesQuery.data?.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
