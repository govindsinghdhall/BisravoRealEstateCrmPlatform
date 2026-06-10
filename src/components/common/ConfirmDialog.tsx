import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onCancel}
      slotProps={{
        backdrop: { sx: { bgcolor: alpha('#0F172A', 0.45), backdropFilter: 'blur(2px)' } },
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
          borderLeft: '1px solid',
          borderColor: 'divider',
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
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: isDark ? alpha('#DC2626', 0.16) : '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningAmberOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1} lineHeight={1.6}>
              {message}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onCancel} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1 }} />

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
        }}
      >
        <Button onClick={onCancel} disabled={loading} variant="outlined">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {confirmLabel}
        </Button>
      </Box>
    </Drawer>
  )
}
