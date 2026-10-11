import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-turquoise">404</p>
      <h1 className="mt-3 font-display text-4xl text-ocean">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        This route is not part of the business owner demo. Return to the dashboard or sign-in screen.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/dashboard"><Button>Dashboard</Button></Link>
        <Link to="/login"><Button variant="outline">Sign in</Button></Link>
      </div>
    </div>
  )
}
