import { Bell } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'

export function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const notifications = useDemoStore((state) => state.notifications)
  const markRead = useDemoStore((state) => state.markNotificationRead)
  const markAll = useDemoStore((state) => state.markAllNotificationsRead)
  const unread = notifications.filter((item) => !item.read).length

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-xl p-2 text-ocean hover:bg-sand"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-border bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-ocean">Notifications</p>
            <Button size="sm" variant="ghost" onClick={() => markAll()}>
              Mark all read
            </Button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted">No notifications yet.</li>
            ) : (
              notifications.slice(0, 8).map((item) => (
                <li key={item.id} className={`border-b border-border last:border-0 ${item.read ? 'bg-white' : 'bg-sand/40'}`}>
                  <Link
                    to={item.href ?? '/dashboard'}
                    className="block px-4 py-3 hover:bg-sand/60"
                    onClick={() => {
                      markRead(item.id)
                      setOpen(false)
                    }}
                  >
                    <p className="text-sm font-medium text-ocean">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">{item.message}</p>
                    <p className="mt-1 text-[11px] text-muted">{formatDateTime(item.createdAt)}</p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
