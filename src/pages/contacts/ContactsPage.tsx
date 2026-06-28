import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Snackbar } from '@mui/material'
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import { useQuery } from '@tanstack/react-query'
import { AppTable, type AppTableColumn } from '@/components/common/AppTable'
import tableStyles from '@/components/common/AppTable.module.css'
import { IdChip } from '@/components/common/IdChip'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSummaryGrid, PageSummaryItem } from '@/components/common/PageSummaryGrid'
import { StatCard } from '@/components/common/StatCard'
import { TableRowActions } from '@/components/common/TableRowActions'
import { AddContactsButton } from '@/components/contacts/AddContactsButton'
import { ImportContactsDrawer } from '@/components/contacts/ImportContactsDrawer'
import { getErrorMessage } from '@/api/client'
import { contactsService } from '@/api/services'
import { useAuthStore } from '@/store/authStore'
import { formatContactRecordId, formatDateTime } from '@/utils/formatters'
import type { Contact } from '@/types'

export function ContactsPage() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [search, setSearch] = useState('')
  const [importDrawerOpen, setImportDrawerOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['contacts', search],
    queryFn: () => contactsService.getAll({ search, pageSize: 50 }),
    enabled: !!accessToken,
  })

  const rows = useMemo(() => data?.data ?? [], [data?.data])

  const summary = useMemo(() => {
    const withEmail = rows.filter((contact) => contact.email).length
    const withLeads = rows.filter((contact) => (contact.leadsCount ?? 0) > 0).length
    const totalLeads = rows.reduce((sum, contact) => sum + (contact.leadsCount ?? 0), 0)
    return {
      total: data?.total ?? rows.length,
      withEmail,
      withLeads,
      totalLeads,
    }
  }, [data?.total, rows])

  const openContact = useCallback(
    (contact: Contact) => navigate(`/contacts/${contact.id}`),
    [navigate],
  )

  const columns = useMemo<AppTableColumn<Contact>[]>(
    () => [
      {
        id: 'contactId',
        label: 'Contact ID',
        render: (contact) => (
          <IdChip
            label={formatContactRecordId(contact.id)}
            variant="contact"
            onClick={() => openContact(contact)}
          />
        ),
      },
      {
        id: 'name',
        label: 'Name',
        noTruncate: true,
        headerClassName: tableStyles.cellName,
        cellClassName: `${tableStyles.cellStrong} ${tableStyles.cellName}`,
        render: (contact) => `${contact.firstName} ${contact.lastName}`,
      },
      {
        id: 'phone',
        label: 'Phone',
        noTruncate: true,
        headerClassName: tableStyles.cellPhone,
        cellClassName: tableStyles.cellPhone,
        render: (contact) => contact.phone,
      },
      {
        id: 'email',
        label: 'Email',
        hideOnMobile: true,
        cellClassName: tableStyles.cellMuted,
        render: (contact) => contact.email || '—',
      },
      {
        id: 'city',
        label: 'City',
        hideOnTablet: true,
        hideOnMobile: true,
        render: (contact) => contact.city || '—',
      },
      {
        id: 'source',
        label: 'Source',
        hideOnTablet: true,
        hideOnMobile: true,
        render: (contact) => contact.source || '—',
      },
      {
        id: 'leads',
        label: 'Leads',
        align: 'right',
        render: (contact) => contact.leadsCount ?? 0,
      },
      {
        id: 'updated',
        label: 'Last Updated',
        hideOnTablet: true,
        hideOnMobile: true,
        cellClassName: tableStyles.cellMuted,
        render: (contact) => formatDateTime(contact.updatedAt),
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        noTruncate: true,
        cellClassName: tableStyles.cellActions,
        render: (contact) => (
          <TableRowActions onView={() => openContact(contact)} />
        ),
      },
    ],
    [openContact],
  )

  return (
    <Box>
      <PageHeader
        title="Contacts"
        subtitle="Centralized people records — one contact can have many leads over time"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Contacts' }]}
      />

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button color="inherit" size="small" onClick={() => refetch()}>Retry</Button>}
        >
          Could not load contacts: {getErrorMessage(error)}
        </Alert>
      )}

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard
            title="Total Contacts"
            value={summary.total}
            icon={ContactsOutlinedIcon}
            color="#00897B"
            subtitle="Unique people in CRM"
          />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard
            title="With Email"
            value={summary.withEmail}
            icon={PersonOutlineIcon}
            color="#1565C0"
            subtitle="Reachable by email"
          />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard
            title="Active Contacts"
            value={summary.withLeads}
            icon={PhoneOutlinedIcon}
            color="#7B1FA2"
            subtitle="Have at least one lead"
          />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard
            title="Linked Leads"
            value={summary.totalLeads}
            icon={HistoryOutlinedIcon}
            color="#0288D1"
            subtitle="Inquiries in current view"
          />
        </PageSummaryItem>
      </PageSummaryGrid>

      {!isError && (
        <AppTable
          rows={rows}
          columns={columns}
          getRowId={(row) => String(row.id)}
          loading={isLoading}
          onRowClick={openContact}
          emptyMessage={search ? 'No contacts match your search' : 'No contacts yet — they are created automatically when leads are added'}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search contacts by name, email, phone, city..."
          toolbarExtra={<AddContactsButton onImport={() => setImportDrawerOpen(true)} />}
        />
      )}

      <ImportContactsDrawer
        open={importDrawerOpen}
        onClose={() => setImportDrawerOpen(false)}
        onSuccess={setSuccessMessage}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)} variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
