import { useMemo, useState } from 'react'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDateTime } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { InquiryStatus } from '@/types'

export function InquiriesPage() {
  const inquiries = useDemoStore((state) => state.inquiries)
  const businesses = useDemoStore((state) => state.businesses)
  const updateInquiry = useDemoStore((state) => state.updateInquiry)
  const setInquiryStatus = useDemoStore((state) => state.setInquiryStatus)
  const pushToast = useToastStore((state) => state.push)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<InquiryStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState(inquiries[0]?.id ?? '')
  const [reply, setReply] = useState('')

  const filtered = useMemo(() => {
    return inquiries.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (!q.trim()) return true
      const query = q.toLowerCase()
      return (
        item.subject.toLowerCase().includes(query) ||
        item.visitorName.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query)
      )
    })
  }, [inquiries, q, status])

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0]

  return (
    <div>
      <PageHeader
        title="Messages & Inquiries"
        description="Demo inbox for visitor questions. Replies are not emailed."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Inquiries' }]}
      />

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <Input placeholder="Search inquiries…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={status} onChange={(e) => setStatus(e.target.value as InquiryStatus | 'all')}>
          <option value="all">All statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="responded">Responded</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No inquiries found" description="Your demo inbox is empty for this filter." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="overflow-hidden">
            <ul className="divide-y divide-border">
              {filtered.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left hover:bg-sand/40 ${
                      selected?.id === item.id ? 'bg-sand/50' : ''
                    }`}
                    onClick={() => {
                      setSelectedId(item.id)
                      if (item.status === 'unread') setInquiryStatus(item.id, 'read')
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-ocean">{item.subject}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{item.visitorName}</p>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {selected ? (
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-ocean">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {selected.visitorName} · {selected.visitorEmail} · {formatDateTime(selected.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {businesses.find((item) => item.id === selected.businessId)?.name}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <p className="mt-4 rounded-xl bg-sand/40 p-4 text-sm text-ink">{selected.message}</p>

              <div className="mt-4 space-y-3">
                <Field label="Internal notes">
                  <Textarea
                    rows={3}
                    value={selected.internalNotes ?? ''}
                    onChange={(e) => updateInquiry(selected.id, { internalNotes: e.target.value })}
                  />
                </Field>
                <Field label="Reply composer (demo only)">
                  <Textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      if (!reply.trim()) {
                        pushToast({ title: 'Write a reply first', tone: 'error' })
                        return
                      }
                      setInquiryStatus(selected.id, 'responded')
                      setReply('')
                      pushToast({
                        title: 'Marked as responded',
                        description: 'No email was delivered in this demo.',
                        tone: 'success',
                      })
                    }}
                  >
                    Save reply & mark responded
                  </Button>
                  <Button variant="outline" onClick={() => setInquiryStatus(selected.id, 'read')}>
                    Mark as read
                  </Button>
                  <Button variant="ghost" onClick={() => setInquiryStatus(selected.id, 'archived')}>
                    Archive
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}
