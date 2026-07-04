import { useState } from 'react'
import { Alert, Box, Button, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthFooterLink } from '@/components/auth/AuthFooterLink'
import { FormTextField } from '@/components/forms/FormTextField'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { authService, organizationService } from '@/api/services'
import { useAuthStore } from '@/store/authStore'
import { useOrganizationStore } from '@/store/organizationStore'
import { applyOrganizationBranding } from '@/utils/branding'
import { getErrorMessage } from '@/api/client'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, isAuthenticated } = useAuthStore()
  const setOrganization = useOrganizationStore((state) => state.setOrganization)
  const [error, setError] = useState('')

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    // defaultValues: { email: 'admin@realestatecrm.com', password: 'Admin@123' },
    defaultValues: { email: '', password: '' },
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      setAuth(data.user, data.token)
      try {
        const organization = await organizationService.getCurrent()
        setOrganization(organization)
        applyOrganizationBranding(organization)
      } catch {
        // Organization branding is optional on first login
      }
      navigate(from, { replace: true })
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit((data) => loginMutation.mutate(data))}>
        <Box display="flex" flexDirection="column" gap={2.5}>
          <FormTextField name="email" control={control} label="Email" type="email"  />
          <FormTextField
            name="password"
            control={control}
            label="Password"
            type="password"
            showPasswordToggle
            
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Box>
      {/* <Alert severity="info" sx={{ mt: 3 }}>
        Demo credentials: admin@realestatecrm.com / Admin@123
      </Alert> */}
      <AuthFooterLink text="Don't have an account?" linkText="Sign up" to="/signup" />
    </AuthLayout>
  )
}
