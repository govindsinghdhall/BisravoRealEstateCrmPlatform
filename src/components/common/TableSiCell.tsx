import { Box, Typography } from '@mui/material'

interface TableSiCellProps {
  index: number
  active?: boolean
}

export function TableSiCell({ index, active = false }: TableSiCellProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: active ? 'primary.main' : 'action.disabled',
          flexShrink: 0,
        }}
      />
      <Typography variant="body2" fontWeight={600} color="text.secondary">
        {index}
      </Typography>
    </Box>
  )
}
