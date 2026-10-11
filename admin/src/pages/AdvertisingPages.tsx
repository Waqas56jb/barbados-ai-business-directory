import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from '@/components/ui/primitives'
import { usePermission } from '@/hooks/usePermission'
import { formatCurrency, formatDate, statusLabel } from '@/lib/formatters'
import {
  approveCampaign,
  requestCampaignChanges,
  updateCampaignStatus,
} from '@/services/advertisingService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'
import type { PlacementConfig } from '@/types'

export function AdvertisingListPage() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const [search, setSearch] = useState('')
  const promotions = useAdminStore((s) => s.promotions)
  const businesses = useAdminStore((s) => s.businesses)
  const owners = useAdminStore((s) => s.owners)
  const settings = useAdminStore((s) => s.platformSettings)

  const filtered = promotions.filter((promo) => {
    if (status && promo.status !== status) return false
    if (search) {
      const q = search.toLowerCase()
      if (!promo.name.toLowerCase().includes(q) && !promo.id.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div>
      <PageHeader
        title="Advertising & Promotions"
        description="Review promotional campaign requests. No payment processing or real ad delivery is implemented."
        breadcrumbs={[{ label: 'Marketing' }, { label: 'Advertising' }]}
        actions={
          <Link to="/advertising/placements" className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-sand">
            Placement configuration
          </Link>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Search campaigns" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select
            value={status}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              if (e.target.value) next.set('status', e.target.value)
              else next.delete('status')
              setParams(next)
            }}
          >
            <option value="">All statuses</option>
            {['pending_review', 'approved', 'scheduled', 'active', 'paused', 'rejected', 'completed', 'cancelled'].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No campaigns match" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Placement</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((promo) => {
                const business = businesses.find((b) => b.id === promo.businessId)
                const owner = owners.find((o) => o.id === promo.ownerId)
                return (
                  <tr key={promo.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <p className="font-medium">{promo.name}</p>
                      <span className="mt-1 inline-flex rounded-full bg-coral/15 px-2 py-0.5 text-[11px] font-semibold text-coral">
                        {settings.sponsoredLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">{business?.name}</td>
                    <td className="px-4 py-3">{owner?.name}</td>
                    <td className="px-4 py-3">{statusLabel(promo.placement)}</td>
                    <td className="px-4 py-3">{formatDate(promo.startDate)} – {formatDate(promo.endDate)}</td>
                    <td className="px-4 py-3">{formatCurrency(promo.budget)}</td>
                    <td className="px-4 py-3"><StatusBadge status={promo.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/advertising/${promo.id}`} className="text-turquoise hover:underline">Review</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function AdvertisingDetailPage() {
  const { id = '' } = useParams()
  const canModerate = usePermission('advertising.moderate')
  const promotions = useAdminStore((s) => s.promotions)
  const businesses = useAdminStore((s) => s.businesses)
  const settings = useAdminStore((s) => s.platformSettings)
  const push = useToastStore((s) => s.push)
  const [reason, setReason] = useState('')
  const promo = promotions.find((item) => item.id === id)
  const business = businesses.find((item) => item.id === promo?.businessId)

  if (!promo) return <EmptyState title="Campaign not found" />

  return (
    <div>
      <PageHeader
        title={promo.name}
        description="Campaign moderation workspace for demo advertising requests."
        breadcrumbs={[{ label: 'Advertising', href: '/advertising' }, { label: promo.name }]}
        actions={<StatusBadge status={promo.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="p-5 space-y-3 text-sm">
          <p><span className="text-muted">Business:</span> <Link to={`/businesses/${business?.id}`} className="text-turquoise hover:underline">{business?.name}</Link></p>
          <p><span className="text-muted">Placement:</span> {statusLabel(promo.placement)}</p>
          <p><span className="text-muted">Schedule:</span> {formatDate(promo.startDate)} – {formatDate(promo.endDate)}</p>
          <p><span className="text-muted">Budget:</span> {formatCurrency(promo.budget)}</p>
          <p>{promo.description}</p>
          <div className="rounded-2xl border border-dashed border-border p-4">
            <span className="rounded-full bg-coral/15 px-2.5 py-1 text-xs font-semibold text-coral">{settings.sponsoredLabel}</span>
            <p className="mt-3 font-display text-xl text-ocean">{business?.name}</p>
            <p className="mt-1 text-muted">Sponsored placement preview — clearly labeled as advertising.</p>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-xl text-ocean">Moderation actions</h2>
          {!canModerate ? (
            <p className="mt-2 text-sm text-muted">Your demo role cannot moderate campaigns.</p>
          ) : (
            <>
              <Field label="Reason for rejection or change request">
                <Textarea className="mt-3" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
              </Field>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={async () => {
                    await approveCampaign(promo.id)
                    push({ title: 'Campaign approved (demo)', tone: 'success' })
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await requestCampaignChanges(promo.id, reason)
                      push({ title: 'Changes requested', tone: 'success' })
                    } catch (error) {
                      push({ title: error instanceof Error ? error.message : 'Reason required', tone: 'error' })
                    }
                  }}
                >
                  Request changes
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await updateCampaignStatus(promo.id, 'rejected', reason)
                      push({ title: 'Campaign rejected (demo)', tone: 'success' })
                    } catch (error) {
                      push({ title: error instanceof Error ? error.message : 'Reason required', tone: 'error' })
                    }
                  }}
                >
                  Reject
                </Button>
                <Button variant="secondary" onClick={async () => { await updateCampaignStatus(promo.id, 'scheduled'); push({ title: 'Campaign scheduled (demo)', tone: 'success' }) }}>Schedule</Button>
                <Button variant="secondary" onClick={async () => { await updateCampaignStatus(promo.id, 'active'); push({ title: 'Campaign activated in demo state', tone: 'success' }) }}>Activate</Button>
                <Button variant="outline" onClick={async () => { await updateCampaignStatus(promo.id, 'paused'); push({ title: 'Campaign paused', tone: 'success' }) }}>Pause</Button>
                <Button variant="outline" onClick={async () => { await updateCampaignStatus(promo.id, 'completed'); push({ title: 'Campaign completed', tone: 'success' }) }}>Complete</Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await updateCampaignStatus(promo.id, 'cancelled', reason || 'Cancelled in demo')
                      push({ title: 'Campaign cancelled', tone: 'success' })
                    } catch (error) {
                      push({ title: error instanceof Error ? error.message : 'Reason required', tone: 'error' })
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export function PlacementsPage() {
  const canModerate = usePermission('advertising.moderate')
  const placements = useAdminStore((s) => s.placements)
  const upsertPlacement = useAdminStore((s) => s.upsertPlacement)
  const push = useToastStore((s) => s.push)
  const [editing, setEditing] = useState<PlacementConfig | null>(null)

  return (
    <div>
      <PageHeader
        title="Placement configuration"
        description="Configure mock advertising placements and simple eligibility rules."
        breadcrumbs={[{ label: 'Advertising', href: '/advertising' }, { label: 'Placements' }]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {placements.map((placement) => (
          <Card key={placement.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-ocean">{placement.name}</h2>
                <p className="mt-1 text-sm text-muted">{placement.description}</p>
              </div>
              <StatusBadge status={placement.active ? 'active' : 'archived'} />
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-muted">Type</dt><dd>{statusLabel(placement.placementType)}</dd></div>
              <div><dt className="text-muted">Max campaigns</dt><dd>{placement.maxCampaigns}</dd></div>
              <div><dt className="text-muted">Duration options</dt><dd>{placement.durationOptions}</dd></div>
              <div><dt className="text-muted">Eligibility</dt><dd>{placement.eligibility}</dd></div>
            </dl>
            {canModerate ? (
              <Button size="sm" variant="outline" className="mt-4" onClick={() => setEditing(placement)}>
                Edit placement
              </Button>
            ) : null}
          </Card>
        ))}
      </div>

      {editing && canModerate ? (
        <Card className="mt-6 p-5 space-y-3">
          <CardHeader title={`Edit ${editing.name}`} />
          <Field label="Description">
            <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
          <Field label="Maximum displayed campaigns">
            <Input
              type="number"
              value={editing.maxCampaigns}
              onChange={(e) => setEditing({ ...editing, maxCampaigns: Number(e.target.value) })}
            />
          </Field>
          <Field label="Duration options">
            <Input value={editing.durationOptions} onChange={(e) => setEditing({ ...editing, durationOptions: e.target.value })} />
          </Field>
          <Field label="Eligibility rules">
            <Textarea rows={3} value={editing.eligibility} onChange={(e) => setEditing({ ...editing, eligibility: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.active}
              onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                upsertPlacement(editing)
                push({ title: 'Placement updated (demo)', tone: 'success' })
                setEditing(null)
              }}
            >
              Save placement
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
