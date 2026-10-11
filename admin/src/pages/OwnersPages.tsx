import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from '@/components/ui/primitives'
import { usePermission } from '@/hooks/usePermission'
import { exportCsv, formatDate, formatDateTime } from '@/lib/formatters'
import { getOwnerById, getOwners, updateOwnerStatus } from '@/services/ownerService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'
import type { AccountStatus } from '@/types'

export function OwnersListPage() {
  const canManage = usePermission('owners.manage')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState<'name' | 'createdAt' | 'lastActivityAt'>('createdAt')
  const [page, setPage] = useState(1)
  const pageSize = 8
  const { data = [], isLoading } = useQuery({
    queryKey: ['owners', search, status],
    queryFn: () => getOwners({ search, status }),
  })
  const businesses = useAdminStore((s) => s.businesses)

  const rows = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      return String(b[sort]).localeCompare(String(a[sort]))
    })
    return sorted
  }, [data, sort])

  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize)
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))

  return (
    <div>
      <PageHeader
        title="Business Owners"
        description="Manage fictional business owner accounts used across the admin demo."
        breadcrumbs={[{ label: 'Marketplace', href: '/dashboard' }, { label: 'Business Owners' }]}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv(
                'demo-owners.csv',
                rows.map((owner) => ({
                  name: owner.name,
                  email: owner.email,
                  status: owner.status,
                  businesses: owner.businessIds.length,
                  createdAt: owner.createdAt,
                })),
              )
            }
          >
            Export CSV
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="restricted">Restricted</option>
            <option value="suspended">Suspended</option>
            <option value="invited">Invited</option>
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="createdAt">Sort by registration</option>
            <option value="lastActivityAt">Sort by last activity</option>
            <option value="name">Sort by name</option>
          </Select>
          <p className="self-center text-sm text-muted">{rows.length} owners · demo data</p>
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-8 text-sm text-muted">Loading owners…</Card>
      ) : rows.length === 0 ? (
        <EmptyState title="No owners match" description="Adjust filters to see demo owner accounts." />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-white md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Businesses</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Last activity</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((owner) => {
                  const listingStatuses = businesses
                    .filter((b) => b.ownerId === owner.id)
                    .map((b) => b.status)
                  return (
                    <tr key={owner.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{owner.name}</td>
                      <td className="px-4 py-3">{owner.email}</td>
                      <td className="px-4 py-3">{owner.businessIds.length}</td>
                      <td className="px-4 py-3"><StatusBadge status={owner.status} /></td>
                      <td className="px-4 py-3">{formatDate(owner.createdAt)}</td>
                      <td className="px-4 py-3">{formatDate(owner.lastActivityAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/business-owners/${owner.id}`} className="text-turquoise hover:underline">View</Link>
                          {canManage ? (
                            <Link to={`/businesses?ownerId=${owner.id}`} className="text-muted hover:underline">Listings</Link>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-muted">Listings: {listingStatuses.join(', ') || 'none'}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {pageRows.map((owner) => (
              <Card key={owner.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ocean">{owner.name}</p>
                    <p className="text-sm text-muted">{owner.email}</p>
                  </div>
                  <StatusBadge status={owner.status} />
                </div>
                <p className="mt-3 text-sm">{owner.businessIds.length} businesses · {formatDate(owner.createdAt)}</p>
                <Link to={`/business-owners/${owner.id}`} className="mt-3 inline-block text-sm text-turquoise">Open profile</Link>
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

export function OwnerDetailPage() {
  const { id = '' } = useParams()
  const canManage = usePermission('owners.manage')
  const push = useToastStore((s) => s.push)
  const [note, setNote] = useState('')
  const [confirm, setConfirm] = useState<AccountStatus | null>(null)
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['owner', id],
    queryFn: () => getOwnerById(id),
    enabled: Boolean(id),
  })

  if (isLoading) return <Card className="p-8 text-sm text-muted">Loading owner…</Card>
  if (!data) return <EmptyState title="Owner not found" description="This demo owner id does not exist." />

  const { owner, businesses, promotions, audits } = data

  async function applyStatus(status: AccountStatus) {
    await updateOwnerStatus(owner.id, status, note || undefined)
    push({ title: `Owner status set to ${status} (demo)`, tone: 'success' })
    setNote('')
    void refetch()
  }

  return (
    <div>
      <PageHeader
        title={owner.name}
        description="Demo owner profile with linked businesses, promotions, and audit events."
        breadcrumbs={[
          { label: 'Business Owners', href: '/business-owners' },
          { label: owner.name },
        ]}
        actions={<StatusBadge status={owner.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader title="Profile" />
          <dl className="grid gap-3 px-5 pb-5 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">Email</dt><dd>{owner.email}</dd></div>
            <div><dt className="text-muted">Registered</dt><dd>{formatDate(owner.createdAt)}</dd></div>
            <div><dt className="text-muted">Last activity</dt><dd>{formatDateTime(owner.lastActivityAt)}</dd></div>
            <div><dt className="text-muted">Notes</dt><dd>{owner.notes || '—'}</dd></div>
          </dl>
        </Card>

        {canManage ? (
          <Card className="p-5">
            <h2 className="font-display text-xl text-ocean">Demo account actions</h2>
            <p className="mt-1 text-sm text-muted">These actions only update local demo state. They do not suspend real accounts.</p>
            <Textarea className="mt-3" rows={3} placeholder="Internal note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setConfirm('active')}>Restore active</Button>
              <Button variant="outline" onClick={() => setConfirm('restricted')}>Simulate restriction</Button>
              <Button variant="danger" onClick={() => setConfirm('suspended')}>Simulate suspension</Button>
            </div>
          </Card>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Managed businesses" />
          <ul className="divide-y divide-border">
            {businesses.map((business) => (
              <li key={business.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <Link to={`/businesses/${business.id}`} className="font-medium text-turquoise hover:underline">{business.name}</Link>
                  <p className="text-muted">{business.parish}</p>
                </div>
                <StatusBadge status={business.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Promotions" />
          <ul className="divide-y divide-border">
            {promotions.length === 0 ? <li className="px-5 py-4 text-sm text-muted">No promotions</li> : null}
            {promotions.map((promo) => (
              <li key={promo.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <Link to={`/advertising/${promo.id}`} className="text-turquoise hover:underline">{promo.name}</Link>
                <StatusBadge status={promo.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Audit events" />
        <ul className="divide-y divide-border">
          {audits.length === 0 ? <li className="px-5 py-4 text-sm text-muted">No owner-specific audit events yet.</li> : null}
          {audits.map((log) => (
            <li key={log.id} className="px-5 py-3 text-sm">
              <p className="font-medium">{log.summary}</p>
              <p className="text-muted">{formatDateTime(log.createdAt)}</p>
            </li>
          ))}
        </ul>
      </Card>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Confirm demo account change"
        message={`This will set the owner status to ${confirm} in local demo data only. It does not affect a real account.`}
        confirmLabel="Update demo status"
        danger={confirm === 'suspended'}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) void applyStatus(confirm)
        }}
      />
    </div>
  )
}
