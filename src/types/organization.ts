import type { WhatsAppSettings } from './whatsapp'

export interface OrganizationSettings {
  faviconUrl?: string
  tagline?: string
  whatsapp?: WhatsAppSettings | null
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo: string | null
  email: string | null
  phone: string | null
  address: string | null
  settings: OrganizationSettings | null
}

export interface UpdateOrganizationPayload {
  name?: string
  logo?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  settings?: OrganizationSettings | null
}
