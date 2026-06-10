import { Chip } from '@mui/material'
import { capitalize } from '@/utils/formatters'

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  NEW: 'info',
  CONTACTED: 'primary',
  QUALIFIED: 'secondary',
  NEGOTIATION: 'warning',
  SITE_VISIT_SCHEDULED: 'info',
  SITE_VISIT_DONE: 'primary',
  BOOKED: 'success',
  WON: 'success',
  LOST: 'error',
  AVAILABLE: 'success',
  UNDER_OFFER: 'warning',
  SOLD: 'primary',
  RENTED: 'info',
  OFF_MARKET: 'default',
  SCHEDULED: 'info',
  CONFIRMED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'warning',
  RESCHEDULED: 'info',
  PENDING: 'warning',
  PARTIALLY_PAID: 'info',
  FULLY_PAID: 'success',
  REFUNDED: 'default',
  admin: 'error',
  manager: 'primary',
  agent: 'secondary',
  viewer: 'default',
}

interface StatusChipProps {
  status: string
  size?: 'small' | 'medium'
}

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  return (
    <Chip
      label={capitalize(status)}
      color={STATUS_COLORS[status] || STATUS_COLORS[status.toUpperCase()] || 'default'}
      size={size}
      variant="outlined"
    />
  )
}
