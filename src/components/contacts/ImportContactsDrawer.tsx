import { useCallback, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SideDrawer } from '@/components/common/SideDrawer'
import { getErrorMessage } from '@/api/client'
import { contactsService } from '@/api/services'
import type {
  ContactDuplicateAction,
  ContactImportPreviewResult,
  ContactImportRowStatus,
} from '@/types'
import { downloadContactsSampleExcel } from '@/utils/contactsImportSample'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls']

interface ImportContactsDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess?: (message: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateFile(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return 'Invalid file format. Only .xlsx and .xls are supported.'
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'File exceeds maximum size of 10 MB.'
  }
  return null
}

function statusChip(status: ContactImportRowStatus) {
  const config = {
    valid: { label: 'Valid', color: 'success' as const },
    duplicate: { label: 'Duplicate', color: 'warning' as const },
    invalid: { label: 'Invalid', color: 'error' as const },
  }[status]

  return <Chip size="small" label={config.label} color={config.color} variant="outlined" />
}

function SummaryCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderTop: `3px solid ${color}`,
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
        {value}
      </Typography>
    </Paper>
  )
}

function buildSuccessMessage(created: number, updated: number, skipped: number): string {
  const parts: string[] = []
  if (created > 0) {
    parts.push(`${created} contact${created === 1 ? '' : 's'} created`)
  }
  if (updated > 0) {
    parts.push(`${updated} contact${updated === 1 ? '' : 's'} updated`)
  }
  if (skipped > 0) {
    parts.push(`${skipped} record${skipped === 1 ? '' : 's'} skipped`)
  }
  if (!parts.length) return 'No contacts were imported.'
  return parts.join('. ') + '.'
}

export function ImportContactsDrawer({ open, onClose, onSuccess }: ImportContactsDrawerProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ContactImportPreviewResult | null>(null)
  const [duplicateAction, setDuplicateAction] = useState<ContactDuplicateAction>('skip')
  const [dragActive, setDragActive] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    severity: 'success' | 'error'
    message: string
  }>({ open: false, severity: 'success', message: '' })

  const resetState = useCallback(() => {
    setFile(null)
    setFileError(null)
    setPreview(null)
    setDuplicateAction('skip')
    setDragActive(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleClose = useCallback(() => {
    resetState()
    onClose()
  }, [onClose, resetState])

  const previewMutation = useMutation({
    mutationFn: contactsService.importPreview,
    onSuccess: (result) => {
      setPreview(result)
      setFileError(null)
    },
    onError: (error) => {
      setPreview(null)
      setFileError(getErrorMessage(error))
    },
  })

  const importMutation = useMutation({
    mutationFn: ({ uploadFile, action }: { uploadFile: File; action: ContactDuplicateAction }) =>
      contactsService.import(uploadFile, action),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
      const message = buildSuccessMessage(result.created, result.updated, result.skipped)
      onSuccess?.(message)
      handleClose()
    },
    onError: (error) => {
      setSnackbar({ open: true, severity: 'error', message: getErrorMessage(error) })
    },
  })

  const processFile = useCallback(
    (selected: File) => {
      const validationError = validateFile(selected)
      if (validationError) {
        setFile(null)
        setPreview(null)
        setFileError(validationError)
        return
      }

      setFile(selected)
      setFileError(null)
      setPreview(null)
      previewMutation.mutate(selected)
    },
    [previewMutation],
  )

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (selected) processFile(selected)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
    const selected = event.dataTransfer.files?.[0]
    if (selected) processFile(selected)
  }

  const handleRemoveFile = () => {
    resetState()
  }

  const isBusy = previewMutation.isPending || importMutation.isPending
  const canImport = !!file && !!preview && preview.validRows + preview.duplicateRows > 0

  return (
    <>
      <SideDrawer
        open={open}
        onClose={handleClose}
        title="Import Contacts"
        subtitle="Upload an Excel file to bulk add contacts"
        width={600}
        footer={
          <>
            <Button onClick={handleClose} variant="outlined" disabled={isBusy}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!canImport || isBusy}
              onClick={() => {
                if (!file) return
                importMutation.mutate({ uploadFile: file, action: duplicateAction })
              }}
            >
              {importMutation.isPending ? 'Importing...' : 'Import Contacts'}
            </Button>
          </>
        }
      >
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Download Sample Excel
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Use the sample file format. First Name and Phone are required columns.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              onClick={downloadContactsSampleExcel}
            >
              Download Sample Excel
            </Button>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              Upload Excel File
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Supports .xlsx and .xls up to 10 MB and 10,000 rows.
            </Typography>

            {!file ? (
              <Paper
                variant="outlined"
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderColor: dragActive ? 'primary.main' : 'divider',
                  bgcolor: (theme) =>
                    dragActive
                      ? alpha(theme.palette.primary.main, 0.06)
                      : alpha(theme.palette.action.hover, 0.04),
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUploadOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body1" fontWeight={600}>
                  Drag & drop your Excel file here
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5} mb={2}>
                  or browse from your computer
                </Typography>
                <Button
                  variant="contained"
                  onClick={(event) => {
                    event.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Browse File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".xlsx,.xls"
                  onChange={handleFileInput}
                />
              </Paper>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <InsertDriveFileOutlinedIcon color="primary" />
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
                {previewMutation.isPending ? (
                  <CircularProgress size={22} />
                ) : (
                  <IconButton size="small" onClick={handleRemoveFile} aria-label="Remove file">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            )}

            {fileError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fileError}
              </Alert>
            )}
          </Box>

          {preview && (
            <>
              <Divider />

              <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }} gap={1.5}>
                <SummaryCard title="Total Rows" value={preview.totalRows} color="#1565C0" />
                <SummaryCard title="Valid Rows" value={preview.validRows} color="#00897B" />
                <SummaryCard title="Duplicate Rows" value={preview.duplicateRows} color="#ED6C02" />
                <SummaryCard title="Invalid Rows" value={preview.invalidRows} color="#D32F2F" />
              </Box>

              {preview.duplicateRows > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Duplicate Handling
                  </Typography>
                  <RadioGroup
                    value={duplicateAction}
                    onChange={(event) =>
                      setDuplicateAction(event.target.value as ContactDuplicateAction)
                    }
                  >
                    <FormControlLabel value="skip" control={<Radio size="small" />} label="Skip Duplicates" />
                    <FormControlLabel
                      value="update"
                      control={<Radio size="small" />}
                      label="Update Existing Contacts"
                    />
                  </RadioGroup>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  Preview
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 320 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Row</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preview.rows.map((row) => (
                        <TableRow key={row.row} hover>
                          <TableCell>{row.row}</TableCell>
                          <TableCell>{row.firstName || '—'}</TableCell>
                          <TableCell>{row.phone || '—'}</TableCell>
                          <TableCell>{row.email || '—'}</TableCell>
                          <TableCell>{row.city || '—'}</TableCell>
                          <TableCell>{statusChip(row.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}
        </Box>
      </SideDrawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
