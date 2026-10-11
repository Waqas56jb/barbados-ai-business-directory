import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'
import type { KnowledgeRecord } from '@/types'

export async function getKnowledgeRecords(filters: { search?: string; sourceType?: string } = {}) {
  await mockDelay()
  let items = [...useAdminStore.getState().knowledge]
  const search = filters.search?.toLowerCase().trim()
  if (search) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.content.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search),
    )
  }
  if (filters.sourceType) items = items.filter((item) => item.sourceType === filters.sourceType)
  return items
}

export async function getKnowledgeRecord(id: string) {
  await mockDelay()
  return useAdminStore.getState().knowledge.find((item) => item.id === id)
}

export async function updateKnowledgeRecord(id: string, input: Partial<KnowledgeRecord>) {
  await mockDelay()
  const current = useAdminStore.getState().knowledge.find((item) => item.id === id)
  if (!current) return undefined
  const next = { ...current, ...input, updatedAt: new Date().toISOString() }
  useAdminStore.getState().upsertKnowledge(next)
  return next
}

export async function simulateRefresh(id: string) {
  await mockDelay(600)
  useAdminStore.getState().simulateKnowledgeRefresh(id)
}

export async function previewChatbotAnswer(question: string) {
  await mockDelay()
  return useAdminStore.getState().previewAnswer(question)
}
