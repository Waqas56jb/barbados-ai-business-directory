import { beforeEach, describe, expect, it } from 'vitest'
import { approveListing, rejectListing, requestListingChanges } from '@/services/moderationService'
import { useAdminStore } from '@/store/adminStore'

describe('moderation transitions', () => {
  beforeEach(() => {
    useAdminStore.getState().resetDemoData()
    useAdminStore.getState().loginDemo()
  })

  it('approves a listing into published demo status', async () => {
    const pending = useAdminStore.getState().businesses.find((b) => b.status === 'pending_review')
    expect(pending).toBeTruthy()
    await approveListing(pending!.id)
    const updated = useAdminStore.getState().businesses.find((b) => b.id === pending!.id)
    expect(updated?.status).toBe('published')
  })

  it('requires a reason when requesting changes', async () => {
    const pending = useAdminStore.getState().businesses.find((b) => b.status === 'pending_review')
    await expect(requestListingChanges(pending!.id, '   ')).rejects.toThrow('required')
  })

  it('rejects with a reason and records audit history', async () => {
    const pending = useAdminStore.getState().businesses.find((b) => b.status === 'pending_review')
    await rejectListing(pending!.id, 'Incomplete service details')
    const updated = useAdminStore.getState().businesses.find((b) => b.id === pending!.id)
    expect(updated?.status).toBe('rejected')
    expect(
      useAdminStore.getState().auditLogs.some((log) => log.entityId === pending!.id && log.action.includes('rejected')),
    ).toBe(true)
  })
})
