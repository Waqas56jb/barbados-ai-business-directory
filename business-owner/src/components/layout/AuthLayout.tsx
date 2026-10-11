import { Outlet } from 'react-router-dom'
import { ToastViewport } from '@/components/ui/ToastViewport'
import { siteConfig } from '@/config/site'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(145deg,#103B46_0%,#145867_45%,#18A7A1_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
        <div className="mb-8 text-white lg:mb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand/80">Tourism operator tools</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{siteConfig.brandName}</h1>
          <p className="mt-4 max-w-lg text-sand/90">{siteConfig.tagline}</p>
          <p className="mt-6 max-w-md text-sm text-sand/70">
            Frontend demo only — authentication is simulated and does not connect to a secure server.
          </p>
        </div>
        <div className="rounded-3xl border border-white/15 bg-ivory p-6 shadow-soft sm:p-8">
          <Outlet />
        </div>
      </div>
      <ToastViewport />
    </div>
  )
}
