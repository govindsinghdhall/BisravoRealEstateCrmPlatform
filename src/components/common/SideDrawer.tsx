import {
  Box,
  Drawer,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { ReactNode } from 'react'

interface SideDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: number
}

export function SideDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 520,
}: SideDrawerProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { bgcolor: alpha('#0F172A', 0.45), backdropFilter: 'blur(2px)' } },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: width },
          maxWidth: '100vw',
          borderLeft: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: isDark ? alpha('#1565C0', 0.08) : '#F8FAFC',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.12em' }}>
            Form
          </Typography>
          <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em" lineHeight={1.2}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Close" sx={{ mt: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>{children}</Box>

      {footer && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: isDark ? alpha('#fff', 0.02) : '#FAFBFC',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          {footer}
        </Box>
      )}
    </Drawer>
  )
}
