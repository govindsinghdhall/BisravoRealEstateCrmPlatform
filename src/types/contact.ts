import type { LeadStatus } from './lead'

export interface Contact {
  id: number
  firstName: string
  lastName: string
  email?: string
  phone: string
  alternatePhone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  source?: string
  sourceId?: number
  leadsCount?: number
  createdAt: string
  updatedAt: string
}

export interface ContactLeadSummary {
  id: number
  status: LeadStatus
  source?: string
  propertyTitle?: string
  assignedToName?: string
  budget: number
  propertyType?: string
  createdAt: string
  updatedAt: string
}

export interface ContactDetail extends Contact {
  leads: ContactLeadSummary[]
}

export interface CreateContactDto {
  firstName: string
  lastName: string
  phone: string
  email?: string
  alternatePhone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  sourceId?: number
}

export type UpdateContactDto = Partial<CreateContactDto>

export type ContactImportRowStatus = 'valid' | 'duplicate' | 'invalid'
export type ContactDuplicateAction = 'skip' | 'update'

export interface ContactImportPreviewRow {
  row: number
  firstName: string
  lastName?: string
  phone: string
  email?: string
  city?: string
  status: ContactImportRowStatus
  errors: string[]
  existingContactId?: number
}

export interface ContactImportPreviewResult {
  totalRows: number
  validRows: number
  duplicateRows: number
  invalidRows: number
  rows: ContactImportPreviewRow[]
}

export interface ContactImportResult {
  success: boolean
  created: number
  updated: number
  skipped: number
}
