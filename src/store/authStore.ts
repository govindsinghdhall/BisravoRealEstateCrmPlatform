import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { STORAGE_KEYS } from '@/utils/constants'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setAuth: (user: User, accessToken: string) => void
  setUser: (user: User) => void
  setAccessToken: (accessToken: string) => void
  setHasHydrated: (value: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: STORAGE_KEYS.TOKEN,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
