import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
import { formatDate, formatDateTime, statusLabel } from '@/lib/formatters'
import { resolveReport } from '@/services/reportService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'
import type { Report } from '@/types'

export function ReviewsPage() {
  const canModerate = usePermission('reviews.moderate')
  const reviews = useAdminStore((s) => s.reviews)
  const businesses = useAdminStore((s) => s.businesses)
  const updateReview = useAdminStore((s) => s.updateReview)
  const push = useToastStore((s) => s.push)
  const [rating, setRating] = useState('')
  const [status, setStatus] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (rating && String(review.rating) !== rating) return false
      if (status && review.status !== status) return false
      if (businessId && review.businessId !== businessId) return false
      return true
    })
  }, [reviews, rating, status, businessId])

  const selected = reviews.find((review) => review.id === selectedId)

  return (
    <div>
      <PageHeader
        title="Reviews & Questions"
        description="Moderate fictional visitor reviews. Demo reviews are not from real visitors."
        breadcrumbs={[{ label: 'Marketplace' }, { label: 'Reviews & Questions' }]}
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} stars</option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="flagged">Flagged</option>
          </Select>
          <Select value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
            <option value="">All businesses</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.name}</option>
            ))}
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No reviews match" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            {filtered.map((review) => {
              const business = businesses.find((item) => item.id === review.businessId)
              return (
                <button
                  key={review.id}
                  type="button"
                  className="w-full rounded-2xl border border-border bg-white p-4 text-left hover:border-turquoise"
                  onClick={() => {
                    setSelectedId(review.id)
                    setNote(review.moderationNote ?? '')
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ocean">{review.title}</p>
                      <p className="text-sm text-muted">{business?.name} · {review.visitorName} · {review.rating}/5</p>
                    </div>
                    <StatusBadge status={review.status} />
                  </div>
                  <p className="mt-2 text-sm">{review.body}</p>
                </button>
              )
            })}
          </div>

          <Card className="p-5">
            {!selected ? (
              <p className="text-sm text-muted">Select a review to inspect moderation options.</p>
            ) : (
              <>
                <h2 className="font-display text-2xl text-ocean">{selected.title}</h2>
                <p className="mt-1 text-sm text-muted">{formatDate(selected.createdAt)}</p>
                <p className="mt-4 text-sm">{selected.body}</p>
                <p className="mt-3 text-sm text-muted">Owner reply: {selected.ownerReply || 'None'}</p>
                {canModerate ? (
                  <div className="mt-4 space-y-3">
                    <Field label="Internal moderation note">
                      <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateReview(selected.id, { status: 'hidden', moderationNote: note })
                          push({ title: 'Review hidden in demo data', tone: 'success' })
                        }}
                      >
                        Hide review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateReview(selected.id, { status: 'published', moderationNote: note })
                          push({ title: 'Review restored in demo data', tone: 'success' })
                        }}
                      >
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          updateReview(selected.id, { status: 'flagged', moderationNote: note })
                          push({ title: 'Review flagged for further review', tone: 'success' })
                        }}
                      >
                        Flag
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          updateReview(selected.id, { moderationNote: note })
                          push({ title: 'Moderation note saved', tone: 'success' })
                        }}
                      >
                        Save note
                      </Button>
                    </div>
                    <p className="text-xs text-muted">Review text is never silently altered.</p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">Your demo role cannot moderate reviews.</p>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export function ReportsPage() {
  const canManage = usePermission('reports.manage')
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const [search, setSearch] = useState('')
  const reports = useAdminStore((s) => s.reports)
  const businesses = useAdminStore((s) => s.businesses)
  const administrators = useAdminStore((s) => s.administrators)
  const push = useToastStore((s) => s.push)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [nextStatus, setNextStatus] = useState<Report['status']>('resolved')

  const filtered = reports.filter((report) => {
    if (status && report.status !== status) return false
    if (search) {
      const q = search.toLowerCase()
      if (!report.id.toLowerCase().includes(q) && !report.reason.toLowerCase().includes(q)) return false
    }
    return true
  })
  const selected = reports.find((report) => report.id === selectedId)

  return (
    <div>
      <PageHeader
        title="Inquiries & Reports"
        description="Review demo reports about listings and content. All resolutions are local only."
        breadcrumbs={[{ label: 'Platform Operations' }, { label: 'Inquiries & Reports' }]}
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Search reports" value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <option value="new">New</option>
            <option value="under_review">Under review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </Select>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {filtered.map((report) => (
            <button
              key={report.id}
              type="button"
              className="w-full rounded-2xl border border-border bg-white p-4 text-left hover:border-turquoise"
              onClick={() => {
                setSelectedId(report.id)
                setNotes(report.resolutionNotes ?? '')
                setNextStatus(report.status === 'new' ? 'under_review' : report.status)
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ocean">{report.id}</p>
                  <p className="text-sm text-muted">{statusLabel(report.reportType)} · {formatDate(report.createdAt)}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
              <p className="mt-2 text-sm">{report.reason}</p>
            </button>
          ))}
        </div>

        <Card className="p-5">
          {!selected ? (
            <p className="text-sm text-muted">Select a report to open the resolution workflow.</p>
          ) : (
            <>
              <CardHeader title={selected.id} description={statusLabel(selected.reportType)} />
              <div className="space-y-2 text-sm">
                <p>{selected.reason}</p>
                <p className="text-muted">Entity: {selected.entityType} / {selected.entityId}</p>
                {selected.entityType === 'business' ? (
                  <Link to={`/businesses/${selected.entityId}`} className="text-turquoise hover:underline">
                    {businesses.find((b) => b.id === selected.entityId)?.name ?? selected.entityId}
                  </Link>
                ) : null}
                <p className="text-muted">
                  Assigned:{' '}
                  {administrators.find((admin) => admin.id === selected.assignedAdminId)?.name ?? 'Unassigned'}
                </p>
                <p className="text-muted">Submitted {formatDateTime(selected.createdAt)}</p>
              </div>
              {canManage ? (
                <div className="mt-4 space-y-3">
                  <Field label="Resolution status">
                    <Select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as Report['status'])}>
                      <option value="new">New</option>
                      <option value="under_review">Under review</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </Select>
                  </Field>
                  <Field label="Resolution notes">
                    <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </Field>
                  <Button
                    onClick={async () => {
                      await resolveReport(selected.id, nextStatus, notes)
                      push({ title: `Report marked ${nextStatus} (demo)`, tone: 'success' })
                    }}
                  >
                    Save resolution
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">Your demo role cannot resolve reports.</p>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
