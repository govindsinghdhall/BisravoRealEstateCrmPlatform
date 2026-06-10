import { Box, Button } from '@mui/material'

export interface TableFilterPill {
  id: string
  label: string
  count?: number
  color?: string
}

interface TableFilterPillsProps {
  pills: TableFilterPill[]
  activeId: string
  onChange: (id: string) => void
}

export function TableFilterPills({ pills, activeId, onChange }: TableFilterPillsProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {pills.map((pill) => {
        const active = pill.id === activeId
        const accent = pill.color ?? '#64748b'
        return (
          <Button
            key={pill.id}
            size="small"
            variant={active ? 'contained' : 'outlined'}
            onClick={() => onChange(pill.id)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              borderRadius: '10px',
              px: 1.75,
              py: 0.65,
              minHeight: 34,
              borderColor: active ? accent : '#e2e8f0',
              color: active ? '#fff' : accent,
              bgcolor: active ? accent : '#fff',
              boxShadow: active ? `0 2px 8px ${accent}33` : 'none',
              '&:hover': {
                bgcolor: active ? accent : '#f8fafc',
                borderColor: accent,
              },
            }}
          >
            {pill.label}
            {pill.count !== undefined && ` (${pill.count.toLocaleString()})`}
          </Button>
        )
      })}
    </Box>
  )
}
