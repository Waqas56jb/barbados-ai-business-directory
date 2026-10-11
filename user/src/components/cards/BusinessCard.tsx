import { Heart, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SafeImage } from '@/components/common/SafeImage'
import { formatParishLabel, formatPriceRange } from '@/lib/formatters'
import { useFavoritesStore } from '@/store/favoritesStore'
import type { Business } from '@/types/business'

interface BusinessCardProps {
  business: Business
}

export function BusinessCard({ business }: BusinessCardProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(business.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ocean/8 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={business.coverImage}
          alt={`${business.name} cover image`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-2">
            {business.featured ? (
              <span className="rounded-full bg-ocean/90 px-3 py-1 text-xs font-medium text-white">Featured</span>
            ) : null}
            {business.sponsored ? (
              <span className="rounded-full bg-coral/95 px-3 py-1 text-xs font-medium text-white">Sponsored</span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={isFavorite ? `Remove ${business.name} from favorites` : `Save ${business.name} to favorites`}
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(business.id)}
            className="rounded-full bg-white/95 p-2 text-ocean shadow-sm transition hover:text-coral"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-coral text-coral' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-turquoise">
          <span>{business.category}</span>
          {business.priceRange ? <span className="text-muted">· {formatPriceRange(business.priceRange)}</span> : null}
        </div>
        <h3 className="font-display text-xl font-semibold text-ocean">
          <Link to={`/business/${business.slug}`} className="hover:text-turquoise">
            {business.name}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {formatParishLabel(business.parish, business.locationLabel)}
        </p>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/80">
          {business.shortDescription}
        </p>

        {business.services.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {business.services.slice(0, 2).map((service) => (
              <span key={service} className="rounded-full bg-sand px-2.5 py-1 text-xs text-ocean">
                {service}
              </span>
            ))}
          </div>
        ) : null}

        {business.demoRating ? (
          <p className="mt-4 flex items-center gap-1 text-xs text-muted">
            <Star className="h-3.5 w-3.5 fill-coral text-coral" aria-hidden="true" />
            <span>
              {business.demoRating.toFixed(1)} · {business.demoReviewCount ?? 0} demo reviews
            </span>
          </p>
        ) : null}

        <Link
          to={`/business/${business.slug}`}
          className="mt-5 inline-flex text-sm font-semibold text-turquoise hover:text-turquoise-dark"
        >
          View Details
        </Link>
      </div>
    </article>
  )
}
