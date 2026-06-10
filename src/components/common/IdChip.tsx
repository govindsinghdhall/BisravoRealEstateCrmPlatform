import { Box, alpha, useTheme } from '@mui/material'

interface IdChipProps {
  label: string
  variant?: 'lead' | 'contact'
  onClick?: () => void
}

const VARIANT_COLORS = {
  lead: { color: '#1565C0', bg: '#E3F2FD' },
  contact: { color: '#00897B', bg: '#E0F2F1' },
}

export function IdChip({ label, variant = 'lead', onClick }: IdChipProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const style = VARIANT_COLORS[variant]

  return (
    <Box
      component={onClick ? 'button' : 'span'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        px: 1,
        py: 0.35,
        borderRadius: '6px',
        color: isDark ? alpha(style.color, 0.95) : style.color,
        bgcolor: isDark ? alpha(style.color, 0.14) : style.bg,
        border: `1px solid ${alpha(style.color, isDark ? 0.3 : 0.18)}`,
        whiteSpace: 'nowrap',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        ...(onClick && {
          '&:hover': {
            bgcolor: isDark ? alpha(style.color, 0.22) : alpha(style.color, 0.12),
            borderColor: alpha(style.color, 0.45),
          },
        }),
      }}
    >
      {label}
    </Box>
  )
}
