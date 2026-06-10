import type { Organization, UpdateOrganizationPayload } from '@/types/organization'
import type { ApiEnvelope } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'

export const organizationService = {
  async getCurrent(): Promise<Organization> {
    const { data } = await apiClient.get<ApiEnvelope<Organization>>(ENDPOINTS.ORGANIZATIONS.CURRENT)
    return unwrap(data)
  },

  async updateCurrent(payload: UpdateOrganizationPayload): Promise<Organization> {
    const { data } = await apiClient.patch<ApiEnvelope<Organization>>(
      ENDPOINTS.ORGANIZATIONS.CURRENT,
      payload,
    )
    return unwrap(data)
  },

  async uploadLogo(file: File): Promise<Organization> {
    const formData = new FormData()
    formData.append('logo', file)
    const { data } = await apiClient.post<ApiEnvelope<Organization>>(
      ENDPOINTS.ORGANIZATIONS.LOGO,
      formData,
    )
    return unwrap(data)
  },

  async uploadFavicon(file: File): Promise<Organization> {
    const formData = new FormData()
    formData.append('favicon', file)
    const { data } = await apiClient.post<ApiEnvelope<Organization>>(
      ENDPOINTS.ORGANIZATIONS.FAVICON,
      formData,
    )
    return unwrap(data)
  },
}
