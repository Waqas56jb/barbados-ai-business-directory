import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from '@/components/ui/primitives'
import { parishes } from '@/config/site'
import { usePermission } from '@/hooks/usePermission'
import { exportCsv, formatDate } from '@/lib/formatters'
import { getBusinessById, getBusinesses, setBusinessStatus, updateBusiness } from '@/services/businessService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'
import type { ListingStatus } from '@/types'

export function BusinessesListPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const categories = useAdminStore((s) => s.categories)
  const owners = useAdminStore((s) => s.owners)
  const filters = {
    search,
    category: params.get('category') ?? '',
    parish: params.get('parish') ?? '',
    ownerId: params.get('ownerId') ?? '',
    status: params.get('status') ?? '',
    featured: params.get('featured') ?? '',
    sponsored: params.get('sponsored') ?? '',
  }
  const { data = [], isLoading } = useQuery({
    queryKey: ['businesses', filters],
    queryFn: () => getBusinesses(filters),
  })

  const pageRows = data.slice((page - 1) * pageSize, page * pageSize)
  const pages = Math.max(1, Math.ceil(data.length / pageSize))

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
    setPage(1)
  }

  return (
    <div>
      <PageHeader
        title="Business Directory"
        description="Administrative directory of fictional Barbados tourism listings."
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Business Directory' }]}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv(
                'demo-businesses.csv',
                data.map((b) => ({
                  name: b.name,
                  category: b.category,
                  parish: b.parish,
                  status: b.status,
                  featured: b.featured,
                  sponsored: b.sponsored,
                })),
              )
            }
          >
            Export CSV
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          <Input
            placeholder="Search businesses"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <Select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select value={filters.parish} onChange={(e) => updateFilter('parish', e.target.value)}>
            <option value="">All parishes</option>
            {parishes.map((parish) => (
              <option key={parish} value={parish}>{parish}</option>
            ))}
          </Select>
          <Select value={filters.ownerId} onChange={(e) => updateFilter('ownerId', e.target.value)}>
            <option value="">All owners</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>{owner.name}</option>
            ))}
          </Select>
          <Select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
            <option value="">All statuses</option>
            {['published', 'pending_review', 'in_review', 'changes_requested', 'rejected', 'suspended', 'archived', 'draft'].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>
          <Select value={filters.featured} onChange={(e) => updateFilter('featured', e.target.value)}>
            <option value="">Featured: any</option>
            <option value="yes">Featured</option>
            <option value="no">Not featured</option>
          </Select>
          <Select value={filters.sponsored} onChange={(e) => updateFilter('sponsored', e.target.value)}>
            <option value="">Sponsored: any</option>
            <option value="yes">Sponsored</option>
            <option value="no">Not sponsored</option>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-8 text-sm text-muted">Loading businesses…</Card>
      ) : data.length === 0 ? (
        <EmptyState title="No listings found" description="Try clearing filters to browse demo businesses." />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-white lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Parish</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((business) => {
                  const owner = owners.find((item) => item.id === business.ownerId)
                  return (
                    <tr key={business.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={business.coverImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium">{business.name}</p>
                            <p className="text-xs text-muted">{business.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{business.category}</td>
                      <td className="px-4 py-3">{business.parish}</td>
                      <td className="px-4 py-3">{owner?.name ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={business.status} /></td>
                      <td className="px-4 py-3 text-xs">
                        {business.featured ? 'Featured · ' : ''}
                        {business.sponsored ? 'Sponsored' : business.featured ? '' : '—'}
                      </td>
                      <td className="px-4 py-3">{formatDate(business.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <Link to={`/businesses/${business.id}`} className="text-turquoise hover:underline">Open</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 lg:hidden">
            {pageRows.map((business) => (
              <Card key={business.id} className="overflow-hidden">
                <img src={business.coverImage} alt="" className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-ocean">{business.name}</p>
                    <StatusBadge status={business.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted">{business.category} · {business.parish}</p>
                  <Link to={`/businesses/${business.id}`} className="mt-3 inline-block text-sm text-turquoise">View details</Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <p className="text-sm text-muted">Page {page} of {pages}</p>
            <Button variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </>
      )}
    </div>
  )
}

export function BusinessDetailPage() {
  const { id = '' } = useParams()
  const canEdit = usePermission('businesses.edit')
  const push = useToastStore((s) => s.push)
  const owners = useAdminStore((s) => s.owners)
  const knowledge = useAdminStore((s) => s.knowledge)
  const audits = useAdminStore((s) => s.auditLogs)
  const [confirm, setConfirm] = useState<ListingStatus | null>(null)
  const { data: business, refetch, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => getBusinessById(id),
    enabled: Boolean(id),
  })
  const [draft, setDraft] = useState<{ description: string; phone: string; email: string } | null>(null)

  const owner = useMemo(
    () => owners.find((item) => item.id === business?.ownerId),
    [owners, business],
  )
  const knowledgePreview = knowledge.find((item) => item.businessId === id && item.sourceType === 'business_listing')

  if (isLoading) return <Card className="p-8 text-sm text-muted">Loading business…</Card>
  if (!business) return <EmptyState title="Business not found" />

  const form = draft ?? {
    description: business.description,
    phone: business.phone ?? '',
    email: business.email ?? '',
  }

  return (
    <div>
      <PageHeader
        title={business.name}
        description="Inspect and edit demo listing data. Changes sync to knowledge and public preview state."
        breadcrumbs={[{ label: 'Business Directory', href: '/businesses' }, { label: business.name }]}
        actions={<StatusBadge status={business.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <img src={business.coverImage} alt="" className="h-56 w-full rounded-t-2xl object-cover" />
          <div className="space-y-4 p-5 text-sm">
            <div className="flex flex-wrap gap-2">
              {business.featured ? <StatusBadge status="active" /> : null}
              {business.sponsored ? <span className="rounded-full bg-coral/15 px-2.5 py-1 text-xs font-semibold text-coral">Sponsored</span> : null}
            </div>
            <p>{business.description}</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div><dt className="text-muted">Category</dt><dd>{business.category}</dd></div>
              <div><dt className="text-muted">Parish</dt><dd>{business.parish}</dd></div>
              <div><dt className="text-muted">Location</dt><dd>{business.locationLabel}</dd></div>
              <div><dt className="text-muted">Owner</dt><dd><Link to={`/business-owners/${owner?.id}`} className="text-turquoise hover:underline">{owner?.name}</Link></dd></div>
              <div><dt className="text-muted">Phone</dt><dd>{business.phone || 'Not listed'}</dd></div>
              <div><dt className="text-muted">Email</dt><dd>{business.email || 'Not listed'}</dd></div>
            </dl>
            <div>
              <h3 className="font-semibold text-ocean">Services</h3>
              <ul className="mt-2 space-y-2">
                {business.services.map((service) => (
                  <li key={service.id} className="rounded-xl bg-sand/50 px-3 py-2">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-muted">{service.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Public listing preview" description="Simulated visitor view from current mock status." />
            <div className="px-5 pb-5 text-sm">
              {business.status === 'published' ? (
                <div className="rounded-xl border border-border p-4">
                  <p className="font-display text-xl text-ocean">{business.name}</p>
                  <p className="mt-1 text-muted">{business.shortDescription}</p>
                  <p className="mt-3">{business.locationLabel}, {business.parish}</p>
                </div>
              ) : (
                <p className="text-muted">Listing is not treated as publicly published in demo state ({business.status}).</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="AI knowledge preview" />
            <div className="px-5 pb-5 text-sm">
              <p className="text-muted">{knowledgePreview?.content ?? 'No knowledge record linked.'}</p>
              {knowledgePreview ? (
                <Link to={`/knowledge/${knowledgePreview.id}`} className="mt-3 inline-block text-turquoise hover:underline">
                  Open knowledge record
                </Link>
              ) : null}
            </div>
          </Card>

          {canEdit ? (
            <Card className="p-5">
              <h2 className="font-display text-xl text-ocean">Edit demo record</h2>
              <div className="mt-3 space-y-3">
                <Field label="Description">
                  <Textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setDraft({ ...form, description: e.target.value })}
                  />
                </Field>
                <Field label="Phone">
                  <Input value={form.phone} onChange={(e) => setDraft({ ...form, phone: e.target.value })} />
                </Field>
                <Field label="Email">
                  <Input value={form.email} onChange={(e) => setDraft({ ...form, email: e.target.value })} />
                </Field>
                <Button
                  onClick={async () => {
                    await updateBusiness(business.id, {
                      description: form.description,
                      phone: form.phone || undefined,
                      email: form.email || undefined,
                    })
                    push({ title: 'Business updated in demo state', tone: 'success' })
                    setDraft(null)
                    void refetch()
                  }}
                >
                  Save changes
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => void updateBusiness(business.id, { featured: !business.featured }).then(() => { push({ title: 'Featured flag toggled (demo)', tone: 'success' }); void refetch() })}>
                  {business.featured ? 'Remove featured' : 'Mark featured'}
                </Button>
                <Button variant="outline" onClick={() => setConfirm('archived')}>Archive</Button>
                <Button variant="danger" onClick={() => setConfirm('suspended')}>Suspend</Button>
                <Button variant="secondary" onClick={() => setConfirm('published')}>Restore published</Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader title="Related audit history" />
        <ul className="divide-y divide-border">
          {audits
            .filter((log) => log.entityId === business.id)
            .slice(0, 8)
            .map((log) => (
              <li key={log.id} className="px-5 py-3 text-sm">
                <p className="font-medium">{log.summary}</p>
                <p className="text-muted">{formatDate(log.createdAt)} · {log.actorName}</p>
              </li>
            ))}
        </ul>
      </Card>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Confirm listing status change"
        message={`This updates only local demo data. New status: ${confirm}. Suspended or archived listings are excluded from the simulated public chatbot as active published businesses.`}
        confirmLabel="Apply demo status"
        danger={confirm === 'suspended'}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return
          void setBusinessStatus(business.id, confirm).then(() => {
            push({ title: `Listing set to ${confirm} (demo)`, tone: 'success' })
            void refetch()
          })
        }}
      />
    </div>
  )
}
