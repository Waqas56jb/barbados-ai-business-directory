import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'
import type { Report } from '@/types'

export async function getReports(filters: { status?: string; search?: string } = {}) {
  await mockDelay()
  let items = [...useAdminStore.getState().reports]
  if (filters.status) items = items.filter((item) => item.status === filters.status)
  const search = filters.search?.toLowerCase().trim()
  if (search) {
    items = items.filter(
      (item) =>
        item.id.toLowerCase().includes(search) ||
        item.reason.toLowerCase().includes(search) ||
        item.entityId.toLowerCase().includes(search),
    )
  }
  return items
}

export async function resolveReport(id: string, status: Report['status'], notes: string) {
  await mockDelay()
  useAdminStore.getState().resolveReport(id, status, notes)
}
