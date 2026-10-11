import { Bell, HelpCircle, LogOut, Menu, Search, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import { Button, Select } from '@/components/ui/primitives'
import { adminRoles, roleLabels, siteConfig, type AdminRole } from '@/config/site'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'

export function TopHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const activeRole = useAdminStore((s) => s.activeRole)
  const setActiveRole = useAdminStore((s) => s.setActiveRole)
  const logout = useAdminStore((s) => s.logout)
  const admin = useAdminStore((s) => s.getActiveAdmin())
  const unread = useAdminStore((s) => s.notifications.filter((n) => !n.read).length)
  const pushToast = useToastStore((s) => s.push)

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-border p-2 lg:hidden"
              aria-label="Open navigation"
              onClick={onMenuOpen}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ocean">{siteConfig.brandName}</p>
              <p className="text-xs text-muted">Operational control for the tourism marketplace demo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ocean sm:inline-flex">
              {siteConfig.environmentLabel}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-sand"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search</span>
            </button>
            <Link
              to="/notifications"
              className="relative rounded-xl border border-border p-2 hover:bg-sand"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute -top-1 -right-1 rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </Link>
            <div className="relative">
              <button
                type="button"
                className="rounded-xl border border-border p-2 hover:bg-sand"
                aria-label="Help menu"
                onClick={() =>
                  pushToast({
                    title: 'Demo help',
                    description: 'This admin panel uses local mock data until the server is connected.',
                  })
                }
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-sand"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden max-w-[120px] truncate lg:inline">{admin?.name ?? 'Admin'}</span>
              </button>
              {profileOpen ? (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-white p-3 shadow-soft">
                  <p className="text-sm font-semibold text-ocean">{admin?.name}</p>
                  <p className="text-xs text-muted">{admin?.email}</p>
                  <label className="mt-3 block text-xs font-semibold text-muted">
                    Demo role selector
                    <Select
                      className="mt-1"
                      value={activeRole}
                      onChange={(event) => setActiveRole(event.target.value as AdminRole)}
                    >
                      {adminRoles.map((role) => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <p className="mt-2 text-[11px] text-muted">
                    Development/demo feature only. Does not secure APIs.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full justify-start"
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
