import { create } from 'zustand'
import { readStorage, storageKeys, writeStorage } from '@/lib/storage'

interface FavoritesState {
  favoriteIds: string[]
  recentlyViewedIds: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  addRecentlyViewed: (id: string) => void
  clearFavorites: () => void
}

const MAX_RECENT = 8

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: readStorage<string[]>(storageKeys.favorites, []),
  recentlyViewedIds: readStorage<string[]>(storageKeys.recentlyViewed, []),

  toggleFavorite: (id) => {
    set((state) => {
      const exists = state.favoriteIds.includes(id)
      const favoriteIds = exists
        ? state.favoriteIds.filter((item) => item !== id)
        : [...state.favoriteIds, id]
      writeStorage(storageKeys.favorites, favoriteIds)
      return { favoriteIds }
    })
  },

  isFavorite: (id) => get().favoriteIds.includes(id),

  addRecentlyViewed: (id) => {
    set((state) => {
      const recentlyViewedIds = [id, ...state.recentlyViewedIds.filter((item) => item !== id)].slice(0, MAX_RECENT)
      writeStorage(storageKeys.recentlyViewed, recentlyViewedIds)
      return { recentlyViewedIds }
    })
  },

  clearFavorites: () => {
    writeStorage(storageKeys.favorites, [])
    set({ favoriteIds: [] })
  },
}))
