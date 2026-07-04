export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
  meta?: PaginationMeta
}

export interface BackendRole {
  id: string
  name: string
}

export interface BackendUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  avatar?: string | null
  isActive: boolean
  roleId: string
  role?: BackendRole
  permissions?: string[]
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  user: BackendUser
  accessToken: string
}

export interface BackendLeadSource {
  id: number
  name: string
  type: string
}

export interface BackendLeadNote {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  createdBy?: { id: number; firstName: string; lastName: string }
}

export interface BackendLeadTimeline {
  id: number
  action: string
  description?: string | null
  metadata?: unknown
  createdAt: string
  performedBy?: { id: number; firstName: string; lastName: string }
}

export interface BackendLeadPropertyLink {
  id: number
  propertyId: number
  isPrimary: boolean
  interestLevel: string
  matchScore?: number | null
  notes?: string | null
  property?: {
    id: number
    title: string
    type: string
    status: string
    price: number
    city?: string
    locality?: string
    bedrooms?: number | null
  }
  createdAt: string
}

export interface BackendPropertySuggestion {
  property: BackendProperty
  matchScore: number
  matchReasons: string[]
}

export interface BackendLead {
  id: number
  contactId?: number
  firstName: string
  lastName: string
  email?: string | null
  phone: string
  alternatePhone?: string | null
  status: string
  priority?: string
  budget?: string | number | null
  requirements?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  sourceId: number
  assignedToId?: number | null
  propertyId?: number | null
  source?: BackendLeadSource
  assignedTo?: { id: number; firstName: string; lastName: string; email?: string }
  createdBy?: { id: number; firstName: string; lastName: string; email?: string }
  property?: { id: number; title: string; city?: string; type?: string }
  project?: { id: number; name: string; city?: string }
  linkedProperties?: BackendLeadPropertyLink[]
  notes?: BackendLeadNote[]
  timeline?: BackendLeadTimeline[]
  _count?: { notes: number; siteVisits: number; bookings: number }
  createdAt: string
  updatedAt: string
}

export interface BackendContactLead {
  id: number
  status: string
  budget?: string | number | null
  requirements?: string | null
  source?: BackendLeadSource
  property?: { id: string; title: string }
  assignedTo?: { id: string; firstName: string; lastName: string }
  createdAt: string
  updatedAt: string
}

export interface BackendContact {
  id: number
  firstName: string
  lastName: string
  email?: string | null
  phone: string
  alternatePhone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  sourceId?: string | null
  source?: BackendLeadSource
  _count?: { leads: number }
  leads?: BackendContactLead[]
  createdAt: string
  updatedAt: string
}

export interface BackendProperty {
  id: string
  title: string
  description?: string | null
  listingCategory?: string
  type: string
  status: string
  price: string | number
  area: string | number
  carpetArea?: string | number | null
  builtUpArea?: string | number | null
  superArea?: string | number | null
  bedrooms?: number | null
  bathrooms?: number | null
  address: string
  city: string
  state: string
  pincode?: string | null
  locality?: string | null
  sector?: string | null
  landmark?: string | null
  latitude?: string | number | null
  longitude?: string | number | null
  builderName?: string | null
  propertyAge?: string | null
  furnishing?: string | null
  facing?: string | null
  possessionStatus?: string | null
  possessionDate?: string | null
  roiPotential?: string | number | null
  isVerified?: boolean
  hasRera?: boolean
  reraId?: string | null
  videoTourUrl?: string | null
  virtualTourUrl?: string | null
  brochureUrl?: string | null
  amenities?: string[]
  isActive?: boolean
  ownerName?: string | null
  ownerPhone?: string | null
  ownerEmail?: string | null
  ownerAddress?: string | null
  ownerNotes?: string | null
  images?: { id: string; url: string; isPrimary?: boolean; caption?: string | null }[]
  createdAt: string
  updatedAt: string
}

export interface BackendSiteVisit {
  id: string
  scheduledAt: string
  status: string
  notes?: string | null
  feedback?: string | null
  leadId: string
  agentId: string
  propertyId?: string | null
  lead?: { id: string; firstName: string; lastName: string; phone?: string }
  agent?: { id: string; firstName: string; lastName: string; email?: string }
  property?: { id: string; title: string }
  createdAt: string
  updatedAt: string
}

export interface BackendBooking {
  id: string
  bookingNumber: string
  status: string
  totalAmount: string | number
  paidAmount?: string | number
  bookingDate?: string | null
  notes?: string | null
  leadId: string
  agentId: string
  lead?: { id: string; firstName: string; lastName: string; phone?: string }
  agent?: { id: string; firstName: string; lastName: string }
  property?: { id: string; title: string; city?: string; price?: string | number }
  unit?: { id: string; unitNumber?: string; type?: string; price?: string | number }
  createdAt: string
  updatedAt: string
}
