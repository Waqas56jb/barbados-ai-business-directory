import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, Input, Select } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { languageOptions } from '@/config/site'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

const settingsNav = [
  { to: '/settings/profile', label: 'Profile' },
  { to: '/settings/security', label: 'Security' },
  { to: '/settings/notifications', label: 'Notifications' },
  { to: '/settings/preferences', label: 'Preferences' },
]

export function SettingsLayout() {
  return (
    <div>
      <PageHeader
        title="Account Settings"
        description="Local demo preferences for the business owner account."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-3">
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-sand text-ocean' : 'text-muted hover:bg-sand/40'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Card>
        <Outlet />
      </div>
    </div>
  )
}

export function SettingsProfilePage() {
  const owner = useDemoStore((state) => state.owner)
  const updateOwner = useDemoStore((state) => state.updateOwner)
  const pushToast = useToastStore((state) => state.push)

  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-2xl text-ocean">Profile</h2>
      <Field label="Full name">
        <Input value={owner.name} onChange={(e) => updateOwner({ name: e.target.value })} />
      </Field>
      <Field label="Profile photo URL">
        <Input value={owner.avatar ?? ''} onChange={(e) => updateOwner({ avatar: e.target.value || undefined })} />
      </Field>
      <Field label="Email">
        <Input type="email" value={owner.email} onChange={(e) => updateOwner({ email: e.target.value })} />
      </Field>
      <Field label="Phone (optional)">
        <Input value={owner.phone ?? ''} onChange={(e) => updateOwner({ phone: e.target.value || undefined })} />
      </Field>
      <Field label="Preferred language">
        <Select
          value={owner.preferredLanguage}
          onChange={(e) => updateOwner({ preferredLanguage: e.target.value })}
        >
          {languageOptions.map((language) => (
            <option key={language}>{language}</option>
          ))}
        </Select>
      </Field>
      <Button onClick={() => pushToast({ title: 'Profile saved locally', tone: 'success' })}>Save profile</Button>
    </Card>
  )
}

export function SettingsSecurityPage() {
  const pushToast = useToastStore((state) => state.push)
  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-2xl text-ocean">Security</h2>
      <p className="text-sm text-muted">
        Password changes and sessions are UI-only in this demo. No secure authentication is implemented.
      </p>
      <Field label="Current password">
        <Input type="password" placeholder="••••••••" />
      </Field>
      <Field label="New password">
        <Input type="password" placeholder="••••••••" />
      </Field>
      <Button
        onClick={() =>
          pushToast({
            title: 'Demo password update simulated',
            description: 'No credentials were stored securely.',
            tone: 'info',
          })
        }
      >
        Update password
      </Button>
      <div className="rounded-xl bg-sand/50 p-4 text-sm">
        <p className="font-medium text-ocean">Demo session</p>
        <p className="mt-1 text-muted">Browser localStorage flag · not a secure server session</p>
      </div>
    </Card>
  )
}

export function SettingsNotificationsPage() {
  const settings = useDemoStore((state) => state.settings)
  const updateSettings = useDemoStore((state) => state.updateSettings)
  const pushToast = useToastStore((state) => state.push)

  const toggles = [
    ['listingStatusNotifications', 'Listing status notifications'],
    ['inquiryNotifications', 'New inquiry notifications'],
    ['advertisingUpdates', 'Advertising updates'],
    ['productAnnouncements', 'Product announcements'],
  ] as const

  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-2xl text-ocean">Notification preferences</h2>
      {toggles.map(([key, label]) => (
        <label key={key} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-3 text-sm">
          <span>{label}</span>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={(e) => {
              updateSettings({ [key]: e.target.checked })
              pushToast({ title: 'Preference updated locally', tone: 'success' })
            }}
          />
        </label>
      ))}
    </Card>
  )
}

export function SettingsPreferencesPage() {
  const settings = useDemoStore((state) => state.settings)
  const updateSettings = useDemoStore((state) => state.updateSettings)
  const resetDemoData = useDemoStore((state) => state.resetDemoData)
  const pushToast = useToastStore((state) => state.push)

  return (
    <Card className="space-y-4 p-5">
      <h2 className="font-display text-2xl text-ocean">Preferences</h2>
      <Field label="Language">
        <Select value={settings.language} onChange={(e) => updateSettings({ language: e.target.value })}>
          {languageOptions.map((language) => (
            <option key={language}>{language}</option>
          ))}
        </Select>
      </Field>
      <Field label="Theme preference">
        <Select
          value={settings.theme}
          onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'system' })}
        >
          <option value="light">Light</option>
          <option value="system">System</option>
        </Select>
      </Field>
      <label className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-3 text-sm">
        <span>Compact tables</span>
        <input
          type="checkbox"
          checked={settings.compactTables}
          onChange={(e) => updateSettings({ compactTables: e.target.checked })}
        />
      </label>
      <p className="text-xs text-muted">These settings are local demo-only and stored in your browser.</p>
      <Button
        variant="danger"
        onClick={() => {
          resetDemoData()
          pushToast({ title: 'Demo data reset to seed values', tone: 'info' })
        }}
      >
        Reset demo data
      </Button>
    </Card>
  )
}
