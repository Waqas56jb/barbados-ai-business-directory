import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-dashed border-ocean/20 bg-white px-6 py-14 text-center">
      <h2 className="font-display text-2xl text-ocean">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-xl text-muted">{description}</p> : null}
      {actions ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
    </div>
  )
}
