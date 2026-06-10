import type { ApiEnvelope, BackendRole } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'

export const rolesService = {
  async getAll(): Promise<BackendRole[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendRole[]>>(ENDPOINTS.ROLES.BASE)
    return unwrap(data)
  },
}
