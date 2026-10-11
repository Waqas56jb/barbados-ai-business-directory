import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopHeader } from '@/components/layout/TopHeader'
import { ToastViewport } from '@/components/ui/ToastViewport'
import { useDemoStore } from '@/store/demoStore'

export function DashboardLayout() {
  const authenticated = useDemoStore((state) => state.authenticated)
  const onboardingComplete = useDemoStore((state) => state.onboardingComplete)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  if (!authenticated) return <Navigate to="/login" replace />
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />

  return (
    <div className="min-h-screen overflow-x-clip bg-ivory lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden bg-ocean lg:sticky lg:top-0 lg:block lg:h-screen">
        <Sidebar />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" className="absolute inset-0 bg-ocean/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(300px,85vw)] overflow-y-auto overscroll-contain bg-ocean shadow-soft">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        <TopHeader onMenuOpen={() => setMobileOpen(true)} />
        <main className="px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
  )
}
