const isBrowser = () => typeof window !== 'undefined'

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota errors in demo
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // no-op
  }
}

export const storageKeys = {
  auth: 'be-business:auth',
  demoState: 'be-business:demo-state',
  settings: 'be-business:settings',
  toasts: 'be-business:toasts',
} as const
