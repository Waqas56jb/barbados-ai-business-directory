import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'
import type { PromoStatus } from '@/types'

export async function getCampaigns(filters: { search?: string; status?: string } = {}) {
  await mockDelay()
  let items = [...useAdminStore.getState().promotions]
  const search = filters.search?.toLowerCase().trim()
  if (search) {
    items = items.filter(
      (item) => item.name.toLowerCase().includes(search) || item.id.toLowerCase().includes(search),
    )
  }
  if (filters.status) items = items.filter((item) => item.status === filters.status)
  return items
}

export async function approveCampaign(id: string) {
  await mockDelay()
  useAdminStore.getState().updatePromotionStatus(id, 'approved')
}

export async function requestCampaignChanges(id: string, reason: string) {
  await mockDelay()
  if (!reason.trim()) throw new Error('Change request reason is required')
  useAdminStore.getState().updatePromotionStatus(id, 'pending_review', reason.trim())
}

export async function updateCampaignStatus(id: string, status: PromoStatus, reason?: string) {
  await mockDelay()
  if ((status === 'rejected' || status === 'cancelled') && !reason?.trim()) {
    throw new Error('A reason is required for this action')
  }
  useAdminStore.getState().updatePromotionStatus(id, status, reason)
}
