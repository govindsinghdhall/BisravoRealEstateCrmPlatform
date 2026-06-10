import { Box, alpha, useTheme } from '@mui/material'
import { capitalize } from '@/utils/formatters'

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  NEW: { color: '#0369a1', bg: '#e0f2fe' },
  CONTACTED: { color: '#1d4ed8', bg: '#dbeafe' },
  QUALIFIED: { color: '#6d28d9', bg: '#ede9fe' },
  NEGOTIATION: { color: '#b45309', bg: '#fef3c7' },
  SITE_VISIT_SCHEDULED: { color: '#0e7490', bg: '#cffafe' },
  SITE_VISIT_DONE: { color: '#1d4ed8', bg: '#dbeafe' },
  BOOKED: { color: '#047857', bg: '#d1fae5' },
  WON: { color: '#047857', bg: '#d1fae5' },
  LOST: { color: '#b91c1c', bg: '#fee2e2' },
  AVAILABLE: { color: '#047857', bg: '#d1fae5' },
  UNDER_OFFER: { color: '#b45309', bg: '#fef3c7' },
  SOLD: { color: '#1d4ed8', bg: '#dbeafe' },
  RENTED: { color: '#0e7490', bg: '#cffafe' },
  OFF_MARKET: { color: '#64748b', bg: '#f1f5f9' },
  SCHEDULED: { color: '#0e7490', bg: '#cffafe' },
  CONFIRMED: { color: '#1d4ed8', bg: '#dbeafe' },
  COMPLETED: { color: '#047857', bg: '#d1fae5' },
  CANCELLED: { color: '#b91c1c', bg: '#fee2e2' },
  NO_SHOW: { color: '#b45309', bg: '#fef3c7' },
  RESCHEDULED: { color: '#6d28d9', bg: '#ede9fe' },
  PENDING: { color: '#b45309', bg: '#fef3c7' },
  PARTIALLY_PAID: { color: '#0e7490', bg: '#cffafe' },
  FULLY_PAID: { color: '#047857', bg: '#d1fae5' },
  REFUNDED: { color: '#64748b', bg: '#f1f5f9' },
  admin: { color: '#b91c1c', bg: '#fee2e2' },
  manager: { color: '#1d4ed8', bg: '#dbeafe' },
  agent: { color: '#6d28d9', bg: '#ede9fe' },
  viewer: { color: '#64748b', bg: '#f1f5f9' },
  available: { color: '#047857', bg: '#d1fae5' },
  cancelled: { color: '#b91c1c', bg: '#fee2e2' },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const key = status in STATUS_STYLES ? status : status.toUpperCase()
  const style = STATUS_STYLES[key] ?? { color: '#64748b', bg: '#f1f5f9' }
  const label = capitalize(status)

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.45,
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        color: isDark ? alpha(style.color, 0.95) : style.color,
        bgcolor: isDark ? alpha(style.color, 0.16) : style.bg,
        border: `1px solid ${alpha(style.color, isDark ? 0.28 : 0.12)}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: style.color,
          flexShrink: 0,
        }}
      />
      {label}
    </Box>
  )
}
