import { Box, Typography } from '@mui/material'

interface TableStackCellProps {
  primary: string
  secondary?: string
  primaryHref?: boolean
  leading?: React.ReactNode
}

/** Payments-report style: blue primary line + muted secondary subtitle. */
export function TableStackCell({ primary, secondary, primaryHref, leading }: TableStackCellProps) {
  return (
    <Box
      className="crm-table-cell-content"
      sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, width: '100%' }}
    >
      {leading}
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          title={primary}
          sx={{
            letterSpacing: '-0.01em',
            lineHeight: 1.45,
            color: primaryHref ? 'primary.main' : 'text.primary',
          }}
        >
          {primary}
        </Typography>
        {secondary && (
          <Typography
            variant="caption"
            noWrap
            title={secondary}
            display="block"
            sx={{ color: 'text.secondary', lineHeight: 1.4, mt: 0.35, fontSize: '0.75rem' }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
