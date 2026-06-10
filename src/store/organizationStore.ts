import { create } from 'zustand'
import type { Organization } from '@/types/organization'

interface OrganizationState {
  organization: Organization | null
  setOrganization: (organization: Organization | null) => void
  clearOrganization: () => void
}

/** In-memory only — logo/favicon URLs are fetched from the API (not localStorage). */
export const useOrganizationStore = create<OrganizationState>((set) => ({
  organization: null,
  setOrganization: (organization) => set({ organization }),
  clearOrganization: () => set({ organization: null }),
}))
