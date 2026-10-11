import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
import { formatDateTime } from '@/lib/formatters'
import { flagConversation } from '@/services/chatService'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'

export function AiOverviewPage() {
  const settings = useAdminStore((s) => s.chatbotSettings)
  const conversations = useAdminStore((s) => s.conversations)
  const knowledge = useAdminStore((s) => s.knowledge)
  const evalCases = useAdminStore((s) => s.evalCases)
  const answered = conversations.filter((c) => !c.hasFallback).length
  const fallbacks = conversations.filter((c) => c.hasFallback).length
  const flagged = evalCases.filter((c) => c.status !== 'pass_demo').length

  return (
    <div>
      <PageHeader
        title="AI Chatbot"
        description="Central administration for the tourism assistant demo. Metrics are fictional until the backend is connected."
        breadcrumbs={[{ label: 'AI Management' }, { label: 'AI Chatbot' }]}
        actions={
          <Link to="/ai/settings" className="rounded-xl bg-turquoise px-4 py-2 text-sm font-medium text-white">
            Configure chatbot
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Chatbot visibility', value: settings.visibleOnPublicSite ? 'Enabled (demo)' : 'Hidden (demo)' },
          { label: 'Demo conversations', value: String(conversations.length) },
          { label: 'Questions answered', value: String(answered) },
          { label: 'Fallback responses', value: String(fallbacks) },
          { label: 'Knowledge records', value: String(knowledge.length) },
          { label: 'Flagged eval examples', value: String(flagged) },
        ].map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</p>
            <p className="mt-3 font-display text-2xl text-ocean">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <p className="text-sm text-muted">
          Last simulated knowledge refresh appears in audit logs when you run refresh actions from the Knowledge Base.
          Actual OpenAI calls, embeddings, and retrieval run only on the future server.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/ai/conversations" className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-sand">Conversations</Link>
          <Link to="/ai/evaluation" className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-sand">Evaluation</Link>
          <Link to="/knowledge" className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-sand">Knowledge base</Link>
        </div>
      </Card>
    </div>
  )
}

export function AiSettingsPage() {
  const canManage = usePermission('ai.manage')
  const settings = useAdminStore((s) => s.chatbotSettings)
  const updateChatbotSettings = useAdminStore((s) => s.updateChatbotSettings)
  const previewAnswer = useAdminStore((s) => s.previewAnswer)
  const push = useToastStore((s) => s.push)
  const [draft, setDraft] = useState(settings)
  const [previewQuestion, setPreviewQuestion] = useState(settings.suggestedQuestions[0] ?? '')
  const preview = useMemo(() => previewAnswer(previewQuestion), [previewAnswer, previewQuestion])

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot manage chatbot settings.</Card>
  }

  return (
    <div>
      <PageHeader
        title="Chatbot configuration"
        description="Editable demo settings with live preview. No OpenAI API key fields are exposed in the frontend."
        breadcrumbs={[{ label: 'AI Chatbot', href: '/ai' }, { label: 'Settings' }]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="p-5 space-y-4">
          <Field label="Assistant display name">
            <Input value={draft.displayName} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} />
          </Field>
          <Field label="Welcome message">
            <Textarea rows={3} value={draft.welcomeMessage} onChange={(e) => setDraft({ ...draft, welcomeMessage: e.target.value })} />
          </Field>
          <Field label="Fallback message">
            <Textarea rows={3} value={draft.fallbackMessage} onChange={(e) => setDraft({ ...draft, fallbackMessage: e.target.value })} />
          </Field>
          <Field label="Escalation guidance">
            <Textarea rows={2} value={draft.escalationGuidance} onChange={(e) => setDraft({ ...draft, escalationGuidance: e.target.value })} />
          </Field>
          <Field label="Response style">
            <Select
              value={draft.responseStyle}
              onChange={(e) => setDraft({ ...draft, responseStyle: e.target.value as typeof draft.responseStyle })}
            >
              <option value="concise">Concise</option>
              <option value="balanced">Balanced</option>
              <option value="detailed">Detailed</option>
            </Select>
          </Field>
          <Field label="Maximum displayed results">
            <Input
              type="number"
              min={1}
              max={10}
              value={draft.maxResults}
              onChange={(e) => setDraft({ ...draft, maxResults: Number(e.target.value) })}
            />
          </Field>
          <Field label="Suggested questions" hint="One question per line">
            <Textarea
              rows={5}
              value={draft.suggestedQuestions.join('\n')}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  suggestedQuestions: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                })
              }
            />
          </Field>

          <div className="rounded-2xl bg-sand/60 p-4">
            <h3 className="font-semibold text-ocean">Safety and grounding (demo toggles)</h3>
            <p className="mt-1 text-xs text-muted">
              Actual enforcement requires server-side implementation and testing.
            </p>
            <div className="mt-3 space-y-2 text-sm">
              {[
                ['useRetrievedBusinessInfo', 'Answer using retrieved business information'],
                ['showListingReferences', 'Show listing references in answers'],
                ['preferSourceBackedAnswers', 'Prefer explicit source-backed answers'],
                ['avoidGuessingContact', 'Avoid guessing missing contact information'],
                ['distinguishNotListed', 'Distinguish “not listed” from “not offered”'],
                ['clarifyAmbiguous', 'Allow clarifying ambiguous questions'],
                ['visibleOnPublicSite', 'Public chatbot visibility'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(draft[key as keyof typeof draft])}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={() => {
              if (!draft.displayName.trim() || !draft.welcomeMessage.trim()) {
                push({ title: 'Display name and welcome message are required', tone: 'error' })
                return
              }
              updateChatbotSettings(draft)
              push({ title: 'Chatbot settings saved (demo)', tone: 'success' })
            }}
          >
            Save settings
          </Button>
        </Card>

        <Card className="p-5">
          <CardHeader title="Live preview" description="Uses local grounded retrieval over published demo listings." />
          <div className="rounded-2xl border border-border bg-ivory p-4">
            <p className="text-xs font-semibold text-muted">{draft.displayName}</p>
            <p className="mt-2 text-sm">{draft.welcomeMessage}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="rounded-full bg-sand px-3 py-1 text-xs"
                  onClick={() => setPreviewQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
            <Field label="Preview question">
              <Input className="mt-3" value={previewQuestion} onChange={(e) => setPreviewQuestion(e.target.value)} />
            </Field>
            <div className="mt-4 rounded-xl bg-white p-3 text-sm">
              <p>{preview.answer}</p>
              <p className="mt-2 text-xs text-muted">
                References: {preview.referencedBusinessIds.join(', ') || 'none'} · Fallback: {preview.hasFallback ? 'yes' : 'no'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AiConversationsPage() {
  const conversations = useAdminStore((s) => s.conversations)
  const businesses = useAdminStore((s) => s.businesses)
  const updateConversation = useAdminStore((s) => s.updateConversation)
  const push = useToastStore((s) => s.push)
  const [fallbackOnly, setFallbackOnly] = useState(false)
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const filtered = conversations.filter((item) => {
    if (fallbackOnly && !item.hasFallback) return false
    if (flaggedOnly && item.reviewStatus !== 'flagged') return false
    return true
  })
  const selected = conversations.find((item) => item.id === selectedId)

  return (
    <div>
      <PageHeader
        title="Chatbot Conversations"
        description="Monitor fictional conversation transcripts. This dashboard does not observe real visitors."
        breadcrumbs={[{ label: 'AI Management' }, { label: 'Conversations' }]}
      />

      <Card className="mb-4 flex flex-wrap gap-4 p-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={fallbackOnly} onChange={(e) => setFallbackOnly(e.target.checked)} />
          Fallback responses
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={flaggedOnly} onChange={(e) => setFlaggedOnly(e.target.checked)} />
          Flagged conversations
        </label>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No conversations match" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            {filtered.map((conversation) => {
              const question = conversation.messages.find((m) => m.role === 'user')?.content
              return (
                <button
                  key={conversation.id}
                  type="button"
                  className="w-full rounded-2xl border border-border bg-white p-4 text-left hover:border-turquoise"
                  onClick={() => {
                    setSelectedId(conversation.id)
                    setNote(conversation.internalNote ?? '')
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ocean">{conversation.id}</p>
                      <p className="text-sm text-muted">{formatDateTime(conversation.createdAt)}</p>
                    </div>
                    <StatusBadge status={conversation.reviewStatus === 'flagged' ? 'flagged' : conversation.hasFallback ? 'pending' : 'resolved'} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm">{question}</p>
                </button>
              )
            })}
          </div>

          <Card className="p-5">
            {!selected ? (
              <p className="text-sm text-muted">Select a conversation to inspect the transcript.</p>
            ) : (
              <>
                <h2 className="font-display text-2xl text-ocean">{selected.id}</h2>
                <div className="mt-4 space-y-3">
                  {selected.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-xl px-3 py-2 text-sm ${message.role === 'assistant' ? 'bg-sand/70' : 'bg-white border border-border'}`}
                    >
                      <p className="text-xs font-semibold text-muted uppercase">{message.role}</p>
                      <p className="mt-1">{message.content}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted">
                  References:{' '}
                  {selected.referencedBusinessIds.map((id) => (
                    <Link key={id} to={`/businesses/${id}`} className="mr-2 text-turquoise hover:underline">
                      {businesses.find((b) => b.id === id)?.name ?? id}
                    </Link>
                  ))}
                  {selected.referencedBusinessIds.length === 0 ? 'none' : null}
                </p>
                <Field label="Internal note">
                  <Textarea className="mt-3" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                </Field>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await flagConversation(selected.id)
                      push({ title: 'Conversation flagged (demo)', tone: 'success' })
                    }}
                  >
                    Flag answer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      updateConversation(selected.id, { internalNote: note, reviewStatus: 'reviewed' })
                      push({ title: 'Marked reviewed with note', tone: 'success' })
                    }}
                  >
                    Mark reviewed
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export function AiEvaluationPage() {
  const canManage = usePermission('ai.manage')
  const evalCases = useAdminStore((s) => s.evalCases)
  const runEvalCases = useAdminStore((s) => s.runEvalCases)
  const push = useToastStore((s) => s.push)

  return (
    <div>
      <PageHeader
        title="AI Quality & Evaluation"
        description="Local demo test cases for grounded retrieval behavior. Results are not production AI metrics."
        breadcrumbs={[{ label: 'AI Management' }, { label: 'Evaluation' }]}
        actions={
          canManage ? (
            <Button
              onClick={() => {
                runEvalCases()
                push({ title: 'Demo evaluation suite completed', tone: 'success' })
              }}
            >
              Run demo tests
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-3">
        {evalCases.map((testCase) => (
          <Card key={testCase.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ocean">{testCase.question}</p>
                <p className="mt-1 text-sm text-muted">Expected source: {testCase.expectedSource}</p>
              </div>
              <StatusBadge status={testCase.status} />
            </div>
            <p className="mt-3 text-sm"><span className="text-muted">Expected behavior:</span> {testCase.expectedBehavior}</p>
            <p className="mt-2 text-sm"><span className="text-muted">Actual simulated answer:</span> {testCase.actualAnswer || 'Not run yet'}</p>
            <p className="mt-2 text-sm text-muted">{testCase.reviewerNotes || 'No reviewer notes'}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
