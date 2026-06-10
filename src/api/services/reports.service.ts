import type { AgentPerformance, LeadSourceReport, ReportSummary, SalesReport } from '@/types'
import type { ApiEnvelope } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'
import { mapAgentPerformance, mapLeadSources, mapReportSummary, mapSalesReport } from '../utils/mappers'

export const reportsService = {
  async getSummary(): Promise<ReportSummary> {
    const [conversion, sales, properties] = await Promise.all([
      apiClient.get<ApiEnvelope<{ total: number; conversionRate: string }>>(ENDPOINTS.REPORTS.LEAD_CONVERSION),
      apiClient.get<ApiEnvelope<{ totalBookings: number; totalRevenue: number }>>(ENDPOINTS.REPORTS.SALES),
      apiClient.get<ApiEnvelope<Record<string, unknown>>>(ENDPOINTS.PROPERTIES.INVENTORY),
    ])

    const conversionData = unwrap(conversion.data)
    const salesData = unwrap(sales.data)
    const inventory = unwrap(properties.data)
    const byStatus = (inventory.byStatus as { _count: number }[]) ?? []
    const totalProperties = byStatus.reduce((sum, s) => sum + s._count, 0)

    return mapReportSummary({
      totalLeads: conversionData.total,
      totalProperties,
      totalBookings: salesData.totalBookings ?? 0,
      totalRevenue: salesData.totalRevenue ?? 0,
      conversionRate: parseFloat(conversionData.conversionRate) || 0,
      avgDealSize:
        salesData.totalBookings && salesData.totalRevenue
          ? Math.round(salesData.totalRevenue / salesData.totalBookings)
          : 0,
    })
  },

  async getSalesReport(): Promise<SalesReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(ENDPOINTS.REPORTS.SALES)
    return mapSalesReport(unwrap(data))
  },

  async getAgentPerformance(): Promise<AgentPerformance[]> {
    const { data } = await apiClient.get<ApiEnvelope<unknown[]>>(ENDPOINTS.REPORTS.AGENT_PERFORMANCE)
    return mapAgentPerformance(unwrap(data) as Parameters<typeof mapAgentPerformance>[0])
  },

  async getLeadSources(): Promise<LeadSourceReport[]> {
    const { data } = await apiClient.get<ApiEnvelope<{ total: number; bySource: { source: { name: string }; count: number }[] }>>(
      ENDPOINTS.REPORTS.LEAD_CONVERSION,
    )
    const report = unwrap(data)
    return mapLeadSources(report.bySource ?? [], report.total)
  },
}
