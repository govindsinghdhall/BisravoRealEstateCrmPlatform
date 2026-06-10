import type { PropertyLookupGroups, PropertyLookupRecord, PropertyLookupType } from '@/types/propertyLookup'
import type { ApiEnvelope } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'

export const propertyLookupsService = {
  async getAll(type?: PropertyLookupType): Promise<PropertyLookupGroups> {
    const { data } = await apiClient.get<ApiEnvelope<PropertyLookupGroups>>(
      ENDPOINTS.PROPERTY_LOOKUPS.BASE,
      { params: type ? { type } : undefined },
    )
    return unwrap(data)
  },

  async create(type: PropertyLookupType, value: string): Promise<PropertyLookupRecord> {
    const { data } = await apiClient.post<ApiEnvelope<PropertyLookupRecord>>(
      ENDPOINTS.PROPERTY_LOOKUPS.BASE,
      { type, value },
    )
    return unwrap(data)
  },
}
