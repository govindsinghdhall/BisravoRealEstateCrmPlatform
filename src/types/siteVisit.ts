import type { SITE_VISIT_STATUSES } from '@/utils/constants'

export type SiteVisitStatus = (typeof SITE_VISIT_STATUSES)[number]

export interface SiteVisit {
  id: string
  leadId: string
  leadName: string
  propertyId: string
  propertyTitle: string
  agentId: string
  agentName: string
  scheduledAt: string
  status: SiteVisitStatus
  notes?: string
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSiteVisitDto {
  leadId: string
  propertyId: string
  agentId: string
  scheduledAt: string
  status: SiteVisitStatus
  notes?: string
}

export type UpdateSiteVisitDto = Partial<CreateSiteVisitDto>
