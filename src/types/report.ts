export interface ReportSummary {
  totalLeads: number
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  conversionRate: number
  avgDealSize: number
}

export interface SalesReport {
  month: string
  leads: number
  bookings: number
  revenue: number
}

export interface AgentPerformance {
  agentId: string
  agentName: string
  leads: number
  siteVisits: number
  bookings: number
  revenue: number
  conversionRate: number
}

export interface LeadSourceReport {
  source: string
  count: number
  percentage: number
}
