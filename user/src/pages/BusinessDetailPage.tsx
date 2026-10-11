import { useQuery } from '@tanstack/react-query'
import {
  ExternalLink,
  Heart,
  MapPin,
  Phone,
  Share2,
  Sparkles,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ImageGallery } from '@/components/business/ImageGallery'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Button } from '@/components/common/Button'
import { PageError } from '@/components/common/LoadingSkeleton'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { formatParishLabel, formatPriceFrom, formatPriceRange } from '@/lib/formatters'
import { getBusinessBySlug, getRelatedBusinesses } from '@/services/businessService'
import { useBusinessStore } from '@/store/businessStore'
import { useChatStore } from '@/store/chatStore'
import { useFavoritesStore } from '@/store/favoritesStore'

export function BusinessDetailPage() {
  const { slug = '' } = useParams()
  const overrides = useBusinessStore((state) => state.overrides)
  const openChat = useChatStore((state) => state.openChat)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const addRecentlyViewed = useFavoritesStore((state) => state.addRecentlyViewed)

  const businessQuery = useQuery({
    queryKey: ['business', slug, overrides],
    queryFn: () => getBusinessBySlug(slug),
    enabled: Boolean(slug),
  })

  const business = businessQuery.data

  useDocumentMeta({
    title: business?.name ?? 'Business details',
    description: business?.shortDescription ?? 'Barbados Explorer demo business listing.',
    canonicalPath: slug ? `/business/${slug}` : undefined,
  })

  useEffect(() => {
    if (business?.id) addRecentlyViewed(business.id)
  }, [business?.id, addRecentlyViewed])

  const relatedQuery = useQuery({
    queryKey: ['related', business?.id, overrides],
    queryFn: () => getRelatedBusinesses(business!),
    enabled: Boolean(business),
  })

  if (businessQuery.isLoading) {
    return (
      <div className="container-shell section-padding py-16">
        <div className="h-10 w-64 animate-pulse rounded bg-sand" />
        <div className="mt-8 aspect-[16/9] animate-pulse rounded-[2rem] bg-sand" />
      </div>
    )
  }

  if (businessQuery.isError) {
    return (
      <div className="container-shell section-padding py-16">
        <PageError onRetry={() => void businessQuery.refetch()} />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="container-shell section-padding py-16 text-center">
        <h1 className="font-display text-4xl text-ocean">Business not found</h1>
        <p className="mt-4 text-muted">
          This demo listing slug does not match any fictional business in the directory.
        </p>
        <Link to="/directory" className="mt-8 inline-flex rounded-full bg-turquoise px-5 py-3 text-sm font-medium text-white">
          Back to directory
        </Link>
      </div>
    )
  }

  const shareListing = async () => {
    const shareData = {
      title: business.name,
      text: business.shortDescription,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch {
      // user cancelled share
    }
  }

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Directory', href: '/directory' },
          { label: business.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <ImageGallery images={business.gallery} altBase={business.name} />

        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ocean">
              {business.category}
            </span>
            {business.featured ? (
              <span className="rounded-full bg-ocean px-3 py-1 text-xs font-semibold text-white">Featured</span>
            ) : null}
            {business.sponsored ? (
              <span className="rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">Sponsored</span>
            ) : null}
            {business.demoRecord ? (
              <span className="rounded-full border border-ocean/15 px-3 py-1 text-xs text-muted">Demo listing</span>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-4xl text-ocean sm:text-5xl">{business.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-muted">
            <MapPin className="h-4 w-4" />
            {formatParishLabel(business.parish, business.locationLabel)}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">{business.shortDescription}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant="ghost"
              onClick={() => toggleFavorite(business.id)}
              aria-pressed={isFavorite(business.id)}
            >
              <Heart className={`h-4 w-4 ${isFavorite(business.id) ? 'fill-coral text-coral' : ''}`} />
              Favorite
            </Button>
            <Button variant="ghost" onClick={() => void shareListing()}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() =>
                openChat({
                  businessSlug: business.slug,
                  businessName: business.name,
                  prefillQuestion: `What information is available about ${business.name}?`,
                })
              }
            >
              <Sparkles className="h-4 w-4" />
              Ask AI about this business
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {business.website ? (
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ocean px-4 py-3 text-sm font-medium text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            ) : null}
            {business.phone ? (
              <a
                href={`tel:${business.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean/15 px-4 py-3 text-sm font-medium text-ocean"
              >
                <Phone className="h-4 w-4" />
                Call Business
              </a>
            ) : null}
            {business.address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, Barbados`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean/15 px-4 py-3 text-sm font-medium text-ocean sm:col-span-2"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-[2rem] border border-ocean/10 bg-white p-6 sm:p-8 shadow-card">
          <h2 className="font-display text-3xl text-ocean">Overview</h2>
          <p className="mt-4 leading-relaxed text-ink/85">{business.description}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Services</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {business.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Amenities</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {business.amenities.length > 0 ? business.amenities.map((item) => <li key={item}>{item}</li>) : <li>Not listed</li>}
              </ul>
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-[2rem] border border-ocean/10 bg-sand/50 p-6">
          <DetailRow label="Price range" value={formatPriceRange(business.priceRange)} />
          <DetailRow
            label="From"
            value={business.priceFrom !== undefined ? formatPriceFrom(business.priceFrom, business.currency) : 'Not listed'}
          />
          <DetailRow label="Address" value={business.address ?? 'Not listed'} />
          <DetailRow label="Phone" value={business.phone ?? 'Not listed'} />
          <DetailRow label="Website" value={business.website ?? 'Not listed'} />
          <DetailRow
            label="Family-friendly"
            value={business.familyFriendly === undefined ? 'Not specified' : business.familyFriendly ? 'Yes' : 'No'}
          />
          <DetailRow
            label="Languages"
            value={business.languages?.join(', ') ?? 'Not listed'}
          />
          <DetailRow
            label="Accessibility"
            value={business.accessibility?.join(', ') ?? 'Not listed'}
          />
          {business.openingHours?.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Opening hours</p>
              <ul className="mt-2 space-y-1 text-sm">
                {business.openingHours.map((item) => (
                  <li key={`${item.day}-${item.hours}`}>
                    {item.day}: {item.hours}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <DetailRow label="Opening hours" value="Not listed" />
          )}
        </aside>
      </div>

      {(relatedQuery.data?.length ?? 0) > 0 ? (
        <section className="mt-16">
          <SectionHeading title="Related businesses" description="Similar demo listings by category, parish, or tags." />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {relatedQuery.data?.map((item) => (
              <BusinessCard key={item.id} business={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-1 text-sm text-ink break-words">{value}</p>
    </div>
  )
}
