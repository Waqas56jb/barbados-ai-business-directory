import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'

export async function getConversations(filters: {
  fallbackOnly?: boolean
  flaggedOnly?: boolean
  search?: string
} = {}) {
  await mockDelay()
  let items = [...useAdminStore.getState().conversations]
  if (filters.fallbackOnly) items = items.filter((item) => item.hasFallback)
  if (filters.flaggedOnly) items = items.filter((item) => item.reviewStatus === 'flagged')
  const search = filters.search?.toLowerCase().trim()
  if (search) {
    items = items.filter(
      (item) =>
        item.id.toLowerCase().includes(search) ||
        item.messages.some((message) => message.content.toLowerCase().includes(search)),
    )
  }
  return items
}

export async function getConversationById(id: string) {
  await mockDelay()
  return useAdminStore.getState().conversations.find((item) => item.id === id)
}

export async function flagConversation(id: string) {
  await mockDelay()
  useAdminStore.getState().updateConversation(id, { reviewStatus: 'flagged' })
  useAdminStore.getState().addAudit({
    action: 'conversation_flagged',
    entityType: 'conversation',
    entityId: id,
    summary: 'Flagged chatbot conversation for review (demo)',
  })
}
