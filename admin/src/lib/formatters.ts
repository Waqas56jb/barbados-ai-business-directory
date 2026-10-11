export function formatDate(value?: string): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value?: string): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

export function formatCurrency(value?: number): string {
  if (value === undefined) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function statusLabel(status: string): string {
  return status
    .replaceAll('_demo', '')
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function exportCsv(filename: string, rows: Record<string, string | number | boolean | undefined>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0]!)
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? ''
          const text = String(value).replaceAll('"', '""')
          return `"${text}"`
        })
        .join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
