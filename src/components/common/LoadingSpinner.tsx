import { Box, CircularProgress } from '@mui/material'

interface LoadingSpinnerProps {
  fullScreen?: boolean
  size?: number
}

export function LoadingSpinner({ fullScreen = false, size = 40 }: LoadingSpinnerProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : 200}
    >
      <CircularProgress size={size} />
    </Box>
  )
}
