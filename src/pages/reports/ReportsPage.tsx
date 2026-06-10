import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo } from 'react'
import type { ColDef } from 'ag-grid-community'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSummaryGrid, PageSummaryItem } from '@/components/common/PageSummaryGrid'
import { SectionCard } from '@/components/common/SectionCard'
import { StatCard } from '@/components/common/StatCard'
import { DataTable } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { reportsService } from '@/api/services'
import { formatCurrency } from '@/utils/formatters'
import type { AgentPerformance } from '@/types'
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

const PIE_COLORS = ['#1565C0', '#00897B', '#ED6C02', '#7B1FA2', '#D32F2F']

export function ReportsPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: reportsService.getSummary,
  })

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['reports', 'sales'],
    queryFn: reportsService.getSalesReport,
  })

  const { data: agentData, isLoading: agentLoading } = useQuery({
    queryKey: ['reports', 'agents'],
    queryFn: reportsService.getAgentPerformance,
  })

  const { data: leadSources, isLoading: sourcesLoading } = useQuery({
    queryKey: ['reports', 'lead-sources'],
    queryFn: reportsService.getLeadSources,
  })

  const agentColumnDefs = useMemo<ColDef<AgentPerformance>[]>(
    () => [
      { field: 'agentName', headerName: 'Agent', minWidth: 180, cellClass: 'crm-cell-strong' },
      { field: 'leads', headerName: 'Leads', minWidth: 100 },
      { field: 'siteVisits', headerName: 'Site Visits', minWidth: 120 },
      { field: 'bookings', headerName: 'Bookings', minWidth: 110 },
      {
        field: 'revenue',
        headerName: 'Revenue',
        cellClass: 'crm-cell-strong',
        valueFormatter: (p) => formatCurrency(p.value ?? 0),
        minWidth: 140,
      },
      {
        field: 'conversionRate',
        headerName: 'Conversion',
        valueFormatter: (p) => `${p.value ?? 0}%`,
        minWidth: 120,
        cellClass: 'crm-cell-muted',
      },
    ],
    [],
  )

  if (summaryLoading) return <LoadingSpinner />

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="Analytics and performance insights"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Reports' }]}
      />

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard title="Total Leads" value={summary?.totalLeads ?? 0} icon={PeopleOutlineIcon} subtitle="All-time leads" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Total Bookings" value={summary?.totalBookings ?? 0} icon={AssessmentOutlinedIcon} color="#00897B" subtitle="Closed & active" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Total Revenue" value={formatCurrency(summary?.totalRevenue ?? 0)} icon={AttachMoneyIcon} color="#2E7D32" subtitle="Gross revenue" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Conversion Rate" value={`${summary?.conversionRate ?? 0}%`} icon={TrendingUpIcon} color="#0288D1" subtitle="Lead to booking" />
        </PageSummaryItem>
      </PageSummaryGrid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionCard title="Sales Performance" subtitle="Leads, bookings & revenue trends">
            {salesLoading ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#1565C0" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#00897B" strokeWidth={2} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#ED6C02" opacity={0.3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title="Lead Sources" subtitle="Where leads originate">
            {sourcesLoading ? (
              <LoadingSpinner />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadSources}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(props) => {
                      const entry = props as { source?: string; percentage?: number }
                      return `${entry.source ?? ''} (${entry.percentage ?? 0}%)`
                    }}
                  >
                    {leadSources?.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </Grid>
      </Grid>

      <DataTable
        title="Agent Performance"
        rowData={agentData ?? []}
        columnDefs={agentColumnDefs}
        loading={agentLoading}
        height={360}
      />
    </Box>
  )
}
