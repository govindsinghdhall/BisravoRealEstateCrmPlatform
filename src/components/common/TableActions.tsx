import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

interface TableActionsProps {
  onView?: () => void
  onEdit: () => void
  onDelete: () => void
}

function stopRowClick(e: React.MouseEvent) {
  e.stopPropagation()
}

export function TableActions({ onView, onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="table-actions">
      {onView && (
        <button
          type="button"
          className="table-action-btn"
          onClick={(e) => {
            stopRowClick(e)
            onView()
          }}
          aria-label="View"
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
      )}
      <button
        type="button"
        className="table-action-btn"
        onClick={(e) => {
          stopRowClick(e)
          onEdit()
        }}
        aria-label="Edit"
      >
        <EditOutlinedIcon sx={{ fontSize: 16 }} />
      </button>
      <button
        type="button"
        className="table-action-btn table-action-btn--danger"
        onClick={(e) => {
          stopRowClick(e)
          onDelete()
        }}
        aria-label="Delete"
      >
        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
      </button>
    </div>
  )
}
