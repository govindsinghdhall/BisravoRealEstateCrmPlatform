import type {
  AgentPerformance,
  Booking,
  Contact,
  ContactDetail,
  ContactLeadSummary,
  DashboardStats,
  Lead,
  LeadDetail,
  LeadNote,
  LeadSourceReport,
  LeadTimelineEntry,
  Property,
  RecentActivity,
  ReportSummary,
  SalesReport,
  SiteVisit,
  UserRecord,
} from '@/types'
import type {
  BackendBooking,
  BackendContact,
  BackendContactLead,
  BackendLead,
  BackendLeadNote,
  BackendLeadTimeline,
  BackendProperty,
  BackendSiteVisit,
  BackendUser,
} from '../types/backend'
import { mapRoleName } from './enums'

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  return typeof value === 'number' ? value : Number(value) || 0
}

export function mapUser(user: BackendUser): UserRecord {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId,
    role: mapRoleName(user.role?.name) as UserRecord['role'],
    phone: user.phone ?? undefined,
    avatar: user.avatar ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function mapLeadNote(note: BackendLeadNote): LeadNote {
  return {
    id: toNumber(note.id),
    content: note.content,
    createdAt: note.createdAt,
    createdByName: note.createdBy
      ? `${note.createdBy.firstName} ${note.createdBy.lastName}`
      : undefined,
  }
}

export function mapLeadTimeline(entry: BackendLeadTimeline): LeadTimelineEntry {
  return {
    id: toNumber(entry.id),
    action: entry.action,
    description: entry.description ?? undefined,
    createdAt: entry.createdAt,
    performedByName: entry.performedBy
      ? `${entry.performedBy.firstName} ${entry.performedBy.lastName}`
      : undefined,
  }
}

export function mapLead(lead: BackendLead): Lead {
  return {
    id: toNumber(lead.id),
    contactId: lead.contactId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email ?? '',
    phone: lead.phone,
    status: lead.status as Lead['status'],
    source: lead.source?.name ?? '',
    sourceId: toNumber(lead.sourceId),
    budget: toNumber(lead.budget),
    propertyType: lead.requirements ?? lead.property?.type ?? '',
    location: lead.city ?? lead.address ?? '',
    notes: lead.requirements ?? undefined,
    assignedTo: lead.assignedToId != null ? toNumber(lead.assignedToId) : undefined,
    assignedToName: lead.assignedTo
      ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
      : undefined,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  }
}

export function mapLeadDetail(lead: BackendLead): LeadDetail {
  return {
    ...mapLead(lead),
    priority: lead.priority,
    alternatePhone: lead.alternatePhone ?? undefined,
    address: lead.address ?? undefined,
    state: lead.state ?? undefined,
    pincode: lead.pincode ?? undefined,
    propertyTitle: lead.property?.title,
    projectName: lead.project?.name,
    createdByName: lead.createdBy
      ? `${lead.createdBy.firstName} ${lead.createdBy.lastName}`
      : undefined,
    notesList: (lead.notes ?? []).map(mapLeadNote),
    timeline: (lead.timeline ?? []).map(mapLeadTimeline),
    counts: lead._count,
  }
}

function mapContactLeadSummary(lead: BackendContactLead): ContactLeadSummary {
  return {
    id: toNumber(lead.id),
    status: lead.status as ContactLeadSummary['status'],
    source: lead.source?.name,
    propertyTitle: lead.property?.title,
    assignedToName: lead.assignedTo
      ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
      : undefined,
    budget: toNumber(lead.budget),
    propertyType: lead.requirements ?? undefined,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  }
}

export function mapContact(contact: BackendContact): Contact {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email ?? undefined,
    phone: contact.phone,
    alternatePhone: contact.alternatePhone ?? undefined,
    address: contact.address ?? undefined,
    city: contact.city ?? undefined,
    state: contact.state ?? undefined,
    pincode: contact.pincode ?? undefined,
    source: contact.source?.name,
    sourceId: contact.sourceId != null ? toNumber(contact.sourceId) : undefined,
    leadsCount: contact._count?.leads,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  }
}

export function mapContactDetail(contact: BackendContact): ContactDetail {
  return {
    ...mapContact(contact),
    leads: (contact.leads ?? []).map(mapContactLeadSummary),
  }
}

export function mapProperty(property: BackendProperty): Property {
  return {
    id: property.id,
    title: property.title,
    description: property.description ?? '',
    listingCategory: (property.listingCategory ?? 'BUY') as Property['listingCategory'],
    type: property.type as Property['type'],
    status: property.status as Property['status'],
    price: toNumber(property.price),
    area: toNumber(property.area),
    carpetArea: property.carpetArea ? toNumber(property.carpetArea) : undefined,
    builtUpArea: property.builtUpArea ? toNumber(property.builtUpArea) : undefined,
    superArea: property.superArea ? toNumber(property.superArea) : undefined,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    address: property.address,
    city: property.city,
    state: property.state,
    zipCode: property.pincode ?? '',
    locality: property.locality ?? property.city,
    sector: property.sector ?? undefined,
    landmark: property.landmark ?? undefined,
    latitude: property.latitude ? toNumber(property.latitude) : undefined,
    longitude: property.longitude ? toNumber(property.longitude) : undefined,
    builderName: property.builderName ?? undefined,
    propertyAge: property.propertyAge as Property['propertyAge'],
    furnishing: property.furnishing as Property['furnishing'],
    facing: property.facing as Property['facing'],
    possessionStatus: property.possessionStatus as Property['possessionStatus'],
    possessionDate: property.possessionDate ?? undefined,
    roiPotential: property.roiPotential ? toNumber(property.roiPotential) : undefined,
    isVerified: property.isVerified ?? true,
    hasRera: property.hasRera ?? false,
    reraId: property.reraId ?? undefined,
    videoTourUrl: property.videoTourUrl ?? undefined,
    virtualTourUrl: property.virtualTourUrl ?? undefined,
    brochureUrl: property.brochureUrl ?? undefined,
    amenities: property.amenities ?? [],
    images:
      property.images?.map((img) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary ?? false,
        caption: img.caption ?? null,
      })) ?? [],
    isActive: property.isActive ?? true,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  }
}

export function mapSiteVisit(visit: BackendSiteVisit): SiteVisit {
  return {
    id: visit.id,
    leadId: visit.leadId,
    leadName: visit.lead ? `${visit.lead.firstName} ${visit.lead.lastName}` : '',
    propertyId: visit.propertyId ?? '',
    propertyTitle: visit.property?.title ?? '',
    agentId: visit.agentId,
    agentName: visit.agent ? `${visit.agent.firstName} ${visit.agent.lastName}` : '',
    scheduledAt: visit.scheduledAt,
    status: visit.status as SiteVisit['status'],
    notes: visit.notes ?? undefined,
    feedback: visit.feedback ?? undefined,
    createdAt: visit.createdAt,
    updatedAt: visit.updatedAt,
  }
}

export function mapBooking(booking: BackendBooking): Booking {
  return {
    id: booking.id,
    leadId: booking.leadId,
    leadName: booking.lead ? `${booking.lead.firstName} ${booking.lead.lastName}` : '',
    propertyId: booking.property?.id ?? booking.unit?.id ?? '',
    propertyTitle: booking.property?.title ?? booking.unit?.unitNumber ?? booking.bookingNumber,
    agentId: booking.agentId,
    agentName: booking.agent ? `${booking.agent.firstName} ${booking.agent.lastName}` : '',
    amount: toNumber(booking.totalAmount),
    status: booking.status as Booking['status'],
    bookingDate: booking.bookingDate ?? booking.createdAt,
    notes: booking.notes ?? undefined,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }
}

export function mapDashboardStats(data: {
  leadsTotal: number
  activeLeads: number
  propertiesTotal: number
  availableProperties: number
  upcomingSiteVisits: number
  pendingBookings: number
  monthlyRevenue: number
  conversionRate: number
}): DashboardStats {
  return {
    totalLeads: data.leadsTotal,
    activeLeads: data.activeLeads,
    totalProperties: data.propertiesTotal,
    availableProperties: data.availableProperties,
    upcomingSiteVisits: data.upcomingSiteVisits,
    pendingBookings: data.pendingBookings,
    monthlyRevenue: data.monthlyRevenue,
    conversionRate: data.conversionRate,
  }
}

export function mapRecentActivityFromLeads(leads: BackendLead[]): RecentActivity[] {
  return leads.slice(0, 5).map((lead) => ({
    id: lead.id,
    type: 'lead' as const,
    title: 'New Lead',
    description: `${lead.firstName} ${lead.lastName} — ${lead.city ?? 'No location'}`,
    timestamp: lead.createdAt,
  }))
}

export function mapReportSummary(data: {
  totalLeads: number
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  conversionRate: number
  avgDealSize: number
}): ReportSummary {
  return data
}

export function mapSalesReport(data: {
  byStatus?: { status: string; _count: number; _sum?: { totalAmount?: string } }[]
  totalRevenue?: number
  totalBookings?: number
}): SalesReport[] {
  if (!data.byStatus?.length) {
    return [{ month: 'Current', leads: 0, bookings: data.totalBookings ?? 0, revenue: data.totalRevenue ?? 0 }]
  }
  return data.byStatus.map((item) => ({
    month: item.status,
    leads: 0,
    bookings: item._count,
    revenue: toNumber(item._sum?.totalAmount),
  }))
}

export function mapAgentPerformance(
  agents: {
    agent: { id: string; name: string; email: string }
    totalLeads: number
    wonLeads: number
    conversionRate: string
    totalBookings: number
    totalSiteVisits: number
    revenue: number
  }[],
): AgentPerformance[] {
  return agents.map((item) => ({
    agentId: item.agent.id,
    agentName: item.agent.name,
    leads: item.totalLeads,
    siteVisits: item.totalSiteVisits,
    bookings: item.totalBookings,
    revenue: item.revenue,
    conversionRate: parseFloat(item.conversionRate) || 0,
  }))
}

export function mapLeadSources(
  sources: { source: { name: string }; count: number }[],
  total: number,
): LeadSourceReport[] {
  return sources.map((item) => ({
    source: item.source.name,
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }))
}
