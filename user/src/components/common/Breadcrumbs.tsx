import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({
  items,
  tone = 'light',
}: {
  items: BreadcrumbItem[]
  tone?: 'light' | 'dark'
}) {
  const muted = tone === 'dark' ? 'text-sand/80' : 'text-muted'
  const current = tone === 'dark' ? 'text-white' : 'text-ink'

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${muted}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              {item.href && !isLast ? (
                <Link to={item.href} className="hover:text-turquoise">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? current : undefined} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
