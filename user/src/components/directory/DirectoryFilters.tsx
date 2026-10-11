import { categories } from '@/data/categories'
import { locations } from '@/data/locations'
import { PRICE_RANGE_OPTIONS } from '@/lib/search'
import type { DirectoryUrlState } from '@/lib/directoryParams'
import type { BusinessSort, ListingType, PriceRange } from '@/types/business'

export type DirectoryFilterState = Omit<DirectoryUrlState, 'page'>

interface DirectoryFiltersProps {
  value: DirectoryFilterState
  onChange: (next: DirectoryFilterState) => void
  onClear: () => void
  compact?: boolean
}

const listingTypes: { value: ListingType; label: string }[] = [
  { value: 'experience', label: 'Experience' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'transport', label: 'Transport' },
  { value: 'retail', label: 'Retail' },
  { value: 'activity', label: 'Activity' },
]

export function DirectoryFilters({ value, onChange, onClear, compact = false }: DirectoryFiltersProps) {
  const update = (patch: Partial<DirectoryFilterState>) => onChange({ ...value, ...patch })

  return (
    <div className={`space-y-5 ${compact ? '' : 'rounded-3xl border border-ocean/10 bg-white p-5 shadow-card'}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-ocean">Filters</h2>
        <button type="button" className="text-sm font-medium text-turquoise hover:text-turquoise-dark" onClick={onClear}>
          Clear all
        </button>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ocean">Keyword</span>
        <input
          value={value.q ?? ''}
          onChange={(event) => update({ q: event.target.value })}
          placeholder="Search businesses, tags, services…"
          className="w-full rounded-2xl border border-ocean/10 bg-ivory px-3 py-2.5 outline-none focus:border-turquoise"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ocean">Category</span>
        <select
          value={value.category ?? ''}
          onChange={(event) => update({ category: event.target.value || undefined })}
          className="w-full rounded-2xl border border-ocean/10 bg-ivory px-3 py-2.5 outline-none focus:border-turquoise"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ocean">Parish</span>
        <select
          value={value.parish ?? ''}
          onChange={(event) => update({ parish: event.target.value || undefined })}
          className="w-full rounded-2xl border border-ocean/10 bg-ivory px-3 py-2.5 outline-none focus:border-turquoise"
        >
          <option value="">All parishes</option>
          {locations.map((location) => (
            <option key={location.id} value={location.slug}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ocean">Listing type</span>
        <select
          value={typeof value.listingType === 'string' ? value.listingType : ''}
          onChange={(event) =>
            update({ listingType: (event.target.value || undefined) as ListingType | undefined })
          }
          className="w-full rounded-2xl border border-ocean/10 bg-ivory px-3 py-2.5 outline-none focus:border-turquoise"
        >
          <option value="">All types</option>
          {listingTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ocean">Price range</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGE_OPTIONS.map((price) => {
            const active = value.priceRange === price
            return (
              <button
                key={price}
                type="button"
                className={`rounded-full px-3 py-1.5 text-sm ${
                  active ? 'bg-turquoise text-white' : 'bg-sand text-ocean hover:bg-turquoise/10'
                }`}
                onClick={() => update({ priceRange: active ? undefined : (price as PriceRange) })}
              >
                {price}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.familyFriendly)}
            onChange={(event) => update({ familyFriendly: event.target.checked || undefined })}
          />
          Family-friendly
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.outdoor)}
            onChange={(event) => update({ outdoor: event.target.checked || undefined })}
          />
          Outdoor activities
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.accessibility)}
            onChange={(event) => update({ accessibility: event.target.checked || undefined })}
          />
          Accessibility info listed
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.featured)}
            onChange={(event) => update({ featured: event.target.checked || undefined })}
          />
          Featured only
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(value.favoritesOnly)}
            onChange={(event) => update({ favoritesOnly: event.target.checked || undefined })}
          />
          Favorites only
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ocean">Sort by</span>
        <select
          value={value.sort}
          onChange={(event) => update({ sort: event.target.value as BusinessSort })}
          className="w-full rounded-2xl border border-ocean/10 bg-ivory px-3 py-2.5 outline-none focus:border-turquoise"
        >
          <option value="relevance">Relevance</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
          <option value="featured">Featured first</option>
        </select>
      </label>
    </div>
  )
}
