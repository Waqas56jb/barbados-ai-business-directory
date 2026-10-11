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
import { exportCsv, formatDateTime, statusLabel } from '@/lib/formatters'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'

export function VisitorsPage() {
  const canView = usePermission('visitors.view')
  const analytics = useAdminStore((s) => s.analytics)
  const [search, setSearch] = useState('')

  const aggregate = useMemo(() => {
    const recent = analytics.slice(-30)
    return {
      sessions: recent.reduce((sum, point) => sum + point.searches, 0),
      listingViews: recent.reduce((sum, point) => sum + point.listingViews, 0),
      aiConversations: recent.reduce((sum, point) => sum + point.aiConversations, 0),
    }
  }, [analytics])

  if (!canView) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot view visitor overview.</Card>
  }

  const rows = [
    {
      id: 'anon-pool',
      label: 'Anonymous visitor sessions (aggregate)',
      status: 'active',
      registeredAt: '—',
      summary: `${aggregate.sessions} demo directory searches in the last 30 days`,
    },
    {
      id: 'registered-none',
      label: 'Registered visitor accounts',
      status: 'invited',
      registeredAt: 'Not enabled',
      summary: 'Public directory demo does not invent a visitor registration system.',
    },
  ].filter((row) => !search || row.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader
        title="Visitors & Accounts"
        description="Privacy-conscious overview of aggregate visitor activity from mock analytics. No fingerprinting or sensitive personal data collection."
        breadcrumbs={[{ label: 'Platform Operations' }, { label: 'Visitors' }]}
      />

      <Card className="mb-4 p-4">
        <Input placeholder="Search visitor segments" value={search} onChange={(e) => setSearch(e.target.value)} />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5"><p className="text-xs text-muted uppercase">Demo searches (30d)</p><p className="mt-2 font-display text-3xl text-ocean">{aggregate.sessions}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted uppercase">Demo listing views (30d)</p><p className="mt-2 font-display text-3xl text-ocean">{aggregate.listingViews}</p></Card>
        <Card className="p-5"><p className="text-xs text-muted uppercase">Demo AI conversations (30d)</p><p className="mt-2 font-display text-3xl text-ocean">{aggregate.aiConversations}</p></Card>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <Card key={row.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ocean">{row.label}</p>
                <p className="mt-1 text-sm text-muted">{row.summary}</p>
                <p className="mt-2 text-xs text-muted">Registration: {row.registeredAt}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NotificationsPage() {
  const canManage = usePermission('notifications.manage')
  const notifications = useAdminStore((s) => s.notifications)
  const markNotificationRead = useAdminStore((s) => s.markNotificationRead)
  const markAllNotificationsRead = useAdminStore((s) => s.markAllNotificationsRead)
  const createAnnouncement = useAdminStore((s) => s.createAnnouncement)
  const push = useToastStore((s) => s.push)
  const [type, setType] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot manage notifications.</Card>
  }

  const filtered = notifications.filter((item) => {
    if (type && item.type !== type) return false
    if (readFilter === 'read' && !item.read) return false
    if (readFilter === 'unread' && item.read) return false
    if (search) {
      const q = search.toLowerCase()
      if (!item.title.toLowerCase().includes(q) && !item.message.toLowerCase().includes(q)) return false
    }
    return true
  })
  const selected = notifications.find((item) => item.id === selectedId)

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Demo notification inbox and local platform announcements. Announcements are not delivered to real users."
        breadcrumbs={[{ label: 'Platform Operations' }, { label: 'Notifications' }]}
        actions={
          <Button variant="outline" onClick={() => { markAllNotificationsRead(); push({ title: 'All notifications marked read', tone: 'success' }) }}>
            Mark all as read
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search notifications" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="listing_moderation">Listing moderation</option>
            <option value="owner_account">Owner account</option>
            <option value="advertising">Advertising</option>
            <option value="ai_knowledge">AI knowledge</option>
            <option value="report">Reports</option>
            <option value="announcement">Announcements</option>
          </Select>
          <Select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}>
            <option value="">Read & unread</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </Select>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {filtered.length === 0 ? <EmptyState title="No notifications" /> : null}
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full rounded-2xl border border-border bg-white p-4 text-left hover:border-turquoise"
              onClick={() => {
                setSelectedId(item.id)
                markNotificationRead(item.id)
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ocean">{item.title}</p>
                  <p className="text-sm text-muted">{statusLabel(item.type)} · {formatDateTime(item.createdAt)}</p>
                </div>
                {!item.read ? <StatusBadge status="new" /> : <StatusBadge status="resolved" />}
              </div>
              <p className="mt-2 line-clamp-2 text-sm">{item.message}</p>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-display text-xl text-ocean">Notification detail</h2>
            {!selected ? (
              <p className="mt-2 text-sm text-muted">Select a notification.</p>
            ) : (
              <div className="mt-3 text-sm">
                <p className="font-medium">{selected.title}</p>
                <p className="mt-2">{selected.message}</p>
                {selected.href ? (
                  <Link to={selected.href} className="mt-3 inline-block text-turquoise hover:underline">Open related page</Link>
                ) : null}
              </div>
            )}
          </Card>

          <Card className="p-5 space-y-3">
            <h2 className="font-display text-xl text-ocean">Create demo announcement</h2>
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Message">
              <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>
            <Button
              onClick={() => {
                if (!title.trim() || !message.trim()) {
                  push({ title: 'Title and message are required', tone: 'error' })
                  return
                }
                createAnnouncement(title.trim(), message.trim())
                setTitle('')
                setMessage('')
                push({
                  title: 'Demo announcement created locally',
                  description: 'Not delivered to real users.',
                  tone: 'success',
                })
              }}
            >
              Create announcement
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function AuditLogsPage() {
  const canView = usePermission('audit.view')
  const auditLogs = useAdminStore((s) => s.auditLogs)
  const administrators = useAdminStore((s) => s.administrators)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [actorId, setActorId] = useState('')

  if (!canView) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot view audit logs.</Card>
  }

  const filtered = auditLogs.filter((log) => {
    if (action && log.action !== action) return false
    if (actorId && log.actorId !== actorId) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !log.summary.toLowerCase().includes(q) &&
        !log.entityId.toLowerCase().includes(q) &&
        !log.id.toLowerCase().includes(q)
      ) {
        return false
      }
    }
    return true
  })

  const actions = Array.from(new Set(auditLogs.map((log) => log.action)))

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Transparent activity log for demo administrative operations. Production audit logging must be server-side and not client-editable."
        breadcrumbs={[{ label: 'Platform Operations' }, { label: 'Audit Logs' }]}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv(
                'demo-audit-logs.csv',
                filtered.map((log) => ({
                  id: log.id,
                  createdAt: log.createdAt,
                  actor: log.actorName,
                  role: log.role,
                  action: log.action,
                  entityType: log.entityType,
                  entityId: log.entityId,
                  summary: log.summary,
                  previousState: log.previousState,
                  newState: log.newState,
                })),
              )
            }
          >
            Export CSV
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search audit events" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">All actions</option>
            {actions.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
          <Select value={actorId} onChange={(e) => setActorId(e.target.value)}>
            <option value="">All administrators</option>
            {administrators.map((admin) => (
              <option key={admin.id} value={admin.id}>{admin.name}</option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        <CardHeader title={`${filtered.length} events`} description="Local demo state may update as you take actions." />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Administrator</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Summary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-4 py-3">{log.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                  <td className="px-4 py-3">{log.actorName}<br /><span className="text-xs text-muted">{statusLabel(log.role)}</span></td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{log.entityType}/{log.entityId}</td>
                  <td className="px-4 py-3">
                    {log.summary}
                    {log.previousState || log.newState ? (
                      <p className="mt-1 text-xs text-muted">{log.previousState ?? '—'} → {log.newState ?? '—'}</p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="font-display text-4xl text-ocean">Page not found</h1>
      <p className="mt-3 text-sm text-muted">This admin route does not exist in the demo application.</p>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-turquoise px-4 py-2 text-sm font-medium text-white">
        Back to dashboard
      </Link>
    </div>
  )
}
