import { useMemo, useState } from 'react'
import { Alert, Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
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
import { BookingFormFields } from '@/components/bookings/BookingFormFields'
import { bookingSchema, type BookingFormData } from '@/schemas/booking.schema'
import { getErrorMessage } from '@/api/client'
import { bookingsService, leadsService, propertiesService } from '@/api/services'
import {
  invalidateListQueries,
  prependToListCaches,
  removeFromListCaches,
  updateInListCaches,
} from '@/api/utils/query'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { Booking } from '@/types'

const defaultValues: BookingFormData = {
  leadId: '',
  propertyId: '',
  amount: 0,
  status: 'PENDING',
  notes: '',
}

export function BookingsPage() {
  const queryClient = useQueryClient()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsService.getAll({ pageSize: 50 }),
  })

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', 'booking-form'],
    queryFn: () => leadsService.getAll({ pageSize: 100 }),
    enabled: drawerOpen,
  })

  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties', 'booking-form'],
    queryFn: () => propertiesService.getAll({ pageSize: 100 }),
    enabled: drawerOpen,
  })

  const leads = leadsData?.data ?? []
  const properties = propertiesData?.data ?? []
  const optionsLoading = leadsLoading || propertiesLoading

  const { control, handleSubmit, reset, setValue } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  })

  const createMutation = useMutation({
    mutationFn: bookingsService.create,
    onSuccess: async (booking) => {
      prependToListCaches(queryClient, ['bookings'], booking)
      await invalidateListQueries(queryClient, ['bookings'])
      handleCloseDrawer()
    },
    onError: (err) => setSubmitError(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookingFormData }) =>
      bookingsService.update(id, data),
    onSuccess: async (booking) => {
      updateInListCaches(queryClient, ['bookings'], booking)
      await invalidateListQueries(queryClient, ['bookings'])
      handleCloseDrawer()
    },
    onError: (err) => setSubmitError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: bookingsService.delete,
    onSuccess: async (_data, id) => {
      removeFromListCaches(queryClient, ['bookings'], id)
      await invalidateListQueries(queryClient, ['bookings'])
      setDeleteId(null)
    },
  })

  const handleOpenCreate = () => {
    setEditingBooking(null)
    setSubmitError('')
    reset(defaultValues)
    setDrawerOpen(true)
  }

  const handleOpenEdit = (booking: Booking) => {
    setEditingBooking(booking)
    setSubmitError('')
    reset({
      leadId: booking.leadId,
      propertyId: booking.propertyId,
      amount: booking.amount,
      status: booking.status,
      notes: booking.notes,
    })
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setEditingBooking(null)
    setSubmitError('')
    reset(defaultValues)
  }

  const onSubmit = (formData: BookingFormData) => {
    setSubmitError('')
    if (editingBooking) {
      updateMutation.mutate({ id: editingBooking.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const rows = useMemo(() => data?.data ?? [], [data?.data])

  const summary = useMemo(() => {
    const pending = rows.filter((b) => b.status === 'PENDING').length
    const confirmed = rows.filter((b) => ['CONFIRMED', 'PARTIALLY_PAID', 'FULLY_PAID'].includes(b.status)).length
    const revenue = rows.reduce((sum, b) => sum + (b.amount || 0), 0)
    return { total: data?.total ?? rows.length, pending, confirmed, revenue }
  }, [data?.total, rows])

  const columns = useMemo<AppTableColumn<Booking>[]>(
    () => [
      {
        id: 'lead',
        label: 'Lead',
        cellClassName: tableStyles.cellStrong,
        render: (booking) => booking.leadName || '—',
      },
      {
        id: 'property',
        label: 'Property',
        hideOnMobile: true,
        cellClassName: tableStyles.cellTruncate,
        render: (booking) => <span title={booking.propertyTitle}>{booking.propertyTitle || '—'}</span>,
      },
      {
        id: 'agent',
        label: 'Agent',
        hideOnTablet: true,
        hideOnMobile: true,
        render: (booking) => booking.agentName || '—',
      },
      {
        id: 'amount',
        label: 'Amount',
        cellClassName: tableStyles.cellStrong,
        render: (booking) => formatCurrency(booking.amount),
      },
      {
        id: 'status',
        label: 'Status',
        render: (booking) => <StatusBadge status={booking.status} />,
      },
      {
        id: 'date',
        label: 'Date',
        hideOnTablet: true,
        hideOnMobile: true,
        render: (booking) => formatDate(booking.bookingDate ?? ''),
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        cellClassName: tableStyles.cellActions,
        render: (booking) => (
          <TableRowActions
            onEdit={() => handleOpenEdit(booking)}
            onDelete={() => setDeleteId(booking.id)}
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
        title="Bookings"
        subtitle="Manage property bookings and reservations"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Bookings' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            New Booking
          </Button>
        }
      />

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard title="Total Bookings" value={summary.total} icon={BookOnlineOutlinedIcon} color="#1565C0" subtitle="All reservations" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Pending" value={summary.pending} icon={HourglassEmptyOutlinedIcon} color="#ED6C02" subtitle="Awaiting confirmation" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Confirmed" value={summary.confirmed} icon={CheckCircleOutlineIcon} color="#00897B" subtitle="Active bookings" />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard title="Total Value" value={formatCurrency(summary.revenue)} icon={AttachMoneyIcon} color="#2E7D32" subtitle="Booking amounts" />
        </PageSummaryItem>
      </PageSummaryGrid>

      <AppTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={isLoading}
        emptyMessage="No bookings found"
      />

      <SideDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={editingBooking ? 'Edit Booking' : 'New Booking'}
        subtitle="Select lead and property — amount auto-fills from property price"
        width={560}
        footer={
          <>
            <Button onClick={handleCloseDrawer} variant="outlined" disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isSaving || optionsLoading || !leads.length || !properties.length}
              onClick={handleSubmit(onSubmit)}
            >
              {isSaving ? 'Saving...' : editingBooking ? 'Update Booking' : 'Create Booking'}
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
          <BookingFormFields
            control={control}
            setValue={setValue}
            leads={leads}
            properties={properties}
            loading={optionsLoading}
            readOnlyLinks={!!editingBooking}
          />
        </Box>
      </SideDrawer>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        confirmLabel="Delete Booking"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        loading={deleteMutation.isPending}
      />
    </Box>
  )
}
