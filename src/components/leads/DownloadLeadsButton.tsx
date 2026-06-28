import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from '@mui/material'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined'
import { leadsService } from '@/api/services'
import { useOrganizationStore } from '@/store/organizationStore'
import { getOrganizationDisplayName, getOrganizationLogo } from '@/utils/branding'
import type { LeadExportFormat, LeadExportScope } from '@/utils/leadsExport'

interface DownloadLeadsButtonProps {
  searchFilter?: string
  disabled?: boolean
}

export function DownloadLeadsButton({ searchFilter = '', disabled = false }: DownloadLeadsButtonProps) {
  const organization = useOrganizationStore((state) => state.organization)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [exporting, setExporting] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    severity: 'success' | 'error'
    message: string
  }>({ open: false, severity: 'success', message: '' })

  const menuOpen = Boolean(anchorEl)
  const hasActiveFilter = searchFilter.trim().length > 0

  const handleExport = async (scope: LeadExportScope, format: LeadExportFormat) => {
    setAnchorEl(null)
    setExporting(true)

    try {
      const params = scope === 'filtered' && hasActiveFilter ? { search: searchFilter.trim() } : undefined
      const leads = await leadsService.fetchAll(params)

      if (leads.length === 0) {
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'No leads found to export.',
        })
        return
      }

      const { exportLeadsToExcel, exportLeadsToPdf } = await import('@/utils/leadsExport')

      if (format === 'xlsx') {
        exportLeadsToExcel(leads, scope)
      } else {
        await exportLeadsToPdf(leads, {
          companyName: getOrganizationDisplayName(organization),
          logoUrl: getOrganizationLogo(organization),
          scope,
          searchFilter,
        })
      }

      const scopeLabel = scope === 'filtered' ? 'filtered' : 'all'
      const formatLabel = format === 'xlsx' ? 'Excel' : 'PDF'
      setSnackbar({
        open: true,
        severity: 'success',
        message: `Downloaded ${leads.length} ${scopeLabel} lead${leads.length === 1 ? '' : 's'} as ${formatLabel}.`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed. Please try again.'
      setSnackbar({
        open: true,
        severity: 'error',
        message,
      })
    } finally {
      setExporting(false)
    }
  }

  const renderScopeSection = (scope: LeadExportScope, title: string, subtitle: string) => (
    <Box key={scope}>
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
      <MenuItem onClick={() => handleExport(scope, 'xlsx')} disabled={exporting}>
        <ListItemIcon>
          <TableViewOutlinedIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText primary="Download as Excel (.xlsx)" />
      </MenuItem>
      <MenuItem onClick={() => handleExport(scope, 'pdf')} disabled={exporting}>
        <ListItemIcon>
          <PictureAsPdfOutlinedIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Download as PDF (.pdf)" />
      </MenuItem>
    </Box>
  )

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        disabled={disabled || exporting}
        startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <DownloadOutlinedIcon />}
        endIcon={!exporting ? <KeyboardArrowDownIcon /> : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {exporting ? 'Generating...' : 'Download Leads'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { minWidth: 300, maxWidth: 360 },
          },
        }}
      >
        {renderScopeSection('all', 'All Leads', 'Export every lead in the system')}
        <Divider />
        {renderScopeSection(
          'filtered',
          'Filtered Leads',
          hasActiveFilter
            ? `Matches current search: "${searchFilter.trim()}"`
            : 'Uses the current table search filter',
        )}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
