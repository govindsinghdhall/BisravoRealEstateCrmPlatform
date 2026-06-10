import { Navigate, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, hasHydrated } = useAuthStore()
  const location = useLocation()

  if (!hasHydrated) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
