import { NavLink } from 'react-router-dom'
import { navGroups } from '@/components/navigation/navItems'
import { siteConfig } from '@/config/site'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="font-display text-xl text-white">{siteConfig.brandName}</p>
        <p className="mt-1 text-xs text-sand/70">Owner dashboard demo</p>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Dashboard">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand/50">
              {group.title}
            </p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                          isActive
                            ? 'bg-turquoise text-white'
                            : 'text-sand/85 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
