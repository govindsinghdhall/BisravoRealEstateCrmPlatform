import { Box, Card, Typography, alpha, useTheme } from '@mui/material'
import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export function SectionCard({ title, subtitle, children, action }: SectionCardProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2.5,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: isDark ? alpha('#fff', 0.02) : '#F8FAFC',
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Card>
  )
}
