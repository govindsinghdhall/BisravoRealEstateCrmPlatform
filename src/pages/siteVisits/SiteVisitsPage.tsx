import { useMemo, useState } from 'react'
import { Alert, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppTable, type AppTableColumn } from '@/components/common/AppTable'
import tableStyles from '@/components/common/AppTable.module.css'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSummaryGrid, PageSummaryItem } from '@/components/common/PageSummaryGrid'
import { SideDrawer } from '@/components/common/SideDrawer'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableRowActions } from '@/components/common/TableRowActions'
import { SiteVisitFormFields } from '@/components/siteVisits/SiteVisitFormFields'
import { siteVisitSchema, type SiteVisitFormData } from '@/schemas/siteVisit.schema'
import { getErrorMessage } from '@/api/client'
import { leadsService, propertiesService, siteVisitsService, usersService } from '@/api/services'
import {
  invalidateListQueries,
  prependToListCaches,
  removeFromListCaches,
  updateInListCaches,
} from '@/api/utils/query'
import { formatDateTime } from '@/utils/formatters'
import type { SiteVisit } from '@/types'

const defaultValues: SiteVisitFormData = {
  leadId: '',
  propertyId: '',
  agentId: '',
  scheduledAt: '',
  status: 'SCHEDULED',
  notes: '',
}

const AGENT_ROLES = new Set(['agent', 'manager', 'admin'])

export function SiteVisitsPage() {
  const queryClient = useQueryClient()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingVisit, setEditingVisit] = useState<SiteVisit | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['site-visits'],
    queryFn: () => siteVisitsService.getAll({ pageSize: 50 }),
  })

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', 'site-visit-form'],
    queryFn: () => leadsService.getAll({ pageSize: 100 }),
    enabled: drawerOpen,
  })

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', 'site-visit-form'],
    queryFn: () => propertiesService.getAll({ pageSize: 100 }),
    enabled: drawerOpen,
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', 'site-visit-form'],
    queryFn: () => usersService.getAll({ pageSize: 100 }),
    enabled: drawerOpen,
  })

  const leads = leadsData?.data ?? []
  const properties = propertiesData?.data ?? []
  const agents = (usersData?.data ?? []).filter(
    (user) => user.isActive && AGENT_ROLES.has(user.role),
  )
  const optionsLoading = leadsLoading || propertiesLoading || usersLoading

  const { control, handleSubmit, reset } = useForm<SiteVisitFormData>({
    resolver: zodResolver(siteVisitSchema),
    defaultValues,
  })

  const createMutation = useMutation({
    mutationFn: siteVisitsService.create,
    onSuccess: async (visit) => {
      prependToListCaches(queryClient, ['site-visits'], visit)
      await invalidateListQueries(queryClient, ['site-visits'])
      handleCloseDrawer()
    },
    onError: (err) => setSubmitError(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SiteVisitFormData }) =>
      siteVisitsService.update(id, data),
    onSuccess: async (visit) => {
      updateInListCaches(queryClient, ['site-visits'], visit)
      await invalidateListQueries(queryClient, ['site-visits'])
      handleCloseDrawer()
    },
    onError: (err) => setSubmitError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: siteVisitsService.delete,
    onSuccess: async (_data, id) => {
      removeFromListCaches(queryClient, ['site-visits'], id)
      await invalidateListQueries(queryClient, ['site-visits'])
      setDeleteId(null)
    },
  })

  const handleOpenCreate = () => {
    setEditingVisit(null)
    setSubmitError('')
    reset(defaultValues)
    setDrawerOpen(true)
  }

  const handleOpenEdit = (visit: SiteVisit) => {
    setEditingVisit(visit)
    setSubmitError('')
    reset({
      leadId: visit.leadId,
      propertyId: visit.propertyId,
      agentId: visit.agentId,
      scheduledAt: visit.scheduledAt.slice(0, 16),
      status: visit.status,
      notes: visit.notes,
    })
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingVisit(null)
    setSubmitError('')
    reset(defaultValues)
  }

  const onSubmit = (formData: SiteVisitFormData) => {
    setSubmitError('')
    if (editingVisit) {
      updateMutation.mutate({ id: editingVisit.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const rows = useMemo(() => data?.data ?? [], [data?.data])

  const summary = useMemo(() => {
    const scheduled = rows.filter((v) => ['SCHEDULED', 'CONFIRMED'].includes(v.status)).length
    const completed = rows.filter((v) => v.status === 'COMPLETED').length
    const cancelled = rows.filter((v) => ['CANCELLED', 'NO_SHOW'].includes(v.status)).length
    return { total: data?.total ?? rows.length, scheduled, completed, cancelled }
  }, [data?.total, rows])

  const columns = useMemo<AppTableColumn<SiteVisit>[]>(
    () => [
      {
        id: 'lead',
        label: 'Lead',
        cellClassName: tableStyles.cellStrong,
        render: (visit) => visit.leadName || '—',
      },
      {
        id: 'property',
        label: 'Property',
        hideOnMobile: true,
        cellClassName: tableStyles.cellTruncate,
        render: (visit) => <span title={visit.propertyTitle}>{visit.propertyTitle || '—'}</span>,
      },
      {
        id: 'agent',
        label: 'Agent',
        hideOnTablet: true,
        hideOnMobile: true,
        render: (visit) => visit.agentName || '—',
      },
      {
        id: 'scheduled',
        label: 'Scheduled',
        render: (visit) => formatDateTime(visit.scheduledAt),
      },
      {
        id: 'status',
        label: 'Status',
        render: (visit) => <StatusBadge status={visit.status} />,
      },
      {
        id: 'notes',
        label: 'Notes',
        hideOnTablet: true,
        hideOnMobile: true,
        cellClassName: tableStyles.cellTruncate,
        render: (visit) => <span title={visit.notes}>{visit.notes || '—'}</span>,
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        cellClassName: tableStyles.cellActions,
        render: (visit) => (
          <TableRowActions
            onEdit={() => handleOpenEdit(visit)}
            onDelete={() => setDeleteId(visit.id)}
          />
        ),
      },
    ],
    [],
  )

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <Box>
      <PageHeader
        title="Site Visits"
        subtitle="Schedule and manage property site visits"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Site Visits' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Schedule Visit
          </Button>
        }
      />

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard title="Total Visits" value={summary.total} icon={EventAvailableOutlinedIcon} color="#1565C0" subtitle="All site visits" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Scheduled" value={summary.scheduled} icon={ScheduleOutlinedIcon} color="#0288D1" subtitle="Upcoming visits" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Completed" value={summary.completed} icon={TaskAltOutlinedIcon} color="#00897B" subtitle="Successfully done" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Cancelled" value={summary.cancelled} icon={CancelOutlinedIcon} color="#D32F2F" subtitle="No-shows & cancelled" />
        </PageSummaryItem>
      </PageSummaryGrid>

      <AppTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={isLoading}
        emptyMessage="No site visits found"
      />

      <SideDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={editingVisit ? 'Edit Site Visit' : 'Schedule Site Visit'}
        subtitle="Select lead, property, and agent — IDs are filled automatically"
        width={560}
        footer={
          <>
            <Button onClick={handleCloseDrawer} variant="outlined" disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isSaving || optionsLoading || !leads.length || !properties.length || !agents.length}
              onClick={handleSubmit(onSubmit)}
            >
              {isSaving ? 'Saving...' : editingVisit ? 'Update Visit' : 'Schedule Visit'}
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <SiteVisitFormFields
            control={control}
            leads={leads}
            properties={properties}
            agents={agents}
            loading={optionsLoading}
            readOnlyParticipants={!!editingVisit}
          />
        </Box>
      </SideDrawer>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Site Visit"
        message="Are you sure you want to delete this site visit?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
