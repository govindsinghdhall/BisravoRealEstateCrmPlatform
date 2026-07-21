import { useState } from 'react'
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'

interface AddContactsButtonProps {
  onImport: () => void
  onCreate?: () => void
}

export function AddContactsButton({ onImport, onCreate }: AddContactsButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Add Contacts
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
          <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onCreate?.()
          }}
          disabled={!onCreate}
        >
          <ListItemIcon>
            <PersonAddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add Contact Manually" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onImport()
          }}
        >
          <ListItemIcon>
            <UploadFileOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Import Contacts via Excel" />
        </MenuItem>
      </Menu>
    </>
  )
}
