import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { getErrorMessage } from '@/api/client'
import { organizationService } from '@/api/services'
import { WhatsAppTemplatesManager } from '@/components/whatsapp/WhatsAppTemplatesManager'
import { useAuthStore } from '@/store/authStore'
import { useOrganizationStore } from '@/store/organizationStore'
import { applyOrganizationBranding, getOrganizationLogo } from '@/utils/branding'
import type { Organization } from '@/types/organization'

export function MarketingPage() {
  const userRole = useAuthStore((state) => state.user?.role)
  const queryClient = useQueryClient()
  const organization = useOrganizationStore((state) => state.organization)
  const setOrganization = useOrganizationStore((state) => state.setOrganization)
  const [form, setForm] = useState({
    whatsappBusinessPhone: '',
    whatsappBusinessId: '',
    whatsappDisplayName: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['organization', 'current'],
    queryFn: organizationService.getCurrent,
  })

  useEffect(() => {
    if (!data) return

    setForm({
      whatsappBusinessPhone: data.settings?.whatsapp?.businessPhone ?? '',
      whatsappBusinessId: data.settings?.whatsapp?.businessId ?? '',
      whatsappDisplayName: data.settings?.whatsapp?.displayName ?? '',
    })
  }, [data])

  const applyOrg = async (org: Organization) => {
    setOrganization(org)
    applyOrganizationBranding(org)
    await queryClient.invalidateQueries({ queryKey: ['organization', 'current'] })
  }

  const saveMutation = useMutation({
    mutationFn: organizationService.updateCurrent,
    onSuccess: async (org) => {
      await applyOrg(org)
      setSuccess('Marketing settings saved successfully.')
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const handleSave = () => {
    setSuccess('')
    saveMutation.mutate({
      settings: {
        ...data?.settings,
        whatsapp: {
          businessPhone: form.whatsappBusinessPhone.trim() || undefined,
          businessId: form.whatsappBusinessId.trim() || undefined,
          displayName: form.whatsappDisplayName.trim() || undefined,
        },
      },
    })
  }

  const logoPreview = getOrganizationLogo(organization ?? data)

  return (
    <Box>
      <PageHeader
        title="Marketing"
        subtitle="Manage WhatsApp marketing settings, templates, and future broadcast workflows"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Bookings', href: '/bookings' },
          { label: 'Marketing' },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, maxWidth: 720 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          WhatsApp Business Configuration
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Business Phone"
            value={form.whatsappBusinessPhone}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsappBusinessPhone: e.target.value }))}
            fullWidth
            disabled={isLoading || saveMutation.isPending}
            helperText="The phone number registered with your WhatsApp Business API account."
          />
          <TextField
            label="Business ID"
            value={form.whatsappBusinessId}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsappBusinessId: e.target.value }))}
            fullWidth
            disabled={isLoading || saveMutation.isPending}
            helperText="Your WhatsApp Business API account ID or provider ID."
          />
          <TextField
            label="Display Name"
            value={form.whatsappDisplayName}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsappDisplayName: e.target.value }))}
            fullWidth
            disabled={isLoading || saveMutation.isPending}
            helperText="The business display name shown in WhatsApp messages."
          />

          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1.5}>
              <img
                src={logoPreview || undefined}
                alt="Organization logo"
                style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8, background: '#F5F5F5' }}
              />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  Marketing branding preview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Logo and favicon are managed on the Company page.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save WhatsApp Settings'}
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <WhatsAppTemplatesManager />
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
