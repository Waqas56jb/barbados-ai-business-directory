export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ocean/10 bg-white" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-sand" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-sand" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-sand" />
        <div className="h-4 w-full animate-pulse rounded bg-sand" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-sand" />
      </div>
    </div>
  )
}

export function DirectorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-live="polite">
      <span className="sr-only">Loading businesses</span>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}

export function PageError({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="rounded-3xl border border-coral/30 bg-white p-8 text-center shadow-card" role="alert">
      <h2 className="font-display text-2xl text-ocean">{title}</h2>
      <p className="mt-3 text-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-turquoise px-5 py-2.5 text-sm font-medium text-white hover:bg-turquoise-dark"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}
