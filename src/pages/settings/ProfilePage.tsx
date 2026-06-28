import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { FormTextField } from '@/components/forms/FormTextField'
import { getErrorMessage } from '@/api/client'
import { authService } from '@/api/services'
import { profileSchema, type ProfileFormData } from '@/schemas/profile.schema'
import { useAuthStore } from '@/store/authStore'
import { formatDate } from '@/utils/formatters'

export function ProfilePage() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: authService.getMe,
  })

  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
  })

  useEffect(() => {
    if (!profile) return
    reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone ?? '',
      password: '',
    })
  }, [profile, reset])

  const saveMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: async (updatedUser) => {
      setUser(updatedUser)
      await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
      reset({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone ?? '',
        password: '',
      })
      setSuccess('Profile updated successfully.')
      setError('')
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  const onSubmit = (data: ProfileFormData) => {
    setSuccess('')
    saveMutation.mutate({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      password: data.password?.trim() || undefined,
    })
  }

  const displayUser = profile ?? user
  const initials = `${displayUser?.firstName?.[0] ?? ''}${displayUser?.lastName?.[0] ?? ''}`

  return (
    <Box>
      <PageHeader
        title="Profile"
        subtitle="View and update your account details"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Profile' },
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
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.primary.main,
              fontSize: 22,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {displayUser?.firstName} {displayUser?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {displayUser?.email}
            </Typography>
            <Chip label={displayUser?.role} size="small" color="primary" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
            <FormTextField
              name="firstName"
              control={control}
              label="First Name"
              disabled={isLoading || saveMutation.isPending}
            />
            <FormTextField
              name="lastName"
              control={control}
              label="Last Name"
              disabled={isLoading || saveMutation.isPending}
            />
          </Box>

          <FormTextField
            name="email"
            control={control}
            label="Email"
            type="email"
            disabled={isLoading || saveMutation.isPending}
          />

          <FormTextField
            name="phone"
            control={control}
            label="Phone"
            disabled={isLoading || saveMutation.isPending}
          />

          <TextField
            label="Role"
            value={displayUser?.role ?? ''}
            fullWidth
            disabled
            helperText="Contact an admin to change your role"
          />

          {displayUser?.createdAt && (
            <TextField
              label="Member Since"
              value={formatDate(displayUser.createdAt)}
              fullWidth
              disabled
            />
          )}

          <Divider />

          <Typography variant="subtitle2">Change Password</Typography>
          <Box>
            <FormTextField
              name="password"
              control={control}
              label="New Password"
              type="password"
              disabled={isLoading || saveMutation.isPending}
            />
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              Leave blank to keep your current password
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
