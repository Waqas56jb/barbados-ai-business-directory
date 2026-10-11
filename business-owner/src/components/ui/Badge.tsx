import type { ReactNode } from 'react'
import { statusLabel } from '@/lib/formatters'
import type { BusinessStatus, InquiryStatus, PromotionStatus } from '@/types'

const toneMap: Record<string, string> = {
  draft: 'bg-sand text-ocean',
  pending_review: 'bg-amber-100 text-amber-900',
  published: 'bg-emerald-100 text-emerald-900',
  changes_requested: 'bg-orange-100 text-orange-900',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-slate-200 text-slate-800',
  archived: 'bg-slate-100 text-slate-700',
  approved: 'bg-emerald-100 text-emerald-900',
  scheduled: 'bg-sky-100 text-sky-900',
  active: 'bg-turquoise/15 text-turquoise-dark',
  completed: 'bg-slate-100 text-slate-700',
  paused: 'bg-sand text-ocean',
  unread: 'bg-coral/15 text-coral',
  read: 'bg-sand text-ocean',
  responded: 'bg-emerald-100 text-emerald-900',
  flagged: 'bg-red-100 text-red-800',
}

export function StatusBadge({
  status,
}: {
  status: BusinessStatus | PromotionStatus | InquiryStatus | string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        toneMap[status] ?? 'bg-sand text-ocean'
      }`}
    >
      {statusLabel(status)}
    </span>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'warn'
}) {
  const classes =
    tone === 'accent'
      ? 'bg-turquoise/15 text-turquoise-dark'
      : tone === 'warn'
        ? 'bg-coral/15 text-coral'
        : 'bg-sand text-ocean'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{children}</span>
}
