import type { ApiEnvelope, BackendLeadSource } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'

export const leadSourcesService = {
  async getAll(): Promise<BackendLeadSource[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendLeadSource[]>>(ENDPOINTS.LEAD_SOURCES.BASE)
    return unwrap(data)
  },
}
