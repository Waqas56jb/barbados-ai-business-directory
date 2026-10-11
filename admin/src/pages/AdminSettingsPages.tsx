import { useState } from 'react'
import {
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  PageHeader,
  Select,
  StatusBadge,
  Textarea,
} from '@/components/ui/primitives'
import { adminRoles, roleLabels, type AdminRole } from '@/config/site'
import { getPermissionsForRole, hasPermission } from '@/lib/permissions'
import { usePermission } from '@/hooks/usePermission'
import { formatDate, statusLabel } from '@/lib/formatters'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'
import type { Administrator, PlatformSettings } from '@/types'

export function AdministratorsPage() {
  const canManage = usePermission('admins.manage')
  const administrators = useAdminStore((s) => s.administrators)
  const upsertAdministrator = useAdminStore((s) => s.upsertAdministrator)
  const push = useToastStore((s) => s.push)
  const [editing, setEditing] = useState<Administrator | null>(null)

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Only the Super Admin demo role can manage administrators.</Card>
  }

  return (
    <div>
      <PageHeader
        title="Administrator Accounts"
        description="Simulated administrator accounts for the demo panel. No invitation emails or auth provisioning."
        breadcrumbs={[{ label: 'Configuration' }, { label: 'Administrators' }]}
        actions={
          <Button
            onClick={() =>
              setEditing({
                id: `adm-${crypto.randomUUID().slice(0, 6)}`,
                name: '',
                email: '',
                role: 'support_agent',
                status: 'invited',
                createdAt: new Date().toISOString(),
                lastActivityAt: new Date().toISOString(),
              })
            }
          >
            Create administrator
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Last activity</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {administrators.map((admin) => (
              <tr key={admin.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{admin.name}</td>
                <td className="px-4 py-3">{admin.email}</td>
                <td className="px-4 py-3">{roleLabels[admin.role]}</td>
                <td className="px-4 py-3"><StatusBadge status={admin.status} /></td>
                <td className="px-4 py-3">{formatDate(admin.createdAt)}</td>
                <td className="px-4 py-3">{formatDate(admin.lastActivityAt)}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(admin)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <Card className="mt-6 p-5 space-y-3">
          <h2 className="font-display text-2xl text-ocean">{administrators.some((a) => a.id === editing.id) ? 'Edit' : 'Create'} administrator</h2>
          <Field label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
          <Field label="Email"><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
          <Field label="Role">
            <Select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as AdminRole })}>
              {adminRoles.map((role) => (
                <option key={role} value={role}>{roleLabels[role]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as Administrator['status'] })}
            >
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="restricted">Restricted</option>
              <option value="suspended">Suspended</option>
            </Select>
          </Field>
          <p className="text-xs text-muted">
            Permission summary: {getPermissionsForRole(editing.role).join(', ')}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (!editing.name.trim() || !editing.email.trim()) {
                  push({ title: 'Name and email are required', tone: 'error' })
                  return
                }
                upsertAdministrator(editing)
                push({ title: 'Administrator saved in demo state', tone: 'success' })
                setEditing(null)
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}

export function RolesPage() {
  const canViewRoles = usePermission('roles.view')
  const canManageAdmins = usePermission('admins.manage')

  if (!canViewRoles && !canManageAdmins) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot view the permission matrix.</Card>
  }

  const allPermissions = getPermissionsForRole('super_admin')

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Frontend permission matrix for demonstration only. Real authorization will be enforced by the backend."
        breadcrumbs={[{ label: 'Configuration' }, { label: 'Roles' }]}
      />

      <Card className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sand/60 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Permission</th>
              {adminRoles.map((role) => (
                <th key={role} className="px-4 py-3">{roleLabels[role]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPermissions.map((permission) => (
              <tr key={permission} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{permission}</td>
                {adminRoles.map((role) => (
                  <td key={`${role}-${permission}`} className="px-4 py-3">
                    {hasPermission(role, permission) ? 'Yes' : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export function SettingsPage() {
  const canManage = usePermission('settings.manage')
  const platformSettings = useAdminStore((s) => s.platformSettings)
  const chatbotSettings = useAdminStore((s) => s.chatbotSettings)
  const updatePlatformSettings = useAdminStore((s) => s.updatePlatformSettings)
  const updateChatbotSettings = useAdminStore((s) => s.updateChatbotSettings)
  const resetDemoData = useAdminStore((s) => s.resetDemoData)
  const push = useToastStore((s) => s.push)
  const [draft, setDraft] = useState<PlatformSettings>(platformSettings)

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot manage settings.</Card>
  }

  return (
    <div>
      <PageHeader
        title="General Settings"
        description="Platform configuration stored in local demo state."
        breadcrumbs={[{ label: 'Configuration' }, { label: 'Settings' }]}
      />

      <div className="space-y-6">
        <Card className="p-5 space-y-3" id="general">
          <CardHeader title="General" />
          <Field label="Platform display name">
            <Input value={draft.displayName} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} />
          </Field>
          <Field label="Logo preview">
            <div className="flex h-16 items-center rounded-xl bg-ocean px-4 font-display text-white">{draft.displayName}</div>
          </Field>
          <Field label="Public site URL">
            <Input value={draft.publicSiteUrl} onChange={(e) => setDraft({ ...draft, publicSiteUrl: e.target.value })} />
          </Field>
          <Field label="Support contact placeholder">
            <Input value={draft.supportContact} onChange={(e) => setDraft({ ...draft, supportContact: e.target.value })} />
          </Field>
          <Field label="Default timezone">
            <Input value={draft.timezone} onChange={(e) => setDraft({ ...draft, timezone: e.target.value })} />
          </Field>
          <Field label="Default language">
            <Input value={draft.defaultLanguage} onChange={(e) => setDraft({ ...draft, defaultLanguage: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.maintenanceMode}
              onChange={(e) => setDraft({ ...draft, maintenanceMode: e.target.checked })}
            />
            Maintenance-mode demo toggle
          </label>
        </Card>

        <Card className="p-5 space-y-3" id="moderation">
          <CardHeader title="Marketplace" description="Default listing and moderation preferences." />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.moderationRequired}
              onChange={(e) => setDraft({ ...draft, moderationRequired: e.target.checked })}
            />
            Moderation required before publish
          </label>
          <Field label="Default listing visibility">
            <Select
              value={draft.defaultListingVisibility}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  defaultListingVisibility: e.target.value as PlatformSettings['defaultListingVisibility'],
                })
              }
            >
              <option value="pending_review">Pending review</option>
              <option value="draft">Draft</option>
            </Select>
          </Field>
        </Card>

        <Card className="p-5 space-y-3">
          <CardHeader title="Chatbot" description="Synced with AI settings for convenience." />
          <Field label="Assistant display name">
            <Input
              value={chatbotSettings.displayName}
              onChange={(e) => updateChatbotSettings({ displayName: e.target.value })}
            />
          </Field>
          <Field label="Welcome message">
            <Textarea
              rows={3}
              value={chatbotSettings.welcomeMessage}
              onChange={(e) => updateChatbotSettings({ welcomeMessage: e.target.value })}
            />
          </Field>
          <Field label="Fallback message">
            <Textarea
              rows={3}
              value={chatbotSettings.fallbackMessage}
              onChange={(e) => updateChatbotSettings({ fallbackMessage: e.target.value })}
            />
          </Field>
        </Card>

        <Card className="p-5 space-y-3">
          <CardHeader title="Advertising" />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.campaignReviewRequired}
              onChange={(e) => setDraft({ ...draft, campaignReviewRequired: e.target.checked })}
            />
            Default campaign review requirement
          </label>
          <Field label="Sponsored label preference">
            <Input value={draft.sponsoredLabel} onChange={(e) => setDraft({ ...draft, sponsoredLabel: e.target.value })} />
          </Field>
        </Card>

        <Card className="p-5 space-y-3">
          <CardHeader title="Privacy and data" />
          <p className="text-sm text-muted">
            This admin panel uses fictional Barbados tourism data stored in local browser state for demonstration.
            Data export downloads CSV snapshots of the current demo filters. Retention and compliance enforcement
            require backend implementation.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              resetDemoData()
              setDraft(useAdminStore.getState().platformSettings)
              push({ title: 'Demo data reset to seed state', tone: 'success' })
            }}
          >
            Reset local demo data
          </Button>
        </Card>

        <Button
          onClick={() => {
            updatePlatformSettings(draft)
            push({ title: 'Settings saved (demo)', tone: 'success' })
          }}
        >
          Save settings
        </Button>
      </div>
    </div>
  )
}

export function IntegrationsPage() {
  const canManage = usePermission('settings.manage')
  const integrations = useAdminStore((s) => s.integrations)

  if (!canManage) {
    return <Card className="p-6 text-sm text-muted">Your demo role cannot view integration settings.</Card>
  }

  return (
    <div>
      <PageHeader
        title="API Integration Settings"
        description="Status screen for future backend services. Secrets must never be stored in browser code."
        breadcrumbs={[{ label: 'Settings', href: '/settings' }, { label: 'Integrations' }]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-ocean">{integration.name}</h2>
                <p className="mt-1 text-sm text-muted">{integration.purpose}</p>
              </div>
              <StatusBadge
                status={
                  integration.status === 'demo_ready'
                    ? 'active'
                    : integration.status === 'future'
                      ? 'pending'
                      : 'archived'
                }
              />
            </div>
            <p className="mt-4 text-sm">Demo connection status: {statusLabel(integration.status)}</p>
            <p className="mt-1 text-xs text-muted">Last simulated check: {formatDate(integration.lastCheckedAt)}</p>
            <p className="mt-3 text-sm">{integration.guidance}</p>
            <p className="mt-3 text-xs text-muted">
              Connection checks and secret configuration belong on the server. This screen does not test real API keys.
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
