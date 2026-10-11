import { useQuery } from '@tanstack/react-query'
import { Filter, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BusinessCard } from '@/components/cards/BusinessCard'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState } from '@/components/common/EmptyState'
import { DirectorySkeleton, PageError } from '@/components/common/LoadingSkeleton'
import { DirectoryFilters, type DirectoryFilterState } from '@/components/directory/DirectoryFilters'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import {
  describeActiveFilters,
  parseDirectorySearchParams,
  toDirectorySearchParams,
} from '@/lib/directoryParams'
import { pluralize } from '@/lib/formatters'
import { searchBusinesses } from '@/services/businessService'
import { useBusinessStore } from '@/store/businessStore'
import { useChatStore } from '@/store/chatStore'
import { useFavoritesStore } from '@/store/favoritesStore'

export function DirectoryPage() {
  useDocumentMeta({
    title: 'Business Directory',
    description: 'Search and filter fictional Barbados tourism businesses and experiences.',
    canonicalPath: '/directory',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const parsed = useMemo(() => parseDirectorySearchParams(searchParams), [searchParams])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [queryInput, setQueryInput] = useState(parsed.q ?? '')
  const debouncedQuery = useDebouncedValue(queryInput, 300)
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const overrides = useBusinessStore((state) => state.overrides)
  const openChat = useChatStore((state) => state.openChat)

  useEffect(() => {
    setQueryInput(parsed.q ?? '')
  }, [parsed.q])

  useEffect(() => {
    const current = parsed.q ?? ''
    if (debouncedQuery === current) return
    const params = toDirectorySearchParams({
      ...parsed,
      q: debouncedQuery || undefined,
      page: 1,
    })
    setSearchParams(params, { replace: true })
  }, [debouncedQuery, parsed, setSearchParams])

  const filterState: DirectoryFilterState = {
    ...parsed,
    q: queryInput,
    sort: parsed.sort,
  }

  const query = useQuery({
    queryKey: ['directory', parsed, favoriteIds, overrides],
    queryFn: () =>
      searchBusinesses({
        filters: {
          ...parsed,
          favoriteIds,
        },
        sort: parsed.sort,
        page: parsed.page,
        pageSize: 9,
      }),
  })

  const activeChips = describeActiveFilters(parsed)

  const updateFilters = (next: DirectoryFilterState) => {
    setQueryInput(next.q ?? '')
    setSearchParams(
      toDirectorySearchParams({
        ...next,
        page: 1,
      }),
    )
  }

  const clearFilters = () => {
    setQueryInput('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Directory' }]} />
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl text-ocean sm:text-5xl">Business Directory</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Search fictional Barbados tourism listings. Filters sync to the URL so you can share or refresh a search.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-ocean/15 bg-white px-4 py-2 text-sm font-medium text-ocean lg:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <DirectoryFilters value={filterState} onChange={updateFilters} onClear={clearFilters} />
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {query.isLoading
                ? 'Loading results…'
                : `${pluralize(query.data?.total ?? 0, 'business')} found`}
            </p>
            {activeChips.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <span key={chip} className="rounded-full bg-sand px-3 py-1 text-xs text-ocean">
                    {chip}
                  </span>
                ))}
                <button type="button" className="text-xs font-semibold text-turquoise" onClick={clearFilters}>
                  Clear all
                </button>
              </div>
            ) : null}
          </div>

          {query.isLoading ? <DirectorySkeleton /> : null}
          {query.isError ? (
            <PageError message="The directory could not load demo data." onRetry={() => void query.refetch()} />
          ) : null}

          {query.data && query.data.items.length === 0 ? (
            <EmptyState
              title="No businesses found for your search."
              description="Clear some filters, try a different keyword, browse popular categories, or ask the AI assistant for help."
              actions={
                <>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full bg-turquoise px-4 py-2 text-sm font-medium text-white"
                  >
                    Clear filters
                  </button>
                  <Link to="/categories" className="rounded-full bg-sand px-4 py-2 text-sm font-medium text-ocean">
                    Browse categories
                  </Link>
                  <button
                    type="button"
                    onClick={() => openChat({ prefillQuestion: 'Help me find a Barbados experience' })}
                    className="rounded-full border border-ocean/15 px-4 py-2 text-sm font-medium text-ocean"
                  >
                    Ask AI
                  </button>
                </>
              }
            />
          ) : null}

          {query.data && query.data.items.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {query.data.items.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={parsed.page <= 1}
                  className="rounded-full border border-ocean/15 px-4 py-2 text-sm disabled:opacity-40"
                  onClick={() =>
                    setSearchParams(toDirectorySearchParams({ ...parsed, page: parsed.page - 1 }))
                  }
                >
                  Previous
                </button>
                <p className="text-sm text-muted">
                  Page {query.data.page} of {query.data.pageCount}
                </p>
                <button
                  type="button"
                  disabled={parsed.page >= (query.data.pageCount || 1)}
                  className="rounded-full border border-ocean/15 px-4 py-2 text-sm disabled:opacity-40"
                  onClick={() =>
                    setSearchParams(toDirectorySearchParams({ ...parsed, page: parsed.page + 1 }))
                  }
                >
                  Next
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Directory filters">
          <button
            type="button"
            className="absolute inset-0 bg-ocean/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-ivory p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-ocean">Filters</h2>
              <button type="button" aria-label="Close filters panel" onClick={() => setFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <DirectoryFilters
              compact
              value={filterState}
              onChange={(next) => {
                updateFilters(next)
                setFiltersOpen(false)
              }}
              onClear={() => {
                clearFilters()
                setFiltersOpen(false)
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
