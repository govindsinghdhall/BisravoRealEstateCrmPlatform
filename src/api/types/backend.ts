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
  refreshToken: string
}

export interface TokenPayload {
  accessToken: string
  refreshToken: string
}

export interface BackendLeadSource {
  id: string
  name: string
  type: string
}

export interface BackendLeadNote {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  createdBy?: { id: string; firstName: string; lastName: string }
}

export interface BackendLeadTimeline {
  id: string
  action: string
  description?: string | null
  metadata?: unknown
  createdAt: string
  performedBy?: { id: string; firstName: string; lastName: string }
}

export interface BackendLead {
  id: string
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
  sourceId: string
  assignedToId?: string | null
  source?: BackendLeadSource
  assignedTo?: { id: string; firstName: string; lastName: string; email?: string }
  createdBy?: { id: string; firstName: string; lastName: string; email?: string }
  property?: { id: string; title: string; city?: string; type?: string }
  project?: { id: string; name: string; city?: string }
  notes?: BackendLeadNote[]
  timeline?: BackendLeadTimeline[]
  _count?: { notes: number; siteVisits: number; bookings: number }
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
