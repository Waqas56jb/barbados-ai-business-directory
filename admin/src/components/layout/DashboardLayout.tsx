import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopHeader } from '@/components/layout/TopHeader'
import { PermissionDenied, ToastViewport } from '@/components/ui/primitives'
import { canAccessPath } from '@/lib/permissions'
import { useAdminStore } from '@/store/adminStore'

export function DashboardLayout() {
  const authenticated = useAdminStore((state) => state.authenticated)
  const role = useAdminStore((state) => state.activeRole)
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) setCollapsed(true)
      else if (window.innerWidth >= 1280) setCollapsed(false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!authenticated) return <Navigate to="/login" replace />

  const allowed = canAccessPath(role, location.pathname)

  return (
    <div
      className={`min-h-screen bg-ivory lg:grid ${collapsed ? 'lg:grid-cols-[88px_1fr]' : 'lg:grid-cols-[280px_1fr]'}`}
    >
      <aside className="hidden bg-ocean lg:sticky lg:top-0 lg:block lg:h-screen">
        <Sidebar collapsed={collapsed} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-ocean/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(300px,85vw)] bg-ocean shadow-soft">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        <TopHeader onMenuOpen={() => setMobileOpen(true)} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          {allowed ? <Outlet /> : <PermissionDenied />}
        </main>
      </div>
      <ToastViewport />
    </div>
  )
}
