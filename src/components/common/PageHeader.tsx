import { Box, Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  action?: React.ReactNode
}

export function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
      gap={2}
      mb={3}
    >
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs sx={{ mb: 1 }}>
            {breadcrumbs.map((item, index) =>
              item.href ? (
                <Link
                  key={index}
                  component={RouterLink}
                  to={item.href}
                  underline="hover"
                  color="inherit"
                  variant="body2"
                >
                  {item.label}
                </Link>
              ) : (
                <Typography key={index} color="text.primary" variant="body2">
                  {item.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  )
}
