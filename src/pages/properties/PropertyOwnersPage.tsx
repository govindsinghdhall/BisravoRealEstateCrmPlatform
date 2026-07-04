import { useMemo, useState } from 'react'
import { Alert, Box, Button, Chip, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { useQuery } from '@tanstack/react-query'
import { AppTable, type AppTableColumn } from '@/components/common/AppTable'
import tableStyles from './PropertyOwnersTable.module.css'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSummaryGrid, PageSummaryItem } from '@/components/common/PageSummaryGrid'
import { StatCard } from '@/components/common/StatCard'
import { TablePill } from '@/components/common/TablePill'
import { getErrorMessage } from '@/api/client'
import { propertiesService } from '@/api/services'
import { useAuthStore } from '@/store/authStore'
import { bhkLabel } from '@/utils/propertyFormHelpers'
import { capitalize, formatCurrency } from '@/utils/formatters'
import type { PropertyWithOwner } from '@/types'

function propertyLabel(property: PropertyWithOwner) {
  const typeLabel = capitalize(String(property.type).replace(/_/g, ' ').toLowerCase())
  const location = [property.locality || property.city, property.sector].filter(Boolean).join(' · ')
  return location
    ? `${bhkLabel(property.bedrooms ?? 0)} ${typeLabel} · ${location}`
    : `${bhkLabel(property.bedrooms ?? 0)} ${typeLabel}`
}

export function PropertyOwnersPage() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['property-owners', search],
    queryFn: () => propertiesService.getOwners({ search, pageSize: 100 }),
    enabled: !!accessToken,
  })

  const rows = useMemo(() => data?.data ?? [], [data?.data])

  const summary = useMemo(() => {
    const withOwner = rows.filter((row) => row.ownerName || row.ownerPhone || row.ownerEmail).length
    const available = rows.filter((row) => row.status === 'AVAILABLE').length
    return { total: data?.total ?? rows.length, withOwner, available }
  }, [data?.total, rows])

  const columns = useMemo<AppTableColumn<PropertyWithOwner>[]>(
    () => [
      {
        id: 'property',
        label: 'Property',
        noTruncate: true,
        colClassName: tableStyles.colProperty,
        headerClassName: tableStyles.cellProperty,
        cellClassName: tableStyles.cellProperty,
        render: (property) => (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap title={property.title || propertyLabel(property)}>
              {property.title || propertyLabel(property)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap title={propertyLabel(property)}>
              {propertyLabel(property)}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'price',
        label: 'Price',
        colClassName: tableStyles.colPrice,
        headerClassName: tableStyles.cellPrice,
        cellClassName: `${tableStyles.cellPrice} ${tableStyles.cellStrong}`,
        render: (property) => formatCurrency(property.price ?? 0),
      },
      {
        id: 'status',
        label: 'Status',
        colClassName: tableStyles.colStatus,
        headerClassName: tableStyles.cellStatus,
        cellClassName: tableStyles.cellStatus,
        render: (property) => <TablePill label={property.status} />,
      },
      {
        id: 'ownerName',
        label: 'Owner Name',
        colClassName: tableStyles.colOwnerName,
        headerClassName: tableStyles.cellName,
        cellClassName: `${tableStyles.cellName} ${tableStyles.cellStrong}`,
        render: (property) => property.ownerName || '—',
      },
      {
        id: 'ownerPhone',
        label: 'Owner Phone',
        colClassName: tableStyles.colOwnerPhone,
        headerClassName: tableStyles.cellPhone,
        cellClassName: tableStyles.cellPhone,
        hideOnMobile: true,
        render: (property) => property.ownerPhone || '—',
      },
      {
        id: 'ownerEmail',
        label: 'Owner Email',
        colClassName: tableStyles.colOwnerEmail,
        cellClassName: tableStyles.cellMuted,
        hideOnTablet: true,
        hideOnMobile: true,
        render: (property) => property.ownerEmail || '—',
      },
      {
        id: 'ownerAddress',
        label: 'Owner Address',
        colClassName: tableStyles.colOwnerAddress,
        cellClassName: tableStyles.cellMuted,
        hideOnTablet: true,
        hideOnMobile: true,
        render: (property) => property.ownerAddress || '—',
      },
      {
        id: 'ownerNotes',
        label: 'Notes',
        colClassName: tableStyles.colOwnerNotes,
        cellClassName: tableStyles.cellMuted,
        hideOnTablet: true,
        hideOnMobile: true,
        render: (property) => property.ownerNotes || '—',
      },
    ],
    [],
  )

  return (
    <Box>
      <PageHeader
        title="Property Owners"
        subtitle="Internal owner records linked to listings — not shown on the public website"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Properties', href: '/properties' },
          { label: 'Owners' },
        ]}
        action={
          <Chip
            icon={<LockOutlinedIcon />}
            label="CRM only"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        }
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button onClick={() => refetch()}>Retry</Button>}>
          {getErrorMessage(error)}
        </Alert>
      )}

      <PageSummaryGrid>
        <PageSummaryItem>
          <StatCard
            title="Total Properties"
            value={summary.total}
            icon={HomeWorkOutlinedIcon}
            color="#1565C0"
          />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard
            title="With Owner Info"
            value={summary.withOwner}
            icon={PersonOutlineIcon}
            color="#2E7D32"
          />
        </PageSummaryItem>
        <PageSummaryItem>
          <StatCard
            title="Available Listings"
            value={summary.available}
            icon={HomeWorkOutlinedIcon}
            color="#6A1B9A"
          />
        </PageSummaryItem>
      </PageSummaryGrid>

      {!isError && (
        <AppTable
          columns={columns}
          rows={rows}
          getRowId={(row) => String(row.id)}
          tableClassName={tableStyles.table}
          loading={isLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search property, owner name, phone, email..."
          emptyMessage={
            search
              ? 'No properties match your search'
              : 'No properties found — add owner details when editing a property'
          }
        />
      )}
    </Box>
  )
}
