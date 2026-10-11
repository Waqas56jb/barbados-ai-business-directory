import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { SafeImage } from '@/components/common/SafeImage'
import { SectionHeading } from '@/components/common/SectionHeading'
import { locations } from '@/data/locations'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function LocationsPage() {
  useDocumentMeta({
    title: 'Explore the Island',
    description: 'Discover Barbados parishes and filtered directory results by location.',
    canonicalPath: '/locations',
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Locations' }]} />
      <SectionHeading
        title="Explore Barbados by parish"
        description="Choose a parish to browse matching fictional tourism listings and coastal discovery ideas."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {locations.map((location) => (
          <Link
            key={location.id}
            to={`/locations/${location.slug}`}
            className="overflow-hidden rounded-[1.75rem] border border-ocean/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
          >
            <SafeImage src={location.image} alt={location.name} className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <h2 className="font-display text-2xl text-ocean">{location.name}</h2>
              <p className="mt-2 text-sm text-muted">{location.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {location.highlights.map((highlight) => (
                  <span key={highlight} className="rounded-full bg-sand px-2.5 py-1 text-xs text-ocean">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
