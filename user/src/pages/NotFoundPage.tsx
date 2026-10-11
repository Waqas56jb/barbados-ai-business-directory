import { Link } from 'react-router-dom'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function NotFoundPage() {
  useDocumentMeta({
    title: 'Page not found',
    description: 'The requested page could not be found.',
  })

  return (
    <div className="container-shell section-padding flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-turquoise">404</p>
      <h1 className="mt-3 font-display text-5xl text-ocean">Page not found</h1>
      <p className="mt-4 max-w-lg text-muted">
        The page you’re looking for doesn’t exist in this demo. Head home or continue browsing the directory.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full bg-turquoise px-5 py-3 text-sm font-medium text-white">
          Back to homepage
        </Link>
        <Link to="/directory" className="rounded-full border border-ocean/15 px-5 py-3 text-sm font-medium text-ocean">
          Browse directory
        </Link>
      </div>
    </div>
  )
}
