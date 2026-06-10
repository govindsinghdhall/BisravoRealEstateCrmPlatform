import { Box, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { ReactNode } from 'react'

interface TableToolbarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  children?: ReactNode
  /** Full-width filter bar layout (payments-report style). */
  variant?: 'inline' | 'bar'
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  children,
  variant = 'inline',
}: TableToolbarProps) {
  const searchField = (
    <TextField
      size="small"
      placeholder={searchPlaceholder}
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      fullWidth={variant === 'bar'}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: variant === 'bar' ? '100%' : { xs: '100%', sm: 280 },
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          bgcolor: 'background.paper',
          minHeight: variant === 'bar' ? 42 : 36,
        },
      }}
    />
  )

  if (variant === 'bar') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, width: '100%' }}>
        {searchField}
        {children}
      </Box>
    )
  }

  return (
    <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="center">
      {searchField}
      {children}
    </Box>
  )
}
