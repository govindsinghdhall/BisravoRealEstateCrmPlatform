import type { LEAD_STATUSES } from '@/utils/constants'

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export interface Lead {
  id: number
  contactId?: number
  firstName: string
  lastName: string
  email: string
  phone: string
  status: LeadStatus
  source: string
  sourceId?: number
  budget: number
  propertyType: string
  location: string
  assignedTo?: number
  assignedToName?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateLeadDto {
  firstName: string
  lastName: string
  email: string
  phone: string
  status: LeadStatus
  source?: string
  sourceId: number
  budget: number
  propertyType: string
  location: string
  assignedTo?: number
  notes?: string
}

export type UpdateLeadDto = Partial<CreateLeadDto>

export interface LeadNote {
  id: number
  content: string
  createdAt: string
  createdByName?: string
}

export interface LeadTimelineEntry {
  id: number
  action: string
  description?: string
  createdAt: string
  performedByName?: string
}

export interface LeadDetail extends Lead {
  priority?: string
  alternatePhone?: string
  address?: string
  state?: string
  pincode?: string
  propertyTitle?: string
  projectName?: string
  createdByName?: string
  notesList: LeadNote[]
  timeline: LeadTimelineEntry[]
  counts?: { notes: number; siteVisits: number; bookings: number }
}
