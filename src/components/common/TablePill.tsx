import { Box, alpha, useTheme } from '@mui/material'
import { capitalize } from '@/utils/formatters'

const PILL_STYLES: Record<string, { color: string; bg: string }> = {
  AVAILABLE: { color: '#0d9488', bg: '#ccfbf1' },
  BUY: { color: '#2563eb', bg: '#dbeafe' },
  RENT: { color: '#7c3aed', bg: '#ede9fe' },
  COMMERCIAL: { color: '#b45309', bg: '#fef3c7' },
  NEW_PROJECTS: { color: '#0891b2', bg: '#cffafe' },
  PG: { color: '#db2777', bg: '#fce7f3' },
  PLOT: { color: '#65a30d', bg: '#ecfccb' },
  LUXURY: { color: '#9333ea', bg: '#f3e8ff' },
  UNDER_OFFER: { color: '#b45309', bg: '#fef3c7' },
  SOLD: { color: '#64748b', bg: '#f1f5f9' },
  RENTED: { color: '#0e7490', bg: '#cffafe' },
  OFF_MARKET: { color: '#64748b', bg: '#f1f5f9' },
  LIVE: { color: '#0d9488', bg: '#ccfbf1' },
  DRAFT: { color: '#64748b', bg: '#f1f5f9' },
}

interface TablePillProps {
  label: string
  tone?: string
}

export function TablePill({ label, tone }: TablePillProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const key = (tone ?? label).toUpperCase().replace(/\s+/g, '_')
  const style = PILL_STYLES[key] ?? { color: '#64748b', bg: '#f1f5f9' }
  const display = capitalize(label.replace(/_/g, ' ').toLowerCase())

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.55,
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        color: isDark ? alpha(style.color, 0.95) : style.color,
        bgcolor: isDark ? alpha(style.color, 0.18) : style.bg,
        border: `1px solid ${alpha(style.color, isDark ? 0.3 : 0.14)}`,
      }}
    >
      {display}
    </Box>
  )
}
