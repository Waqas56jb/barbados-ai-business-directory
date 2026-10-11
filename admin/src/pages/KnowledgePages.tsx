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
import { formatDateTime, statusLabel } from '@/lib/formatters'
import { simulateRefresh } from '@/services/knowledgeService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'

export function KnowledgeListPage() {
  const canManage = usePermission('knowledge.manage')
  const [params, setParams] = useSearchParams()
  const sourceType = params.get('type') ?? ''
  const [search, setSearch] = useState('')
  const knowledge = useAdminStore((s) => s.knowledge)
  const businesses = useAdminStore((s) => s.businesses)

  const filtered = knowledge.filter((record) => {
    if (sourceType && record.sourceType !== sourceType) return false
    if (search) {
      const q = search.toLowerCase()
      if (!record.title.toLowerCase().includes(q) && !record.content.toLowerCase().includes(q)) return false
    }
    return true
  })

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot manage the knowledge base.</Card>
  }

  return (
    <div>
      <PageHeader
        title={sourceType === 'business_faq' ? 'FAQ Management' : 'Knowledge Base'}
        description="Inspect information available to the AI chatbot. Indexing statuses are simulated until a backend exists."
        breadcrumbs={[{ label: 'AI Management' }, { label: 'Knowledge Base' }]}
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Search knowledge records" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select
            value={sourceType}
            onChange={(e) => {
              const next = new URLSearchParams(params)
              if (e.target.value) next.set('type', e.target.value)
              else next.delete('type')
              setParams(next)
            }}
          >
            <option value="">All source types</option>
            <option value="business_listing">Business listings</option>
            <option value="business_service">Business services</option>
            <option value="business_faq">Business FAQs</option>
            <option value="approved_website">Approved website content</option>
            <option value="manual_tourism">Manually added tourism information</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No knowledge records match" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Source title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Indexing</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{record.title}</td>
                  <td className="px-4 py-3">{statusLabel(record.sourceType)}</td>
                  <td className="px-4 py-3">
                    {record.businessId
                      ? businesses.find((b) => b.id === record.businessId)?.name ?? record.businessId
                      : '—'}
                  </td>
                  <td className="px-4 py-3">{formatDateTime(record.updatedAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={record.demoIndexStatus} /></td>
                  <td className="px-4 py-3"><StatusBadge status={record.visibility === 'public' ? 'published' : record.visibility} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/knowledge/${record.id}`} className="text-turquoise hover:underline">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function KnowledgeDetailPage() {
  const { id = '' } = useParams()
  const canManage = usePermission('knowledge.manage')
  const knowledge = useAdminStore((s) => s.knowledge)
  const businesses = useAdminStore((s) => s.businesses)
  const upsertKnowledge = useAdminStore((s) => s.upsertKnowledge)
  const push = useToastStore((s) => s.push)
  const record = knowledge.find((item) => item.id === id)
  const [content, setContent] = useState(record?.content ?? '')
  const [visibility, setVisibility] = useState(record?.visibility ?? 'public')
  const [refreshing, setRefreshing] = useState(false)

  if (!record) return <EmptyState title="Knowledge record not found" />
  if (!canManage) return <Card className="p-6 text-sm text-muted">Your demo role cannot manage knowledge records.</Card>

  const business = businesses.find((item) => item.id === record.businessId)
  const relatedFaqs = knowledge.filter(
    (item) => item.businessId === record.businessId && item.sourceType === 'business_faq' && item.id !== record.id,
  )

  return (
    <div>
      <PageHeader
        title={record.title}
        description="Inspect retrieval content and simulate indexing refresh. This does not generate embeddings or update a vector database."
        breadcrumbs={[{ label: 'Knowledge Base', href: '/knowledge' }, { label: record.title }]}
        actions={<StatusBadge status={record.demoIndexStatus} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-5 space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">Source type</dt><dd>{statusLabel(record.sourceType)}</dd></div>
            <div><dt className="text-muted">Source id</dt><dd>{record.sourceId}</dd></div>
            <div>
              <dt className="text-muted">Business</dt>
              <dd>
                {business ? (
                  <Link to={`/businesses/${business.id}`} className="text-turquoise hover:underline">{business.name}</Link>
                ) : '—'}
              </dd>
            </div>
            <div><dt className="text-muted">Updated</dt><dd>{formatDateTime(record.updatedAt)}</dd></div>
          </dl>
          <Field label="Content available for retrieval">
            <Textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
          </Field>
          <Field label="Visibility">
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value as typeof visibility)}>
              <option value="public">Public</option>
              <option value="hidden">Hidden</option>
              <option value="draft">Draft</option>
            </Select>
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                upsertKnowledge({
                  ...record,
                  content,
                  visibility,
                  updatedAt: new Date().toISOString(),
                  demoIndexStatus: 'out_of_date_demo',
                })
                push({ title: 'Knowledge record updated (demo)', tone: 'success' })
              }}
            >
              Save content
            </Button>
            <Button
              variant="outline"
              disabled={refreshing}
              onClick={async () => {
                setRefreshing(true)
                await simulateRefresh(record.id)
                setRefreshing(false)
                push({ title: 'Simulated knowledge refresh complete', tone: 'success' })
              }}
            >
              {refreshing ? 'Refreshing…' : 'Simulate refresh'}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Retrieval preview" description="Content that would be available for chatbot grounding in this demo." />
            <p className="px-5 pb-5 text-sm">{content}</p>
          </Card>
          <Card>
            <CardHeader title="Related FAQ records" />
            <ul className="divide-y divide-border">
              {relatedFaqs.length === 0 ? <li className="px-5 py-4 text-sm text-muted">No related FAQs</li> : null}
              {relatedFaqs.map((faq) => (
                <li key={faq.id} className="px-5 py-3 text-sm">
                  <Link to={`/knowledge/${faq.id}`} className="text-turquoise hover:underline">{faq.title}</Link>
                </li>
              ))}
            </ul>
          </Card>
          {business ? (
            <Card className="p-5 text-sm">
              <p className="font-semibold text-ocean">Source owner / publication</p>
              <p className="mt-2 text-muted">
                Listing status: {business.status}. Simulated public chatbot only treats published listings as active results.
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
