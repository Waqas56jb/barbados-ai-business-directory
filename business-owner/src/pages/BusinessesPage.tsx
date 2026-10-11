import { MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input, Select } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { businessCategories } from '@/config/site'
import { formatDate } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { BusinessStatus } from '@/types'

export function BusinessesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const businesses = useDemoStore((state) => state.businesses)
  const duplicateBusiness = useDemoStore((state) => state.duplicateBusiness)
  const archiveBusiness = useDemoStore((state) => state.archiveBusiness)
  const setBusinessStatus = useDemoStore((state) => state.setBusinessStatus)
  const pushToast = useToastStore((state) => state.push)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [archiveId, setArchiveId] = useState<string | null>(null)

  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'all'
  const status = (searchParams.get('status') ?? 'all') as BusinessStatus | 'all'
  const sort = searchParams.get('sort') ?? 'updated'

  const filtered = useMemo(() => {
    let items = [...businesses]
    if (q.trim()) {
      const query = q.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.parish.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
    }
    if (category !== 'all') items = items.filter((item) => item.category === category)
    if (status !== 'all') items = items.filter((item) => item.status === status)
    items.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'completion') return b.completionPercentage - a.completionPercentage
      return b.updatedAt.localeCompare(a.updatedAt)
    })
    return items
  }, [businesses, q, category, status, sort])

  return (
    <div>
      <PageHeader
        title="My Businesses"
        description="Manage one or more Barbados tourism businesses in this demo account."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Businesses' }]}
        actions={<Link to="/businesses/new"><Button>Add a Listing</Button></Link>}
      />

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <Input
          placeholder="Search businesses…"
          value={q}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams)
            if (event.target.value) next.set('q', event.target.value)
            else next.delete('q')
            setSearchParams(next)
          }}
        />
        <Select
          value={category}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams)
            next.set('category', event.target.value)
            setSearchParams(next)
          }}
        >
          <option value="all">All categories</option>
          {businessCategories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams)
            next.set('status', event.target.value)
            setSearchParams(next)
          }}
        >
          <option value="all">All statuses</option>
          {['draft', 'pending_review', 'published', 'changes_requested', 'rejected', 'suspended', 'archived'].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams)
            next.set('sort', event.target.value)
            setSearchParams(next)
          }}
        >
          <option value="updated">Last updated</option>
          <option value="name">Name</option>
          <option value="completion">Completion</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No businesses found" description="Try clearing filters or create a new listing." action={<Link to="/businesses/new"><Button>Add listing</Button></Link>} />
      ) : (
        <div className="grid gap-4">
          {filtered.map((business) => (
            <article key={business.id} className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-card md:grid-cols-[140px_1fr_auto]">
              <img src={business.coverImage} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl text-ocean">{business.name}</h2>
                  <StatusBadge status={business.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{business.category} · {business.parish}</p>
                <p className="mt-2 text-sm text-ink/80">{business.shortDescription}</p>
                <p className="mt-3 text-xs text-muted">
                  Completion {business.completionPercentage}% · Updated {formatDate(business.updatedAt)}
                </p>
              </div>
              <div className="relative flex items-start justify-end">
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-sand"
                  aria-label={`Actions for ${business.name}`}
                  onClick={() => setMenuFor(menuFor === business.id ? null : business.id)}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {menuFor === business.id ? (
                  <div className="absolute top-10 right-0 z-10 w-52 rounded-xl border border-border bg-white py-1 shadow-soft">
                    <Link className="block px-3 py-2 text-sm hover:bg-sand" to={`/businesses/${business.id}`}>View</Link>
                    <Link className="block px-3 py-2 text-sm hover:bg-sand" to={`/businesses/${business.id}/edit`}>Edit</Link>
                    <Link className="block px-3 py-2 text-sm hover:bg-sand" to={`/businesses/${business.id}`}>Preview Public Listing</Link>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-sand"
                      onClick={() => {
                        duplicateBusiness(business.id)
                        pushToast({ title: 'Duplicated as draft', tone: 'success' })
                        setMenuFor(null)
                      }}
                    >
                      Duplicate as Draft
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-sand"
                      onClick={() => {
                        setBusinessStatus(business.id, 'pending_review')
                        pushToast({ title: 'Submitted for review (demo)', tone: 'success' })
                        setMenuFor(null)
                      }}
                    >
                      Submit for Review
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm text-coral hover:bg-sand"
                      onClick={() => {
                        setArchiveId(business.id)
                        setMenuFor(null)
                      }}
                    >
                      Archive
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(archiveId)}
        title="Archive business?"
        message="This marks the business as archived in local demo state. You can still view it later."
        confirmLabel="Archive"
        danger
        onClose={() => setArchiveId(null)}
        onConfirm={() => {
          if (!archiveId) return
          archiveBusiness(archiveId)
          pushToast({ title: 'Business archived in demo state', tone: 'info' })
        }}
      />
    </div>
  )
}
