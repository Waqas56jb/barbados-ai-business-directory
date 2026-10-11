import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'
import type { AccountStatus } from '@/types'

export async function getOwners(filters: { search?: string; status?: string } = {}) {
  await mockDelay()
  let owners = [...useAdminStore.getState().owners]
  const search = filters.search?.toLowerCase().trim()
  if (search) {
    owners = owners.filter(
      (owner) => owner.name.toLowerCase().includes(search) || owner.email.toLowerCase().includes(search),
    )
  }
  if (filters.status) owners = owners.filter((owner) => owner.status === filters.status)
  return owners
}

export async function getOwnerById(id: string) {
  await mockDelay()
  const state = useAdminStore.getState()
  const owner = state.owners.find((item) => item.id === id)
  if (!owner) return undefined
  return {
    owner,
    businesses: state.businesses.filter((business) => business.ownerId === id),
    promotions: state.promotions.filter((promo) => promo.ownerId === id),
    audits: state.auditLogs.filter((log) => log.entityType === 'owner' && log.entityId === id),
  }
}

export async function updateOwnerStatus(id: string, status: AccountStatus, notes?: string) {
  await mockDelay()
  useAdminStore.getState().updateOwnerStatus(id, status, notes)
}
