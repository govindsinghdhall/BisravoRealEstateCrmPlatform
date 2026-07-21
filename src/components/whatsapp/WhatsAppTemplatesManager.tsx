import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/api/client'
import { whatsappService } from '@/api/services'
import type { WhatsAppTemplate, WhatsAppTemplatePayload } from '@/types'

export function WhatsAppTemplatesManager() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<WhatsAppTemplate | null>(null)
  const [form, setForm] = useState<WhatsAppTemplatePayload>({ name: '', message: '' })
  const [error, setError] = useState('')

  const { data: templates, isLoading, isError } = useQuery({
    queryKey: ['whatsapp-templates'],
    queryFn: whatsappService.getTemplates,
  })

  const createMutation = useMutation({
    mutationFn: whatsappService.createTemplate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] })
      setDialogOpen(false)
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: WhatsAppTemplatePayload }) =>
      whatsappService.updateTemplate(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] })
      setDialogOpen(false)
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => whatsappService.deleteTemplate(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] })
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  useEffect(() => {
    if (!dialogOpen) {
      setError('')
    }
  }, [dialogOpen])

  const isSaving = createMutation.isPending || updateMutation.isPending

  const handleOpenCreate = () => {
    setCurrentTemplate(null)
    setForm({ name: '', message: '' })
    setDialogOpen(true)
  }

  const handleOpenEdit = (template: WhatsAppTemplate) => {
    setCurrentTemplate(template)
    setForm({ name: template.name, message: template.message })
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  const handleSave = () => {
    setError('')
    if (!form.name.trim() || !form.message.trim()) {
      setError('A template name and message are required.')
      return
    }

    if (currentTemplate) {
      updateMutation.mutate({ id: currentTemplate.id, payload: { name: form.name.trim(), message: form.message.trim() } })
    } else {
      createMutation.mutate({ name: form.name.trim(), message: form.message.trim() })
    }
  }

  const templateCount = templates?.length ?? 0
  const activeError = error || (isError ? 'Unable to load WhatsApp templates.' : '')

  const sortedTemplates = useMemo(
    () => templates?.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [],
    [templates],
  )

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
        <Box>
          <Typography variant="h6">WhatsApp Message Templates</Typography>
          <Typography variant="body2" color="text.secondary">
            Create multiple marketing messages and reuse them for customer outreach.
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenCreate}>
          Add Template
        </Button>
      </Box>

      {activeError && <Alert severity="error" sx={{ mb: 2 }}>{activeError}</Alert>}

      <Box>
        {isLoading ? (
          <Typography color="text.secondary">Loading templates…</Typography>
        ) : templateCount === 0 ? (
          <Alert severity="info">No WhatsApp templates created yet. Add one to start sending marketing messages.</Alert>
        ) : (
          <List disablePadding>
            {sortedTemplates.map((template) => (
              <ListItem key={template.id} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 2 }}>
                <ListItemText
                  primary={template.name}
                  secondary={template.message}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(template)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteMutation.mutate(template.id)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{currentTemplate ? 'Edit Template' : 'New WhatsApp Template'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {activeError && <Alert severity="error">{activeError}</Alert>}
            <TextField
              label="Template Name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
              disabled={isSaving}
            />
            <TextField
              label="Message"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              fullWidth
              multiline
              minRows={4}
              disabled={isSaving}
              helperText="Use unique message content to reduce repetition and help avoid WhatsApp broadcast restrictions."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={isSaving}>
            {currentTemplate ? 'Save Changes' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
