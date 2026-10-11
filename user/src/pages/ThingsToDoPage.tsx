import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { DirectorySkeleton } from '@/components/common/LoadingSkeleton'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { getBusinesses } from '@/services/businessService'
import { useBusinessStore } from '@/store/businessStore'

export function ThingsToDoPage() {
  useDocumentMeta({
    title: 'Things to Do',
    description: 'Browse tourism experiences, outdoor activities, water sports, and cultural listings.',
    canonicalPath: '/things-to-do',
  })

  const overrides = useBusinessStore((state) => state.overrides)
  const query = useQuery({
    queryKey: ['things-to-do', overrides],
    queryFn: async () => {
      const businesses = await getBusinesses()
      return businesses.filter((item) =>
        ['experience', 'activity', 'attraction'].includes(item.listingType) ||
        item.outdoor ||
        item.categorySlug === 'water-sports' ||
        item.categorySlug === 'culture-heritage' ||
        item.categorySlug === 'tours-excursions',
      )
    },
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do' }]} />
      <SectionHeading
        title="Things to do in Barbados"
        description="Experiences, outdoor activities, sightseeing, water sports, and cultural activities from the fictional dataset."
      />
      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/directory?category=tours-excursions" className="rounded-full bg-sand px-3 py-1.5 text-sm text-ocean">
          Tours
        </Link>
        <Link to="/directory?category=water-sports" className="rounded-full bg-sand px-3 py-1.5 text-sm text-ocean">
          Water sports
        </Link>
        <Link to="/directory?category=culture-heritage" className="rounded-full bg-sand px-3 py-1.5 text-sm text-ocean">
          Culture
        </Link>
        <Link to="/directory?outdoor=1" className="rounded-full bg-sand px-3 py-1.5 text-sm text-ocean">
          Outdoor
        </Link>
      </div>
      <div className="mt-10">
        {query.isLoading ? <DirectorySkeleton /> : null}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {query.data?.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </div>
  )
}
