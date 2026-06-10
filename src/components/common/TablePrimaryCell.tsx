import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface TablePrimaryCellProps {
  primary: string
  secondary?: string
  leading?: ReactNode
}

/** Bolt-style two-line table cell — primary label + muted metadata, ellipsis-safe. */
export function TablePrimaryCell({ primary, secondary, leading }: TablePrimaryCellProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        minWidth: 0,
        width: '100%',
        py: 0.25,
      }}
    >
      {leading}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          title={primary}
          sx={{ letterSpacing: '-0.01em', lineHeight: 1.35 }}
        >
          {primary}
        </Typography>
        {secondary && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            title={secondary}
            display="block"
            sx={{ lineHeight: 1.3, mt: 0.15 }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
