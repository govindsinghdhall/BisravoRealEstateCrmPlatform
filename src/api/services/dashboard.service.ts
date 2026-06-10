import type { ChartDataPoint, DashboardStats, RecentActivity } from '@/types'
import type { ApiEnvelope, BackendLead } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { mapDashboardStats, mapRecentActivityFromLeads } from '../utils/mappers'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [leads, properties, siteVisits, bookings, sales, conversion] = await Promise.all([
      apiClient.get<ApiEnvelope<BackendLead[]>>(ENDPOINTS.LEADS.BASE, { params: { page: 1, limit: 1 } }),
      apiClient.get<ApiEnvelope<Record<string, unknown>>>(ENDPOINTS.PROPERTIES.INVENTORY),
      apiClient.get(ENDPOINTS.SITE_VISITS.BASE, { params: { page: 1, limit: 1, status: 'SCHEDULED' } }),
      apiClient.get(ENDPOINTS.BOOKINGS.BASE, { params: { page: 1, limit: 1, status: 'PENDING' } }),
      apiClient.get<ApiEnvelope<{ totalRevenue?: number }>>(ENDPOINTS.REPORTS.SALES),
      apiClient.get<ApiEnvelope<{ total: number; conversionRate: string }>>(ENDPOINTS.REPORTS.LEAD_CONVERSION),
    ])

    const leadsMeta = unwrapPaginated(leads.data)
    const siteVisitsMeta = unwrapPaginated(siteVisits.data)
    const bookingsMeta = unwrapPaginated(bookings.data)
    const inventory = unwrap(properties.data)
    const salesData = unwrap(sales.data)
    const conversionData = unwrap(conversion.data)

    const byStatus = (inventory.byStatus as { status: string; _count: number }[]) ?? []
    const available = byStatus.find((s) => s.status === 'AVAILABLE')?._count ?? 0
    const totalProperties = byStatus.reduce((sum, s) => sum + s._count, 0)

    return mapDashboardStats({
      leadsTotal: leadsMeta.total,
      activeLeads: leadsMeta.total,
      propertiesTotal: totalProperties,
      availableProperties: available,
      upcomingSiteVisits: siteVisitsMeta.total,
      pendingBookings: bookingsMeta.total,
      monthlyRevenue: salesData.totalRevenue ?? 0,
      conversionRate: parseFloat(conversionData.conversionRate) || 0,
    })
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendLead[]>>(ENDPOINTS.LEADS.BASE, {
      params: { page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' },
    })
    return mapRecentActivityFromLeads(unwrapPaginated(data).data)
  },

  async getChartData(): Promise<ChartDataPoint[]> {
    const { data } = await apiClient.get<ApiEnvelope<{ byStatus?: { status: string; _count: number }[] }>>(
      ENDPOINTS.REPORTS.SALES,
    )
    const sales = unwrap(data)
    return (sales.byStatus ?? []).map((item) => ({
      label: item.status,
      value: item._count,
    }))
  },
}
