import { create } from 'zustand'
import { seedBusinesses } from '@/data/businesses'
import { readStorage, storageKeys, writeStorage } from '@/lib/storage'
import type { Business } from '@/types/business'

type BusinessOverrides = Record<string, Partial<Business>>

interface BusinessState {
  overrides: BusinessOverrides
  getBusinesses: () => Business[]
  getBusinessBySlug: (slug: string) => Business | undefined
  updateDemoBusiness: (id: string, patch: Partial<Business>) => void
  resetDemoBusinesses: () => void
}

function mergeBusiness(business: Business, override?: Partial<Business>): Business {
  if (!override) return business
  return {
    ...business,
    ...override,
    lastUpdated: override.lastUpdated ?? new Date().toISOString(),
  }
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  overrides: readStorage<BusinessOverrides>(storageKeys.demoBusinessOverrides, {}),

  getBusinesses: () => {
    const { overrides } = get()
    return seedBusinesses.map((business) => mergeBusiness(business, overrides[business.id]))
  },

  getBusinessBySlug: (slug: string) => {
    return get().getBusinesses().find((business) => business.slug === slug)
  },

  updateDemoBusiness: (id, patch) => {
    set((state) => {
      const next = {
        ...state.overrides,
        [id]: {
          ...state.overrides[id],
          ...patch,
          lastUpdated: new Date().toISOString(),
        },
      }
      writeStorage(storageKeys.demoBusinessOverrides, next)
      return { overrides: next }
    })
  },

  resetDemoBusinesses: () => {
    writeStorage(storageKeys.demoBusinessOverrides, {})
    set({ overrides: {} })
  },
}))
