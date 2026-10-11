import { CircleHelp, LogOut, Menu, Search } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NotificationMenu } from '@/components/notifications/NotificationMenu'
import { Select } from '@/components/ui/Input'
import { siteConfig } from '@/config/site'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

const titles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/businesses': 'My Businesses',
  '/listings': 'Listings',
  '/media': 'Photos & Media',
  '/services': 'Services & Amenities',
  '/ai-knowledge': 'AI Knowledge Profile',
  '/advertising': 'Advertising & Promotions',
  '/analytics': 'Performance Analytics',
  '/reviews': 'Reviews & Questions',
  '/inquiries': 'Messages & Inquiries',
  '/settings': 'Account Settings',
  '/help': 'Help & Support',
}

export function TopHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const owner = useDemoStore((state) => state.owner)
  const businesses = useDemoStore((state) => state.businesses)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const setActiveBusiness = useDemoStore((state) => state.setActiveBusiness)
  const logout = useDemoStore((state) => state.logout)
  const pushToast = useToastStore((state) => state.push)

  const title =
    Object.entries(titles).find(([path]) => location.pathname.startsWith(path))?.[1] ??
    siteConfig.brandName

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-ivory/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="rounded-xl p-2 text-ocean hover:bg-sand lg:hidden"
            aria-label="Open navigation"
            onClick={onMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ocean sm:text-base">{title}</p>
            <p className="truncate text-xs text-muted">Demo dashboard · fictional tourism data</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="relative hidden md:block">
            <span className="sr-only">Search dashboard</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              placeholder="Search businesses…"
              className="w-56 rounded-xl border border-border bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-turquoise"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const value = (event.target as HTMLInputElement).value
                  navigate(`/businesses?q=${encodeURIComponent(value)}`)
                }
              }}
            />
          </label>

          <label className="hidden sm:block">
            <span className="sr-only">Select business</span>
            <Select
              value={activeBusinessId}
              onChange={(event) => setActiveBusiness(event.target.value)}
              className="min-w-[180px]"
            >
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </Select>
          </label>

          <Link to="/help" className="rounded-xl p-2 text-ocean hover:bg-sand" aria-label="Help">
            <CircleHelp className="h-5 w-5" />
          </Link>
          <NotificationMenu />

          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-2 py-1.5">
            <img
              src={owner.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-ocean">{owner.name}</p>
              <p className="text-[11px] text-muted">{owner.email}</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted hover:bg-sand hover:text-ocean"
              aria-label="Sign out"
              onClick={() => {
                logout()
                pushToast({ title: 'Signed out of demo session', tone: 'info' })
                navigate('/login')
              }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
