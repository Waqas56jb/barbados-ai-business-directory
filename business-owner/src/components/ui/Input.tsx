import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

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
      {error ? (
        <span className="mt-1.5 block text-xs text-coral" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
}

const controlClass =
  'w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-turquoise'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClass} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${controlClass} ${className}`} {...props}>
      {children}
    </select>
  )
}
