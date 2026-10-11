import { useDemoStore } from '@/store/demoStore'

const delay = <T,>(value: T, ms = 80) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function getNotifications() {
  return delay(useDemoStore.getState().notifications)
}

export async function markNotificationRead(id: string) {
  useDemoStore.getState().markNotificationRead(id)
  return delay(undefined)
}

export async function markAllNotificationsRead() {
  useDemoStore.getState().markAllNotificationsRead()
  return delay(undefined)
}
