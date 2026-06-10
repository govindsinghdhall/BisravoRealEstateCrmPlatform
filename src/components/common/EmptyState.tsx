import { Box, Typography, alpha, useTheme } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: SvgIconComponent
  action?: React.ReactNode
}

export function EmptyState({
  title = 'No data found',
  description = 'There are no records to display yet.',
  icon: Icon = InboxOutlinedIcon,
  action,
}: EmptyStateProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={10}
      px={3}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDark ? alpha('#fff', 0.04) : '#F8FAFC',
          border: '1px solid',
          borderColor: isDark ? alpha('#fff', 0.06) : '#E2E8F0',
          mb: 2.5,
        }}
      >
        <Icon sx={{ fontSize: 32, color: 'text.disabled' }} />
      </Box>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={360} mb={action ? 3 : 0}>
        {description}
      </Typography>
      {action}
    </Box>
  )
}
