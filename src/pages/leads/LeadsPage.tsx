import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppTable, type AppTableColumn } from '@/components/common/AppTable'
import tableStyles from '@/components/common/AppTable.module.css'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { IdChip } from '@/components/common/IdChip'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSummaryGrid, PageSummaryItem } from '@/components/common/PageSummaryGrid'
import { SideDrawer } from '@/components/common/SideDrawer'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableRowActions } from '@/components/common/TableRowActions'
import { LeadFormFields } from '@/components/leads/LeadFormFields'
import { leadSchema, type LeadFormData } from '@/schemas/lead.schema'
import { getErrorMessage } from '@/api/client'
import { leadSourcesService, leadsService } from '@/api/services'
import {
  invalidateListQueries,
  prependToListCaches,
  removeFromListCaches,
  updateInListCaches,
} from '@/api/utils/query'
import { useAuthStore } from '@/store/authStore'
import { formatCurrency, formatLeadId } from '@/utils/formatters'
import type { Lead } from '@/types'

const defaultValues: LeadFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'NEW',
  sourceId: '',
  budget: 0,
  propertyType: '',
  location: '',
  notes: '',
}

export function LeadsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['leads', search],
    queryFn: () => leadsService.getAll({ search, pageSize: 50 }),
    enabled: !!accessToken,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    staleTime: 0,
  })

  const { data: leadSources = [] } = useQuery({
    queryKey: ['lead-sources'],
    queryFn: leadSourcesService.getAll,
  })

  const { control, handleSubmit, reset } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues,
  })

  const createMutation = useMutation({
    mutationFn: leadsService.create,
    onSuccess: async (lead) => {
      prependToListCaches(queryClient, ['leads'], lead)
      await invalidateListQueries(queryClient, ['leads'])
      handleCloseDrawer()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadFormData }) =>
      leadsService.update(id, data),
    onSuccess: async (lead) => {
      updateInListCaches(queryClient, ['leads'], lead)
      await invalidateListQueries(queryClient, ['leads'])
      handleCloseDrawer()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: leadsService.delete,
    onSuccess: async (_data, id) => {
      removeFromListCaches(queryClient, ['leads'], id)
      await invalidateListQueries(queryClient, ['leads'])
      setDeleteId(null)
    },
  })

  const handleOpenCreate = () => {
    setEditingLead(null)
    reset(defaultValues)
    setDrawerOpen(true)
  }

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead)
    reset({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      sourceId: lead.sourceId ?? '',
      budget: lead.budget,
      propertyType: lead.propertyType,
      location: lead.location,
      notes: lead.notes,
    })
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingLead(null)
    reset(defaultValues)
  }

  const onSubmit = (formData: LeadFormData) => {
    const sourceName = leadSources.find((s) => s.id === formData.sourceId)?.name ?? ''
    const payload = { ...formData, source: sourceName }
    if (editingLead) {
      updateMutation.mutate({ id: editingLead.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const rows = useMemo(() => data?.data ?? [], [data?.data])

  const summary = useMemo(() => {
    const newLeads = rows.filter((l) => l.status === 'NEW').length
    const websiteLeads = rows.filter((l) => l.source.toLowerCase() === 'website').length
    const avgBudget = rows.length
      ? Math.round(rows.reduce((sum, l) => sum + (l.budget || 0), 0) / rows.length)
      : 0
    return { total: data?.total ?? rows.length, newLeads, websiteLeads, avgBudget }
  }, [data?.total, rows])

  const openLead = useCallback(
    (lead: Lead) => navigate(`/leads/${lead.id}`),
    [navigate],
  )

  const columns = useMemo<AppTableColumn<Lead>[]>(
    () => [
      {
        id: 'leadId',
        label: 'Lead ID',
        render: (lead) => (
          <IdChip
            label={formatLeadId(lead.id)}
            variant="lead"
            onClick={() => openLead(lead)}
          />
        ),
      },
      {
        id: 'name',
        label: 'Name',
        noTruncate: true,
        headerClassName: tableStyles.cellName,
        cellClassName: `${tableStyles.cellStrong} ${tableStyles.cellName}`,
        render: (lead) => `${lead.firstName} ${lead.lastName}`,
      },
      {
        id: 'phone',
        label: 'Phone',
        noTruncate: true,
        headerClassName: tableStyles.cellPhone,
        cellClassName: tableStyles.cellPhone,
        render: (lead) => lead.phone,
      },
      {
        id: 'source',
        label: 'Source',
        hideOnTablet: true,
        hideOnMobile: true,
        cellClassName: tableStyles.cellMuted,
        render: (lead) => lead.source,
      },
      {
        id: 'budget',
        label: 'Budget',
        hideOnMobile: true,
        cellClassName: tableStyles.cellStrong,
        render: (lead) => (lead.budget ? formatCurrency(lead.budget) : '—'),
      },
      {
        id: 'location',
        label: 'City',
        hideOnTablet: true,
        hideOnMobile: true,
        render: (lead) => lead.location || '—',
      },
      {
        id: 'notes',
        label: 'Message',
        hideOnTablet: true,
        hideOnMobile: true,
        cellClassName: tableStyles.cellTruncate,
        render: (lead) => <span title={lead.notes}>{lead.notes || '—'}</span>,
      },
      {
        id: 'status',
        label: 'Status',
        noTruncate: true,
        headerClassName: tableStyles.cellStatus,
        cellClassName: tableStyles.cellStatus,
        render: (lead) => <StatusBadge status={lead.status} />,
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        cellClassName: tableStyles.cellActions,
        render: (lead) => (
          <TableRowActions
            onView={() => openLead(lead)}
            onEdit={() => handleOpenEdit(lead)}
            onDelete={() => setDeleteId(lead.id)}
          />
        ),
      },
    ],
    [openLead],
  )

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <Box>
      <PageHeader
        title="Leads"
        subtitle="Track inquiries, follow up on new leads, and manage your sales pipeline"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Leads' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Add Lead
          </Button>
        }
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }>
          Could not load leads: {getErrorMessage(error)}. Make sure the backend is running on port 3000 and you are logged in.
        </Alert>
      )}

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard title="Total Leads" value={summary.total} icon={PeopleOutlineIcon} color="#1565C0" subtitle="All leads in pipeline" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="New Leads" value={summary.newLeads} icon={FiberNewOutlinedIcon} color="#0288D1" subtitle="Awaiting first contact" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Website Leads" value={summary.websiteLeads} icon={LanguageOutlinedIcon} color="#00897B" subtitle="From public website" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Avg Budget" value={formatCurrency(summary.avgBudget)} icon={AccountBalanceWalletOutlinedIcon} color="#7B1FA2" subtitle="Per lead in view" />
        </PageSummaryItem>
      </PageSummaryGrid>

      {!isError && (
        <AppTable
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading}
          onRowClick={openLead}
          emptyMessage={search ? 'No leads match your search' : 'No leads yet — submit a form on the website or add one here'}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search leads by name, email, phone..."
        />
      )}

      <SideDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
        subtitle={editingLead ? 'Update lead details and requirements' : 'Capture a new lead into the pipeline'}
        width={560}
        footer={
          <>
            <Button onClick={handleCloseDrawer} disabled={isSaving} variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" disabled={isSaving} onClick={handleSubmit(onSubmit)}>
              {isSaving ? 'Saving...' : editingLead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <LeadFormFields
            control={control}
            leadSources={leadSources}
            propertyTypeValue={editingLead?.propertyType}
          />
        </Box>
      </SideDrawer>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
