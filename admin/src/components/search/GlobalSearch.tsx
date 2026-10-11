import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '@/store/adminStore'

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const businesses = useAdminStore((s) => s.businesses)
  const owners = useAdminStore((s) => s.owners)
  const categories = useAdminStore((s) => s.categories)
  const promotions = useAdminStore((s) => s.promotions)
  const reports = useAdminStore((s) => s.reports)
  const knowledge = useAdminStore((s) => s.knowledge)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return [
      {
        label: 'Businesses',
        items: businesses
          .filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))
          .slice(0, 5)
          .map((b) => ({ id: b.id, label: b.name, href: `/businesses/${b.id}` })),
      },
      {
        label: 'Owners',
        items: owners
          .filter((o) => o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q))
          .slice(0, 5)
          .map((o) => ({ id: o.id, label: o.name, href: `/business-owners/${o.id}` })),
      },
      {
        label: 'Categories',
        items: categories
          .filter((c) => c.name.toLowerCase().includes(q))
          .slice(0, 5)
          .map((c) => ({ id: c.id, label: c.name, href: '/categories' })),
      },
      {
        label: 'Campaigns',
        items: promotions
          .filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
          .slice(0, 5)
          .map((p) => ({ id: p.id, label: p.name, href: `/advertising/${p.id}` })),
      },
      {
        label: 'Reports',
        items: reports
          .filter((r) => r.id.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q))
          .slice(0, 5)
          .map((r) => ({ id: r.id, label: r.id, href: '/reports' })),
      },
      {
        label: 'Knowledge',
        items: knowledge
          .filter((k) => k.title.toLowerCase().includes(q) || k.id.toLowerCase().includes(q))
          .slice(0, 5)
          .map((k) => ({ id: k.id, label: k.title, href: `/knowledge/${k.id}` })),
      },
    ].filter((group) => group.items.length > 0)
  }, [query, businesses, owners, categories, promotions, reports, knowledge])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ocean/40 p-3 pt-4 sm:p-4 sm:pt-[12vh]" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0" aria-label="Close search" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search businesses, owners, campaigns, knowledge…"
            className="w-full border-0 bg-transparent text-sm outline-none"
            aria-label="Global search"
          />
          <button type="button" className="rounded-lg p-2 hover:bg-sand" aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-3">
          {!query.trim() ? (
            <p className="px-2 py-6 text-center text-sm text-muted">Type to search demo records.</p>
          ) : groups.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted">No matching demo records.</p>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted uppercase">{group.label}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={`${group.label}-${item.id}`}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-sand"
                        onClick={() => {
                          navigate(item.href)
                          onClose()
                          setQuery('')
                        }}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-muted">{item.id}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
