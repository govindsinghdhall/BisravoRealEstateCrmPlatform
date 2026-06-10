import { Box, Link, Typography } from '@mui/material'
import { POWERED_BY_LABEL, POWERED_BY_URL } from '@/utils/constants'

export function AppFooter() {
  return (
    <Box
      component="footer"
      py={1.5}
      px={3}
      textAlign="center"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Powered by{' '}
        <Link href={POWERED_BY_URL} target="_blank" rel="noopener noreferrer" underline="hover">
          {POWERED_BY_LABEL}
        </Link>
      </Typography>
    </Box>
  )
}
