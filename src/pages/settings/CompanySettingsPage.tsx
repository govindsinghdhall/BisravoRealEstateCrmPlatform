import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { getErrorMessage } from '@/api/client'
import { organizationService } from '@/api/services'
import { useAuthStore } from '@/store/authStore'
import { useOrganizationStore } from '@/store/organizationStore'
import { applyOrganizationBranding, getOrganizationFavicon, getOrganizationLogo } from '@/utils/branding'
import type { Organization } from '@/types/organization'

export function CompanySettingsPage() {
  const userRole = useAuthStore((state) => state.user?.role)
  const queryClient = useQueryClient()
  const organization = useOrganizationStore((state) => state.organization)
  const setOrganization = useOrganizationStore((state) => state.setOrganization)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['organization', 'current'],
    queryFn: organizationService.getCurrent,
  })

  useEffect(() => {
    if (!data) return
    setForm({
      name: data.name,
      email: data.email ?? '',
      phone: data.phone ?? '',
      address: data.address ?? '',
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
      setSuccess('Company details saved successfully.')
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon',
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be 2 MB or smaller.')
      return
    }

    setError('')
    setSuccess('')
    const setUploading = type === 'logo' ? setUploadingLogo : setUploadingFavicon

    try {
      setUploading(true)
      const org =
        type === 'logo'
          ? await organizationService.uploadLogo(file)
          : await organizationService.uploadFavicon(file)
      await applyOrg(org)
      setSuccess(type === 'logo' ? 'Logo updated.' : 'Favicon updated.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const handleSave = () => {
    setSuccess('')
    saveMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
    })
  }

  const logoPreview = getOrganizationLogo(organization ?? data)
  const faviconPreview = getOrganizationFavicon(organization ?? data)

  return (
    <Box>
      <PageHeader
        title="Company"
        subtitle="Set your organization name, logo, and favicon used across the CRM"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Company' },
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
          Preview
        </Typography>
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Avatar
            src={logoPreview || undefined}
            variant="rounded"
            sx={{ width: 36, height: 36, bgcolor: 'action.hover' }}
          />
          <Typography variant="subtitle1" fontWeight={700}>
            {form.name || organization?.name || 'Company Name'}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Company Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
            disabled={isLoading || saveMutation.isPending}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            fullWidth
            disabled={isLoading || saveMutation.isPending}
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            fullWidth
            disabled={isLoading || saveMutation.isPending}
          />
          <TextField
            label="Address"
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
            disabled={isLoading || saveMutation.isPending}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Organization Logo
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Avatar
                src={logoPreview || undefined}
                variant="rounded"
                sx={{ width: 56, height: 56, bgcolor: 'action.hover' }}
              />
              <Button
                component="label"
                variant="outlined"
                disabled={uploadingLogo || saveMutation.isPending}
                startIcon={uploadingLogo ? <CircularProgress size={16} /> : undefined}
              >
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo')}
                />
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Saves immediately. Shown in the header and sidebar. Max 2 MB.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Favicon
            </Typography>
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Avatar
                src={faviconPreview !== '/favicon.svg' ? faviconPreview : undefined}
                variant="rounded"
                sx={{ width: 32, height: 32, bgcolor: 'action.hover' }}
              />
              <Button
                component="label"
                variant="outlined"
                disabled={uploadingFavicon || saveMutation.isPending}
                startIcon={uploadingFavicon ? <CircularProgress size={16} /> : undefined}
              >
                {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'favicon')}
                />
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Saves immediately. Shown in the browser tab. Use a square image, max 2 MB.
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading || saveMutation.isPending || !form.name.trim()}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Company Details'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
