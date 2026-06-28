import { useState } from 'react'
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'

interface AddContactsButtonProps {
  onImport: () => void
}

export function AddContactsButton({ onImport }: AddContactsButtonProps) {
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
        <MenuItem disabled>
          <ListItemIcon>
            <PersonAddOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Add Contact Manually"
            secondary={
              <Typography variant="caption" color="text.secondary">
                Coming Soon
              </Typography>
            }
          />
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
