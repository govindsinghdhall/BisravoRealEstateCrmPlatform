import type { Property } from './property'

export interface PropertyOwnerInfo {
  ownerName?: string | null
  ownerPhone?: string | null
  ownerEmail?: string | null
  ownerAddress?: string | null
  ownerNotes?: string | null
}

export interface PropertyWithOwner extends Property, PropertyOwnerInfo {}

export type LeadPropertyInterestLevel =
  | 'SUGGESTED'
  | 'INTERESTED'
  | 'SHORTLISTED'
  | 'VIEWED'
  | 'REJECTED'

export interface LinkedPropertySummary {
  id: number
  title: string
  type: string
  status: string
  price: number
  city?: string
  locality?: string
  bedrooms?: number | null
}

export interface LeadPropertyLink {
  id: number
  leadId: number
  propertyId: number
  isPrimary: boolean
  interestLevel: LeadPropertyInterestLevel
  matchScore?: number | null
  notes?: string | null
  property?: LinkedPropertySummary
  createdAt: string
  updatedAt: string
}

export interface PropertySuggestion {
  property: Property
  matchScore: number
  matchReasons: string[]
}

export interface LinkPropertyDto {
  propertyId: number
  isPrimary?: boolean
  interestLevel?: LeadPropertyInterestLevel
  notes?: string
  matchScore?: number
}

export interface UpdateLinkedPropertyDto {
  isPrimary?: boolean
  interestLevel?: LeadPropertyInterestLevel
  notes?: string | null
}
