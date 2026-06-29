export interface DashboardStats {
  totalLeads: number
  activeLeads: number
  totalProperties: number
  availableProperties: number
  upcomingSiteVisits: number
  pendingBookings: number
  monthlyRevenue: number
  conversionRate: number
}

export interface RecentActivity {
  id: number | string
  type: 'lead' | 'property' | 'site_visit' | 'booking'
  title: string
  description: string
  timestamp: string
}

export interface ChartDataPoint {
  label: string
  value: number
}
