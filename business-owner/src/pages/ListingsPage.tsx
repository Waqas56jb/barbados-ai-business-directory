import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { BusinessStatus } from '@/types'

export function ListingsPage() {
  const listings = useDemoStore((state) => state.listings)
  const businesses = useDemoStore((state) => state.businesses)
  const setBusinessStatus = useDemoStore((state) => state.setBusinessStatus)
  const pushToast = useToastStore((state) => state.push)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<BusinessStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const rows = useMemo(() => {
    return listings
      .map((listing) => ({
        listing,
        business: businesses.find((item) => item.id === listing.businessId),
      }))
      .filter((row) => row.business)
      .filter((row) => (status === 'all' ? true : row.listing.status === status))
      .filter((row) => {
        if (!q.trim()) return true
        const query = q.toLowerCase()
        return (
          row.listing.title.toLowerCase().includes(query) ||
          row.business?.category.toLowerCase().includes(query) ||
          row.business?.parish.toLowerCase().includes(query)
        )
      })
  }, [listings, businesses, q, status])

  const selected = rows.find((row) => row.listing.id === selectedId)

  return (
    <div>
      <PageHeader
        title="Listings"
        description="Public listing records stay synchronized with business profile edits in demo state."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Listings' }]}
      />
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <Input placeholder="Search listings…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value as BusinessStatus | 'all')}>
          <option value="all">All statuses</option>
          {['draft', 'pending_review', 'published', 'changes_requested', 'rejected', 'suspended', 'archived'].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand/50 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Listing</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ listing, business }) => (
                  <tr
                    key={listing.id}
                    className={`cursor-pointer border-t border-border hover:bg-sand/30 ${selectedId === listing.id ? 'bg-sand/40' : ''}`}
                    onClick={() => setSelectedId(listing.id)}
                  >
                    <td className="px-4 py-3 font-medium text-ocean">{listing.title}</td>
                    <td className="px-3 py-3">{business?.category}</td>
                    <td className="px-3 py-3">{business?.locationLabel}</td>
                    <td className="px-3 py-3"><StatusBadge status={listing.status} /></td>
                    <td className="px-3 py-3">{listing.completionScore}%</td>
                    <td className="px-3 py-3 text-muted">{formatDate(listing.lastUpdated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          {selected?.business ? (
            <div className="space-y-3">
              <h2 className="font-display text-2xl text-ocean">{selected.business.name}</h2>
              <StatusBadge status={selected.listing.status} />
              <p className="text-sm text-muted">{selected.business.shortDescription}</p>
              <p className="text-sm">{selected.business.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link to={`/businesses/${selected.business.id}`}><Button size="sm">Open preview</Button></Link>
                <Link to={`/businesses/${selected.business.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setBusinessStatus(selected.business!.id, 'pending_review')
                    pushToast({ title: 'Listing submitted for review (demo)', tone: 'success' })
                  }}
                >
                  Submit for Review
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">Select a listing to inspect public-facing details.</p>
          )}
        </Card>
      </div>
    </div>
  )
}
