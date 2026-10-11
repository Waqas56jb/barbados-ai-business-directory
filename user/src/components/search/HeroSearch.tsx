import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { categories } from '@/data/categories'
import { locations } from '@/data/locations'
import { quickSearchChips, heroContent } from '@/data/homepage'

export function HeroSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [parish, setParish] = useState('')

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('category', category)
    if (parish) params.set('parish', parish)
    navigate(`/directory?${params.toString()}`)
  }

  return (
    <div className="rounded-[2rem] border border-white/20 bg-white/95 p-4 shadow-soft backdrop-blur sm:p-6">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={heroContent.placeholder}
            className="w-full rounded-2xl border border-ocean/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-turquoise"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-ocean/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-turquoise"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">Location</span>
          <select
            value={parish}
            onChange={(event) => setParish(event.target.value)}
            className="w-full rounded-2xl border border-ocean/10 bg-ivory px-4 py-3 text-sm outline-none focus:border-turquoise"
          >
            <option value="">All parishes</option>
            {locations.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickSearchChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="rounded-full bg-sand px-3 py-1.5 text-xs font-medium text-ocean hover:bg-turquoise hover:text-white"
            onClick={() => {
              const params = new URLSearchParams()
              if (chip.query) params.set('q', chip.query)
              if (chip.category) params.set('category', chip.category)
              navigate(`/directory?${params.toString()}`)
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
