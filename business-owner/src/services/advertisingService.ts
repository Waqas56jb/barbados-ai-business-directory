import { useDemoStore } from '@/store/demoStore'
import type { Promotion } from '@/types'

const delay = <T,>(value: T, ms = 120) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function getPromotions(businessId?: string): Promise<Promotion[]> {
  const promotions = useDemoStore.getState().promotions
  return delay(businessId ? promotions.filter((item) => item.businessId === businessId) : promotions)
}

export async function getPromotionById(id: string): Promise<Promotion | undefined> {
  return delay(useDemoStore.getState().promotions.find((item) => item.id === id))
}

export async function createPromotion(input: Promotion): Promise<Promotion> {
  useDemoStore.getState().upsertPromotion(input)
  return delay(input)
}

export async function updatePromotion(id: string, input: Partial<Promotion>): Promise<Promotion | undefined> {
  const current = useDemoStore.getState().promotions.find((item) => item.id === id)
  if (!current) return delay(undefined)
  const next = { ...current, ...input, id }
  useDemoStore.getState().upsertPromotion(next)
  return delay(next)
}
