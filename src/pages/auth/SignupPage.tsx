import { useState } from 'react'
import { Alert, Box, Button, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthFooterLink } from '@/components/auth/AuthFooterLink'
import { FormTextField } from '@/components/forms/FormTextField'
import { signupSchema, type SignupFormData } from '@/schemas/auth.schema'
import { authService } from '@/api/services'
import { useAuthStore } from '@/store/authStore'
import { getErrorMessage } from '@/api/client'

const defaultValues: SignupFormData = {
  organizationName: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export function SignupPage() {
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuthStore()
  const [error, setError] = useState('')

  const { control, handleSubmit } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  })

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormData) => {
      const { confirmPassword: _, ...credentials } = data
      return authService.register(credentials)
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/dashboard', { replace: true })
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to start managing your real estate business"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit((data) => signupMutation.mutate(data))}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormTextField name="organizationName" control={control} label="Organization Name" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormTextField name="firstName" control={control} label="First Name" required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormTextField name="lastName" control={control} label="Last Name" required />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextField name="email" control={control} label="Email" type="email" required />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextField name="phone" control={control} label="Phone (optional)" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormTextField
              name="password"
              control={control}
              label="Password"
              type="password"
              showPasswordToggle
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormTextField
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              type="password"
              showPasswordToggle
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={signupMutation.isPending}
              sx={{ mt: 1 }}
            >
              {signupMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <AuthFooterLink text="Already have an account?" linkText="Sign in" to="/login" />
    </AuthLayout>
  )
}
