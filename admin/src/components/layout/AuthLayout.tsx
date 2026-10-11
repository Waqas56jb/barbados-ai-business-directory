import { Compass } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ToastViewport } from '@/components/ui/primitives'
import { siteConfig } from '@/config/site'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#18a7a133,transparent_40%),radial-gradient(circle_at_bottom_right,#f0786133,transparent_35%),#fffcf7]">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean text-white">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl text-ocean">{siteConfig.brandName}</h1>
          <p className="mt-2 text-sm text-muted">{siteConfig.tagline}</p>
          <p className="mt-3 inline-flex rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ocean">
            {siteConfig.environmentLabel}
          </p>
        </div>
        <Outlet />
      </div>
      <ToastViewport />
    </div>
  )
}
