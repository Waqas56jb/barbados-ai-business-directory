import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { previewKnowledgeAnswer } from '@/services/knowledgeService'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import { buildKnowledgeSources } from '@/lib/knowledgePreview'
import type { FAQ } from '@/types'

const sampleQuestions = [
  'Where is this business located?',
  'What services are available?',
  'How much does this experience cost?',
  'What is the business telephone number?',
  'Does this business provide airport pickup?',
]

export function AiKnowledgePage() {
  const businesses = useDemoStore((state) => state.businesses)
  const faqs = useDemoStore((state) => state.faqs)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const setActiveBusiness = useDemoStore((state) => state.setActiveBusiness)
  const upsertFaq = useDemoStore((state) => state.upsertFaq)
  const deleteFaq = useDemoStore((state) => state.deleteFaq)
  const pushToast = useToastStore((state) => state.push)
  const business = businesses.find((item) => item.id === activeBusinessId) ?? businesses[0]
  const businessFaqs = faqs.filter((item) => item.businessId === business?.id)
  const sources = useMemo(
    () => (business ? buildKnowledgeSources(business, businessFaqs) : []),
    [business, businessFaqs],
  )
  const [question, setQuestion] = useState(sampleQuestions[0])
  const [faqDraft, setFaqDraft] = useState<FAQ | null>(null)

  const previewQuery = useQuery({
    queryKey: ['knowledge-preview', business?.id, question, businessFaqs, business],
    queryFn: () => previewKnowledgeAnswer(business!.id, question),
    enabled: Boolean(business),
  })

  if (!business) return <p className="text-muted">No business selected.</p>

  return (
    <div>
      <PageHeader
        title="AI Knowledge Profile"
        description="Preview how listing fields and FAQs can ground chatbot answers. Real RAG indexing will be handled by the future server."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'AI Knowledge' }]}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={business.id} onChange={(e) => setActiveBusiness(e.target.value)}>
          {businesses.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </Select>
        <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ocean">
          Current demo data · preview refreshed instantly
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Knowledge sources"
            description="Supported fields that can contribute to future chatbot answers."
          />
          <ul className="divide-y divide-border">
            {sources.map((source) => (
              <li key={source.type} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-ocean">{source.type}</p>
                  <span className={`text-xs font-semibold ${source.available ? 'text-emerald-700' : 'text-muted'}`}>
                    {source.available ? 'Available' : 'Not available'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{source.summary}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Knowledge preview"
            description={`${business.name} · fictional demo listing in ${business.locationLabel}.`}
          />
          <div className="space-y-3 p-5 text-sm">
            <p><strong>Business:</strong> {business.name}</p>
            <p><strong>Location:</strong> {business.locationLabel}, {business.parish}</p>
            <p>
              <strong>Services:</strong>{' '}
              {business.services.length
                ? business.services.map((service) => service.name).join(', ')
                : 'Not provided in the demo record.'}
            </p>
            <p>
              <strong>Contact:</strong>{' '}
              {business.phone || business.email || business.website || 'Not provided in the demo record.'}
            </p>
            <p className="rounded-xl bg-sand/50 px-3 py-2 text-xs text-muted">
              Future integration note: embeddings, retrieval, and OpenAI calls will run in `server/`. This page only simulates grounded answers from local profile data.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Frequently asked questions"
            action={
              <Button
                size="sm"
                onClick={() =>
                  setFaqDraft({
                    id: `faq-${crypto.randomUUID().slice(0, 8)}`,
                    businessId: business.id,
                    question: '',
                    answer: '',
                    visibility: 'public',
                    updatedAt: new Date().toISOString(),
                  })
                }
              >
                Add FAQ
              </Button>
            }
          />
          <ul className="divide-y divide-border">
            {businessFaqs.map((faq) => (
              <li key={faq.id} className="px-5 py-3">
                <p className="text-sm font-medium text-ocean">{faq.question}</p>
                <p className="mt-1 text-sm text-muted">{faq.answer}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setFaqDraft(faq)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      deleteFaq(faq.id)
                      pushToast({ title: 'FAQ deleted', tone: 'info' })
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Preview AI answers" description="Simulated responses grounded in the current local profile." />
          <div className="space-y-3 p-5">
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-xs ${
                    question === item ? 'bg-turquoise text-white' : 'bg-sand text-ocean'
                  }`}
                  onClick={() => setQuestion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <Field label="Custom question">
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
            </Field>
            <div className="rounded-2xl bg-sand/40 p-4 text-sm">
              <p className="font-medium text-ocean">Assistant preview</p>
              <p className="mt-2 text-ink">{previewQuery.data?.answer ?? 'Loading preview…'}</p>
              {previewQuery.data?.sources?.length ? (
                <p className="mt-2 text-xs text-muted">Sources: {previewQuery.data.sources.join(', ')}</p>
              ) : null}
            </div>
          </div>
        </Card>
      </div>

      {faqDraft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ocean/40 p-4">
          <Card className="w-full max-w-lg p-5">
            <h2 className="font-display text-2xl text-ocean">FAQ editor</h2>
            <div className="mt-4 space-y-3">
              <Field label="Question">
                <Input value={faqDraft.question} onChange={(e) => setFaqDraft({ ...faqDraft, question: e.target.value })} />
              </Field>
              <Field label="Answer">
                <Textarea rows={4} value={faqDraft.answer} onChange={(e) => setFaqDraft({ ...faqDraft, answer: e.target.value })} />
              </Field>
              <Field label="Visibility">
                <Select
                  value={faqDraft.visibility}
                  onChange={(e) =>
                    setFaqDraft({ ...faqDraft, visibility: e.target.value as FAQ['visibility'] })
                  }
                >
                  <option value="public">Public</option>
                  <option value="draft">Draft</option>
                  <option value="hidden">Hidden</option>
                </Select>
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setFaqDraft(null)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!faqDraft.question.trim() || !faqDraft.answer.trim()) {
                    pushToast({ title: 'Question and answer are required', tone: 'error' })
                    return
                  }
                  upsertFaq({ ...faqDraft, updatedAt: new Date().toISOString() })
                  pushToast({ title: 'FAQ saved', description: 'Knowledge preview updated immediately.', tone: 'success' })
                  setFaqDraft(null)
                }}
              >
                Save FAQ
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
