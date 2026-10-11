import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Input,
  PageHeader,
  StatusBadge,
  Textarea,
} from '@/components/ui/primitives'
import { usePermission } from '@/hooks/usePermission'
import { formatDateTime } from '@/lib/formatters'
import {
  approveListing,
  getPendingListings,
  rejectListing,
  requestListingChanges,
} from '@/services/moderationService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'

const tabs = [
  { id: 'pending', label: 'Queue' },
  { id: 'new', label: 'New submissions' },
  { id: 'updated', label: 'Updated listings' },
  { id: 'changes', label: 'Changes requested' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'approved', label: 'Approved' },
  { id: 'all', label: 'All records' },
]

const checklist = [
  'Business name and description are complete',
  'Category is appropriate',
  'Location and parish are consistent',
  'Contact details are correctly formatted',
  'Images meet expected standards',
  'Services and prices are clearly described',
  'Missing information is not presented as confirmed',
  'Listing content does not contain obvious spam',
  'Listing is appropriate for the tourism marketplace',
]

export function ApprovalsListPage() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'pending'
  const [search, setSearch] = useState('')
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['approvals', tab, search],
    queryFn: () => getPendingListings({ tab, search }),
  })

  return (
    <div>
      <PageHeader
        title="Listing Approvals"
        description="Review queue for new and updated fictional business listings. Checklist items are administrative aids only."
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Listing Approvals' }]}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm ${tab === item.id ? 'bg-ocean text-white' : 'bg-white text-ocean border border-border'}`}
            onClick={() => {
              const next = new URLSearchParams(params)
              next.set('tab', item.id)
              setParams(next)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Card className="mb-4 p-4">
        <Input placeholder="Search by business, owner, or review id" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      {isLoading ? (
        <Card className="p-8 text-sm text-muted">Loading moderation queue…</Card>
      ) : data.length === 0 ? (
        <EmptyState title="Queue is empty" description="No demo listings match this filter." />
      ) : (
        <div className="space-y-3">
          {data.map((row) => (
            <Card key={row.review.id} className="p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold text-ocean">{row.business?.name}</p>
                  <p className="text-sm text-muted">
                    {row.owner?.name} · submitted {formatDateTime(row.review.submittedAt)} · v{row.review.version}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={row.review.reviewStatus} />
                  <Link to={`/approvals/${row.business?.id}`} className="text-sm text-turquoise hover:underline">
                    Review
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          <Button variant="ghost" className="hidden" onClick={() => void refetch()}>Refresh</Button>
        </div>
      )}
    </div>
  )
}

export function ApprovalDetailPage() {
  const { id = '' } = useParams()
  const canModerate = usePermission('approvals.moderate')
  const push = useToastStore((s) => s.push)
  const businesses = useAdminStore((s) => s.businesses)
  const owners = useAdminStore((s) => s.owners)
  const listingReviews = useAdminStore((s) => s.listingReviews)
  const knowledge = useAdminStore((s) => s.knowledge)
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')

  const business = businesses.find((item) => item.id === id)
  const owner = owners.find((item) => item.id === business?.ownerId)
  const review = listingReviews.find((item) => item.businessId === id)
  const knowledgePreview = knowledge.find((item) => item.businessId === id && item.sourceType === 'business_listing')
  const checklistComplete = useMemo(
    () => checklist.every((_, index) => checked[index]),
    [checked],
  )

  if (!business || !review) {
    return <EmptyState title="Approval record not found" description="Open a listing from the moderation queue." />
  }

  return (
    <div>
      <PageHeader
        title={`Review: ${business.name}`}
        description="Side-by-side moderation workspace for demo listings."
        breadcrumbs={[
          { label: 'Listing Approvals', href: '/approvals' },
          { label: business.name },
        ]}
        actions={<StatusBadge status={business.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Listing content" description={`Version ${review.version}`} />
          <div className="space-y-3 px-5 pb-5 text-sm">
            <img src={business.coverImage} alt="" className="h-48 w-full rounded-xl object-cover" />
            <p><span className="text-muted">Owner:</span> <Link to={`/business-owners/${owner?.id}`} className="text-turquoise hover:underline">{owner?.name}</Link></p>
            <p><span className="text-muted">Category:</span> {business.category}</p>
            <p><span className="text-muted">Location:</span> {business.locationLabel}, {business.parish}</p>
            <p>{business.description}</p>
            <div>
              <p className="font-semibold">Services</p>
              <ul className="mt-1 list-disc pl-5">
                {business.services.map((service) => (
                  <li key={service.id}>{service.name} — {service.description}</li>
                ))}
              </ul>
            </div>
            <p><span className="text-muted">Contact:</span> {business.phone || 'Phone not listed'} · {business.email || 'Email not listed'}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Approval checklist"
              description="Administrative aid only — does not verify legal registration or physical existence."
            />
            <ul className="space-y-2 px-5 pb-5">
              {checklist.map((item, index) => (
                <li key={item}>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={Boolean(checked[index])}
                      onChange={(e) => setChecked((prev) => ({ ...prev, [index]: e.target.checked }))}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="AI knowledge preview" />
            <p className="px-5 pb-5 text-sm text-muted">{knowledgePreview?.content ?? 'No knowledge preview.'}</p>
          </Card>

          <Card>
            <CardHeader title="Previous decisions" />
            <div className="px-5 pb-5 text-sm">
              <p>Notes: {review.reviewNotes || '—'}</p>
              <p className="mt-2">Change requests: {review.changeRequests || '—'}</p>
              <p className="mt-2 text-muted">Decision at: {review.decisionAt ? formatDateTime(review.decisionAt) : 'Pending'}</p>
            </div>
          </Card>

          {canModerate ? (
            <Card className="p-5">
              <h2 className="font-display text-xl text-ocean">Review actions</h2>
              <Field label="Reason / explanation" hint="Required for request changes and reject.">
                <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
              </Field>
              <Field label="Internal note">
                <Textarea className="mt-3" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              </Field>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  disabled={!checklistComplete}
                  onClick={async () => {
                    await approveListing(business.id)
                    push({ title: 'Listing approved in demo state', tone: 'success' })
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await requestListingChanges(business.id, reason)
                      push({ title: 'Changes requested', tone: 'success' })
                      setReason('')
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
                      await rejectListing(business.id, reason)
                      push({ title: 'Listing rejected in demo state', tone: 'success' })
                      setReason('')
                    } catch (error) {
                      push({ title: error instanceof Error ? error.message : 'Reason required', tone: 'error' })
                    }
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    push({
                      title: 'Internal note saved locally',
                      description: note || 'No note entered',
                      tone: 'info',
                    })
                  }
                >
                  Save internal note
                </Button>
                <Link
                  to={`/businesses/${business.id}`}
                  className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm hover:bg-sand"
                >
                  Preview public listing
                </Link>
              </div>
              {!checklistComplete ? (
                <p className="mt-3 text-xs text-muted">Complete the checklist before approving in this demo workflow.</p>
              ) : null}
            </Card>
          ) : (
            <Card className="p-5 text-sm text-muted">Your demo role cannot moderate listings.</Card>
          )}
        </div>
      </div>
    </div>
  )
}
