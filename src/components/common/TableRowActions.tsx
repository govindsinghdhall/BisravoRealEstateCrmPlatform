import { Box, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import styles from './AppTable.module.css'

interface TableRowActionsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation()
}

export function TableRowActions({ onView, onEdit, onDelete }: TableRowActionsProps) {
  return (
    <Box className={styles.actions} onClick={stopPropagation}>
      {onView && (
        <Tooltip title="View">
          <IconButton size="small" onClick={onView}>
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton size="small" onClick={onEdit}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
