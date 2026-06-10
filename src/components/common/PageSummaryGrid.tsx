import Grid from '@mui/material/Grid2'
import type { ReactNode } from 'react'

interface PageSummaryGridProps {
  children: ReactNode
}

export function PageSummaryGrid({ children }: PageSummaryGridProps) {
  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {children}
    </Grid>
  )
}

interface PageSummaryItemProps {
  children: ReactNode
  size?: { xs?: number; sm?: number; md?: number; lg?: number }
}

export function PageSummaryItem({
  children,
  size = { xs: 12, sm: 6, md: 3 },
}: PageSummaryItemProps) {
  return <Grid size={size}>{children}</Grid>
}
