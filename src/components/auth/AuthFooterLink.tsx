import { Box, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface AuthFooterLinkProps {
  text: string
  linkText: string
  to: string
}

export function AuthFooterLink({ text, linkText, to }: AuthFooterLinkProps) {
  return (
    <Box textAlign="center" mt={3}>
      <Typography variant="body2" color="text.secondary" component="span">
        {text}{' '}
      </Typography>
      <Link component={RouterLink} to={to} underline="hover" fontWeight={600}>
        {linkText}
      </Link>
    </Box>
  )
}
