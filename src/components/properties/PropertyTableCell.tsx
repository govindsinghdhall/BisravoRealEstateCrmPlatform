import { Typography } from '@mui/material'
import type { Property } from '@/types'
import { bhkLabel } from '@/utils/propertyFormHelpers'
import { capitalize } from '@/utils/formatters'

interface PropertyTableCellProps {
  property: Property
}

export function PropertyTableCell({ property }: PropertyTableCellProps) {
  const typeLabel = capitalize(String(property.type).replace(/_/g, ' ').toLowerCase())
  const location = [property.locality || property.city, property.sector].filter(Boolean).join(' · ')
  const label = location
    ? `${bhkLabel(property.bedrooms)} ${typeLabel} · ${location}`
    : `${bhkLabel(property.bedrooms)} ${typeLabel}`

  return (
    <Typography
      className="crm-table-cell-content"
      variant="body2"
      fontWeight={600}
      noWrap
      title={label}
      color="primary.main"
      sx={{ width: '100%', minWidth: 0, lineHeight: 1.45 }}
    >
      {label}
    </Typography>
  )
}
