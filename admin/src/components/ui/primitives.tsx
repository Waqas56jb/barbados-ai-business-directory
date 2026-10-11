import { X } from 'lucide-react'
import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { statusLabel } from '@/lib/formatters'
import { useToastStore } from '@/store/toastStore'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-turquoise text-white hover:bg-turquoise-dark',
  secondary: 'bg-ocean text-white hover:bg-ocean/90',
  ghost: 'bg-transparent text-ocean hover:bg-sand',
  danger: 'bg-coral text-white hover:bg-coral/90',
  outline: 'border border-border bg-white text-ocean hover:bg-sand/60',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}

const control =
  'w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-turquoise'

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ocean">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
      {error ? <span className="mt-1.5 block text-xs text-error" role="alert">{error}</span> : null}
    </label>
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${control} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${control} ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${control} ${className}`} {...props}>
      {children}
    </select>
  )
}

export function Card({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <div id={id} className={`rounded-2xl border border-border bg-white shadow-card ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5">
      <div className="min-w-0">
        <h2 className="font-display text-xl text-ocean">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  )
}

const toneMap: Record<string, string> = {
  published: 'bg-emerald-100 text-success',
  active: 'bg-turquoise/15 text-turquoise-dark',
  pending_review: 'bg-amber-100 text-warning',
  in_review: 'bg-sky-100 text-sky-900',
  changes_requested: 'bg-orange-100 text-orange-900',
  rejected: 'bg-red-100 text-error',
  suspended: 'bg-slate-200 text-slate-800',
  draft: 'bg-sand text-ocean',
  archived: 'bg-slate-100 text-slate-700',
  new: 'bg-coral/15 text-coral',
  under_review: 'bg-amber-100 text-warning',
  resolved: 'bg-emerald-100 text-success',
  dismissed: 'bg-slate-100 text-slate-700',
  flagged: 'bg-red-100 text-error',
  hidden: 'bg-slate-100 text-slate-700',
  indexed_demo: 'bg-emerald-100 text-success',
  pending: 'bg-amber-100 text-warning',
  failed_demo: 'bg-red-100 text-error',
  out_of_date_demo: 'bg-orange-100 text-orange-900',
  pass_demo: 'bg-emerald-100 text-success',
  needs_review: 'bg-amber-100 text-warning',
  fail_demo: 'bg-red-100 text-error',
  approved: 'bg-emerald-100 text-success',
  scheduled: 'bg-sky-100 text-sky-900',
  paused: 'bg-sand text-ocean',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-slate-100 text-slate-700',
  restricted: 'bg-orange-100 text-orange-900',
  invited: 'bg-sky-100 text-sky-900',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${toneMap[status] ?? 'bg-sand text-ocean'}`}>
      {statusLabel(status)}
    </span>
  )
}

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
      <div className="min-w-0">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                  {index > 0 ? <span>/</span> : null}
                  {item.href ? <Link to={item.href} className="hover:text-turquoise">{item.label}</Link> : <span className="text-ink">{item.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <h1 className="font-display text-2xl break-words text-ocean sm:text-3xl lg:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex w-full flex-wrap gap-2 sm:w-auto [&_a]:max-sm:flex-1 [&_button]:max-sm:flex-1">{actions}</div> : null}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
      <h3 className="font-display text-2xl text-ocean">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-ocean/40" aria-label="Close dialog" onClick={onClose} />
      <div className="relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-soft sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="min-w-0 pr-2 font-display text-xl text-ocean">{title}</h2>
          <button type="button" className="shrink-0 rounded-lg p-2 hover:bg-sand" aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4 text-sm">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
  danger,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onClose: () => void
  danger?: boolean
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border bg-white p-4 shadow-soft ${
            toast.tone === 'error' ? 'border-coral/40' : toast.tone === 'success' ? 'border-turquoise/40' : 'border-border'
          }`}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ocean">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-xs text-muted">{toast.description}</p> : null}
            </div>
            <button type="button" className="rounded-lg p-1 hover:bg-sand" aria-label="Dismiss" onClick={() => dismiss(toast.id)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PermissionDenied({ message = 'Your selected demo role cannot access this action.' }: { message?: string }) {
  return (
    <Card className="p-6">
      <h2 className="font-display text-2xl text-ocean">Permission denied (demo)</h2>
      <p className="mt-2 text-sm text-muted">{message} Frontend role checks are not production security.</p>
    </Card>
  )
}
