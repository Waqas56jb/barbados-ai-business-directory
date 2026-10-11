import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState } from '@/components/common/EmptyState'
import { DirectorySkeleton } from '@/components/common/LoadingSkeleton'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { getBusinesses } from '@/services/businessService'
import { useBusinessStore } from '@/store/businessStore'
import { useFavoritesStore } from '@/store/favoritesStore'

export function FavoritesPage() {
  useDocumentMeta({
    title: 'Favorites',
    description: 'Your saved Barbados Explorer demo listings stored locally in this browser.',
    canonicalPath: '/favorites',
  })

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const overrides = useBusinessStore((state) => state.overrides)

  const query = useQuery({
    queryKey: ['favorites', favoriteIds, overrides],
    queryFn: async () => {
      const businesses = await getBusinesses()
      return businesses.filter((item) => favoriteIds.includes(item.id))
    },
  })

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Favorites' }]} />
      <SectionHeading
        title="Saved favorites"
        description="Favorites are stored locally in your browser for this demo and are not synced to an account."
      />
      <div className="mt-10">
        {query.isLoading ? <DirectorySkeleton /> : null}
        {query.data?.length === 0 ? (
          <EmptyState
            title="No favorites yet"
            description="Tap the heart on any listing card or detail page to save it here."
            actions={
              <Link to="/directory" className="rounded-full bg-turquoise px-4 py-2 text-sm font-medium text-white">
                Browse directory
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {query.data?.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
