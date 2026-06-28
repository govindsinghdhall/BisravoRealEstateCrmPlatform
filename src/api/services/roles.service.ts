import type { ApiEnvelope, BackendRole } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrapPaginated } from '../utils/response'

export const rolesService = {
  async getAll(): Promise<BackendRole[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendRole[]>>(ENDPOINTS.ROLES.BASE, {
      params: { limit: 100 },
    })
    return unwrapPaginated(data).data
  },
}
