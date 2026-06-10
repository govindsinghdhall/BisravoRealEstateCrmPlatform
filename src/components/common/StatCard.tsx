import { Box, Card, Typography, alpha, useTheme } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface StatCardProps {
  title: string
  value: string | number
  icon: SvgIconComponent
  color?: string
  subtitle?: string
  trend?: string
}

export function StatCard({ title, value, icon: Icon, color, subtitle, trend }: StatCardProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const accentColor = color || theme.palette.primary.main

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isDark ? alpha('#fff', 0.06) : alpha(accentColor, 0.12),
        background: isDark
          ? `linear-gradient(145deg, ${alpha(accentColor, 0.08)} 0%, ${theme.palette.background.paper} 55%)`
          : `linear-gradient(145deg, ${alpha(accentColor, 0.06)} 0%, #FFFFFF 50%)`,
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.25)'
          : '0 4px 20px rgba(21, 101, 192, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.35)'
            : '0 8px 28px rgba(21, 101, 192, 0.1), 0 2px 8px rgba(0,0,0,0.06)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${accentColor}, ${alpha(accentColor, 0.5)})`,
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box flex={1} minWidth={0}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.68rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mt: 0.75,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mt={0.75}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Typography
                variant="caption"
                sx={{ color: accentColor, fontWeight: 600, mt: 0.5, display: 'block' }}
              >
                {trend}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: alpha(accentColor, isDark ? 0.18 : 0.1),
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(accentColor, 0.2)}`,
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
