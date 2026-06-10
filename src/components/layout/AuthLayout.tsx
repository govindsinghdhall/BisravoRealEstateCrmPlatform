import { Box, Container, Link, Paper, Typography } from '@mui/material'
import { OrgBrand } from '@/components/common/OrgBrand'
import { POWERED_BY_LABEL, POWERED_BY_URL } from '@/utils/constants'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #E3F2FD 0%, #F4F6F8 50%, #E0F2F1 100%)'
            : 'linear-gradient(135deg, #0D1B2A 0%, #0F1419 50%, #1B2838 100%)',
        p: 2,
      }}
    >
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        <Container maxWidth="sm">
          <Box textAlign="center" mb={4}>
            <Box display="flex" justifyContent="center" mb={1}>
              <OrgBrand size="md" />
            </Box>
            <Typography variant="body1" color="text.secondary">
              Enterprise Real Estate Management
            </Typography>
          </Box>
          <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" mb={3}>
                {subtitle}
              </Typography>
            )}
            {children}
          </Paper>
        </Container>
      </Box>

      <Box textAlign="center" py={2}>
        <Typography variant="caption" color="text.secondary">
          Powered by{' '}
          <Link href={POWERED_BY_URL} target="_blank" rel="noopener noreferrer" underline="hover">
            {POWERED_BY_LABEL}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
