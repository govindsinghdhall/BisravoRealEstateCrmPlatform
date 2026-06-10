import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/constants'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
  toggleCollapsed: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: false,
      isCollapsed: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: STORAGE_KEYS.SIDEBAR,
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    },
  ),
)
