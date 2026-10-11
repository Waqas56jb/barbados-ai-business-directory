import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

export function ReviewsPage() {
  const reviews = useDemoStore((state) => state.reviews)
  const businesses = useDemoStore((state) => state.businesses)
  const faqs = useDemoStore((state) => state.faqs)
  const replyToReview = useDemoStore((state) => state.replyToReview)
  const flagReview = useDemoStore((state) => state.flagReview)
  const upsertFaq = useDemoStore((state) => state.upsertFaq)
  const pushToast = useToastStore((state) => state.push)
  const [businessId, setBusinessId] = useState('all')
  const [rating, setRating] = useState('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('newest')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [questionDrafts, setQuestionDrafts] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    let items = [...reviews]
    if (businessId !== 'all') items = items.filter((item) => item.businessId === businessId)
    if (rating !== 'all') items = items.filter((item) => item.rating === Number(rating))
    if (q.trim()) {
      const query = q.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.body.toLowerCase().includes(query) ||
          item.visitorName.toLowerCase().includes(query),
      )
    }
    items.sort((a, b) =>
      sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
    )
    return items
  }, [reviews, businessId, rating, q, sort])

  const average =
    filtered.length === 0
      ? 0
      : filtered.reduce((total, item) => total + item.rating, 0) / filtered.length

  return (
    <div>
      <PageHeader
        title="Reviews & Questions"
        description="Fictional visitor feedback for demo response workflows. Owners cannot edit visitor reviews."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reviews' }]}
      />

      <Card className="mb-5 p-5">
        <p className="text-sm text-muted">Demo rating summary</p>
        <p className="mt-2 font-display text-4xl text-ocean">{average.toFixed(1)}</p>
        <p className="text-sm text-muted">{filtered.length} fictional reviews in view</p>
      </Card>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <Input placeholder="Search reviews…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
          <option value="all">All businesses</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>{business.name}</option>
          ))}
        </Select>
        <Select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="all">All ratings</option>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} stars</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No reviews match your filters" />
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-ocean">{review.title}</p>
                  <p className="text-xs text-muted">
                    {review.visitorName} · {review.rating}/5 · {formatDate(review.createdAt)} ·{' '}
                    {businesses.find((item) => item.id === review.businessId)?.name}
                  </p>
                </div>
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs text-ocean">{review.status}</span>
              </div>
              <p className="mt-3 text-sm text-ink">{review.body}</p>
              {review.ownerReply ? (
                <div className="mt-3 rounded-xl bg-sand/50 p-3 text-sm">
                  <p className="font-medium text-ocean">Owner reply</p>
                  <p className="mt-1 text-muted">{review.ownerReply}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <Field label="Demo reply composer">
                    <Textarea
                      rows={3}
                      value={replyDrafts[review.id] ?? ''}
                      onChange={(e) =>
                        setReplyDrafts((current) => ({ ...current, [review.id]: e.target.value }))
                      }
                    />
                  </Field>
                  <Button
                    size="sm"
                    onClick={() => {
                      const reply = replyDrafts[review.id]?.trim()
                      if (!reply) {
                        pushToast({ title: 'Write a reply first', tone: 'error' })
                        return
                      }
                      replyToReview(review.id, reply)
                      pushToast({
                        title: 'Demo reply saved',
                        description: 'No public reply was published to a live site.',
                        tone: 'success',
                      })
                    }}
                  >
                    Save demo reply
                  </Button>
                </div>
              )}
              <div className="mt-4 border-t border-border pt-4">
                <Field label="Draft a related FAQ from this question theme">
                  <Input
                    placeholder="Optional FAQ question"
                    value={questionDrafts[review.id] ?? ''}
                    onChange={(e) =>
                      setQuestionDrafts((current) => ({ ...current, [review.id]: e.target.value }))
                    }
                  />
                </Field>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const question = questionDrafts[review.id]?.trim() || review.title
                      upsertFaq({
                        id: `faq-${crypto.randomUUID().slice(0, 8)}`,
                        businessId: review.businessId,
                        question,
                        answer: replyDrafts[review.id]?.trim() || review.ownerReply || 'Draft answer pending.',
                        visibility: 'draft',
                        updatedAt: new Date().toISOString(),
                      })
                      pushToast({
                        title: 'FAQ draft created',
                        description: `Knowledge FAQs now: ${faqs.length + 1} (demo).`,
                        tone: 'success',
                      })
                    }}
                  >
                    Add FAQ draft
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => {
                    flagReview(review.id)
                    pushToast({ title: 'Review flagged in demo state', tone: 'info' })
                  }}>
                    Report / flag
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
