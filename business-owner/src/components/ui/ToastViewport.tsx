import { X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border bg-white p-4 shadow-soft ${
            toast.tone === 'error'
              ? 'border-coral/40'
              : toast.tone === 'success'
                ? 'border-turquoise/40'
                : 'border-border'
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
