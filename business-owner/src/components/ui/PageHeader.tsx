import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                  {index > 0 ? <span>/</span> : null}
                  {item.href ? (
                    <Link to={item.href} className="hover:text-turquoise">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-ink">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <h1 className="font-display text-3xl text-ocean sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}
