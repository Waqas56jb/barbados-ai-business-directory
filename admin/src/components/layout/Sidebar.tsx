import { ChevronDown, Compass } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navigationGroups } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { hasPermission } from '@/lib/permissions'
import { useAdminStore } from '@/store/adminStore'

export function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const role = useAdminStore((state) => state.activeRole)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navigationGroups.map((group) => [group.id, true])),
  )

  const groups = useMemo(
    () =>
      navigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => !item.permission || hasPermission(role, item.permission),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [role],
  )

  return (
    <div className="flex h-full flex-col text-white">
      <div className={`border-b border-white/10 ${collapsed ? 'px-3 py-4' : 'px-5 py-5'}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-turquoise">
            <Compass className="h-5 w-5" />
          </div>
          {!collapsed ? (
            <div>
              <p className="font-display text-lg leading-tight">{siteConfig.shortName}</p>
              <p className="text-xs text-white/70">Admin</p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Admin">
        {groups.map((group) => {
          const open = openGroups[group.id] ?? true
          return (
            <div key={group.id} className="mb-3">
              {!collapsed ? (
                <button
                  type="button"
                  className="mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold tracking-wide text-white/60 uppercase hover:bg-white/5"
                  onClick={() => setOpenGroups((prev) => ({ ...prev, [group.id]: !open }))}
                  aria-expanded={open}
                >
                  {group.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition ${open ? '' : '-rotate-90'}`} />
                </button>
              ) : null}
              {(collapsed || open) &&
                group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={`${group.id}-${item.href}-${item.label}`}
                      to={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                          isActive ? 'bg-turquoise text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                        } ${collapsed ? 'justify-center' : ''}`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? <span>{item.label}</span> : null}
                    </NavLink>
                  )
                })}
            </div>
          )
        })}
      </nav>

      {!collapsed ? (
        <div className="border-t border-white/10 p-4 text-xs text-white/65">
          Demo environment — mock data only. Frontend permissions are not production security.
        </div>
      ) : null}
    </div>
  )
}
