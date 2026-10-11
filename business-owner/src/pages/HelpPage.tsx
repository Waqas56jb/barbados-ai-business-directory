import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { helpArticles } from '@/data/helpArticles'
import { useToastStore } from '@/store/toastStore'

export function HelpPage() {
  const [q, setQ] = useState('')
  const [selectedId, setSelectedId] = useState(helpArticles[0]?.id ?? '')
  const [supportMessage, setSupportMessage] = useState('')
  const pushToast = useToastStore((state) => state.push)

  const filtered = useMemo(() => {
    if (!q.trim()) return helpArticles
    const query = q.toLowerCase()
    return helpArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.includes(query)) ||
        article.category.toLowerCase().includes(query),
    )
  }, [q])

  const selected = filtered.find((article) => article.id === selectedId) ?? filtered[0]

  return (
    <div>
      <PageHeader
        title="Help & Support"
        description="Searchable demo guidance for listing management, media, AI knowledge, and advertising."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Help' }]}
      />

      <Input
        className="mb-5 max-w-xl"
        placeholder="Search help articles…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {filtered.map((article) => (
              <li key={article.id}>
                <button
                  type="button"
                  className={`w-full px-4 py-3 text-left hover:bg-sand/40 ${
                    selected?.id === article.id ? 'bg-sand/50' : ''
                  }`}
                  onClick={() => setSelectedId(article.id)}
                >
                  <p className="text-sm font-medium text-ocean">{article.title}</p>
                  <p className="mt-1 text-xs text-muted">{article.category}</p>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          {selected ? (
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-turquoise">{selected.category}</p>
              <h2 className="mt-2 font-display text-3xl text-ocean">{selected.title}</h2>
              <p className="mt-3 text-sm text-muted">{selected.summary}</p>
              <p className="mt-4 leading-relaxed text-ink/85">{selected.body}</p>
            </Card>
          ) : (
            <Card className="p-5 text-sm text-muted">No articles match your search.</Card>
          )}

          <Card className="space-y-3 p-5">
            <h2 className="font-display text-2xl text-ocean">Contact support</h2>
            <p className="text-sm text-muted">
              Support requests remain local demo interactions and do not contact a real support team.
            </p>
            <Field label="How can we help?">
              <Textarea rows={4} value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} />
            </Field>
            <Button
              onClick={() => {
                if (!supportMessage.trim()) {
                  pushToast({ title: 'Enter a support message', tone: 'error' })
                  return
                }
                setSupportMessage('')
                pushToast({
                  title: 'Support request simulated',
                  description: 'Nothing was sent to a real inbox.',
                  tone: 'success',
                })
              }}
            >
              Submit demo request
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
