import { useDemoStore } from '@/store/demoStore'
import type { Business, BusinessStatus } from '@/types'

const delay = <T,>(value: T, ms = 120) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function getBusinesses(): Promise<Business[]> {
  return delay(useDemoStore.getState().businesses)
}

export async function getBusinessById(id: string): Promise<Business | undefined> {
  return delay(useDemoStore.getState().businesses.find((business) => business.id === id))
}

export async function createBusiness(
  input: Partial<Business> & { name: string; category: string; parish: string },
): Promise<Business> {
  return delay(useDemoStore.getState().createBusiness(input))
}

export async function updateBusiness(id: string, input: Partial<Business>): Promise<Business | undefined> {
  const current = useDemoStore.getState().businesses.find((business) => business.id === id)
  if (!current) return delay(undefined)
  const next = { ...current, ...input, id }
  useDemoStore.getState().upsertBusiness(next)
  return delay(next)
}

export async function archiveBusiness(id: string): Promise<void> {
  useDemoStore.getState().archiveBusiness(id)
  return delay(undefined)
}

export async function setBusinessStatus(id: string, status: BusinessStatus): Promise<void> {
  useDemoStore.getState().setBusinessStatus(id, status)
  return delay(undefined)
}
