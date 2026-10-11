import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'

export async function getNotifications() {
  await mockDelay()
  return useAdminStore.getState().notifications
}

export async function markRead(id: string) {
  await mockDelay()
  useAdminStore.getState().markNotificationRead(id)
}

export async function markAllRead() {
  await mockDelay()
  useAdminStore.getState().markAllNotificationsRead()
}
