import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Button } from '@/components/common/Button'
import { SafeImage } from '@/components/common/SafeImage'
import { SectionHeading } from '@/components/common/SectionHeading'
import { NewsletterForm } from '@/components/home/NewsletterForm'
import { HeroSearch } from '@/components/search/HeroSearch'
import { categories } from '@/data/categories'
import {
  aiPromo,
  heroContent,
  hiddenGemsIntro,
  howItWorks,
  trustHighlights,
} from '@/data/homepage'
import { locations } from '@/data/locations'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { getBusinesses, getFeaturedBusinesses } from '@/services/businessService'
import { useChatStore } from '@/store/chatStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useBusinessStore } from '@/store/businessStore'

export function HomePage() {
  useDocumentMeta({
    title: 'Discover Barbados',
    description: heroContent.supporting,
    canonicalPath: '/',
  })

  const openChat = useChatStore((state) => state.openChat)
  const overrides = useBusinessStore((state) => state.overrides)
  const recentlyViewedIds = useFavoritesStore((state) => state.recentlyViewedIds)

  const featuredQuery = useQuery({
    queryKey: ['featured-businesses', overrides],
    queryFn: () => getFeaturedBusinesses(6),
  })

  const allQuery = useQuery({
    queryKey: ['all-businesses', overrides],
    queryFn: () => getBusinesses(),
  })

  const hiddenGems = (allQuery.data ?? [])
    .filter((item) => item.tags.includes('hidden gem') || !item.featured)
    .slice(0, 3)

  const recentlyViewed = (allQuery.data ?? []).filter((item) => recentlyViewedIds.includes(item.id))

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <SafeImage
          src={heroContent.image}
          alt={heroContent.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean/85 via-ocean/55 to-ocean/25" />
        <div className="container-shell section-padding relative flex min-h-[88vh] flex-col justify-center py-16">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-sand">Barbados Explorer</p>
            <h1 className="font-display text-5xl font-semibold leading-tight text-balance sm:text-6xl lg:text-7xl">
              {heroContent.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-sand/95 sm:text-xl">{heroContent.supporting}</p>
          </div>
          <div className="mt-10 max-w-5xl">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="border-b border-ocean/10 bg-white">
        <div className="container-shell section-padding grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {trustHighlights.map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-xl text-ocean">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell section-padding py-16 sm:py-20">
        <SectionHeading
          eyebrow="Categories"
          title="Explore by interest"
          description="Visually rich starting points for beaches, tours, dining, stays, and more."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-[1.75rem]"
            >
              <SafeImage
                src={category.image}
                alt={category.name}
                className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean/85 via-ocean/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-2xl">{category.name}</h3>
                <p className="mt-2 text-sm text-sand/90">{category.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sand/60 py-16 sm:py-20">
        <div className="container-shell section-padding">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Featured experiences"
              title="Handpicked demo listings"
              description="Illustrative sample businesses for the client demonstration. Ratings and reviews are fictional."
            />
            <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-turquoise">
              View directory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {(featuredQuery.data ?? []).map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-padding py-16 sm:py-20">
        <SectionHeading
          eyebrow="Explore by parish"
          title="Discover Barbados by location"
          description="Jump into parish-filtered directory results across the island."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <Link
              key={location.id}
              to={`/locations/${location.slug}`}
              className="overflow-hidden rounded-3xl border border-ocean/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"
            >
              <SafeImage src={location.image} alt={location.name} className="aspect-[16/10] w-full object-cover" />
              <div className="p-4">
                <h3 className="font-display text-xl text-ocean">{location.name}</h3>
                <p className="mt-2 text-sm text-muted">{location.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ocean py-16 text-white sm:py-20">
        <div className="container-shell section-padding">
          <SectionHeading
            eyebrow="Hidden gems"
            title={hiddenGemsIntro.title}
            description={hiddenGemsIntro.supporting}
            tone="dark"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {hiddenGems.map((gem, index) => (
              <Link
                key={gem.id}
                to={`/business/${gem.slug}`}
                className={`group relative overflow-hidden rounded-[2rem] ${
                  index === 0 ? 'lg:col-span-7 min-h-[360px]' : 'lg:col-span-5 min-h-[280px]'
                }`}
              >
                <SafeImage
                  src={gem.coverImage}
                  alt={gem.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean via-ocean/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-sand/80">{gem.locationLabel}</p>
                  <h3 className="mt-2 font-display text-3xl">{gem.name}</h3>
                  <p className="mt-2 max-w-md text-sm text-sand/90">{gem.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-padding py-16 sm:py-20">
        <div className="grid items-center gap-10 rounded-[2rem] bg-sand px-6 py-10 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-turquoise">AI assistant demo</p>
            <h2 className="mt-3 font-display text-4xl text-ocean">{aiPromo.heading}</h2>
            <p className="mt-4 text-muted">{aiPromo.supporting}</p>
            <Button className="mt-6" onClick={() => openChat()}>
              <Sparkles className="h-4 w-4" />
              Ask the Barbados AI
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiPromo.questions.map((question) => (
              <button
                key={question}
                type="button"
                className="rounded-full bg-white px-4 py-2 text-left text-sm text-ocean shadow-sm hover:text-turquoise"
                onClick={() => openChat({ prefillQuestion: question })}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-padding pb-16">
        <SectionHeading eyebrow="How it works" title="Three simple steps" align="center" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {howItWorks.map((step) => (
            <div key={step.step} className="rounded-3xl border border-ocean/10 bg-white p-6 text-center shadow-card">
              <p className="text-sm font-semibold tracking-[0.2em] text-turquoise">{step.step}</p>
              <h3 className="mt-3 font-display text-2xl text-ocean">{step.title}</h3>
              <p className="mt-3 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {recentlyViewed.length > 0 ? (
        <section className="bg-white py-16">
          <div className="container-shell section-padding">
            <SectionHeading eyebrow="Continue exploring" title="Recently viewed" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recentlyViewed.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-shell section-padding py-16 sm:py-20">
        <div className="rounded-[2rem] border border-ocean/10 bg-white px-6 py-12 text-center shadow-card sm:px-12">
          <SectionHeading
            align="center"
            eyebrow="Travel inspiration"
            title="Stay inspired for your next island day"
            description="Demo newsletter capture only — emails are validated in the browser and are not sent to a mailing list."
          />
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
