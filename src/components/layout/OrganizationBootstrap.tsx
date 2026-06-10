import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { organizationService } from '@/api/services'
import { useAuthStore } from '@/store/authStore'
import { useOrganizationStore } from '@/store/organizationStore'
import { applyOrganizationBranding } from '@/utils/branding'

export function OrganizationBootstrap() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setOrganization = useOrganizationStore((state) => state.setOrganization)
  const clearOrganization = useOrganizationStore((state) => state.clearOrganization)
  const organization = useOrganizationStore((state) => state.organization)

  const { data } = useQuery({
    queryKey: ['organization', 'current'],
    queryFn: organizationService.getCurrent,
    enabled: isAuthenticated,
    staleTime: 30_000,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      clearOrganization()
    }
  }, [isAuthenticated, clearOrganization])

  useEffect(() => {
    if (data) {
      setOrganization(data)
    }
  }, [data, setOrganization])

  useEffect(() => {
    if (isAuthenticated) {
      applyOrganizationBranding(organization)
    }
  }, [organization, isAuthenticated])

  return null
}
