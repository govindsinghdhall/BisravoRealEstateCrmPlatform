import type {
  LeadPropertyLink,
  LinkPropertyDto,
  PropertySuggestion,
  UpdateLinkedPropertyDto,
} from '@/types'
import type { ApiEnvelope, BackendLeadPropertyLink, BackendPropertySuggestion } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'
import { mapLeadPropertyLink, mapProperty } from '../utils/mappers'

function mapSuggestion(item: BackendPropertySuggestion): PropertySuggestion {
  return {
    property: mapProperty(item.property),
    matchScore: item.matchScore,
    matchReasons: item.matchReasons,
  }
}

function mapLink(link: BackendLeadPropertyLink): LeadPropertyLink {
  return mapLeadPropertyLink(link)
}

export const leadPropertiesService = {
  async getSuggestions(leadId: string | number, limit = 10): Promise<PropertySuggestion[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendPropertySuggestion[]>>(
      ENDPOINTS.LEADS.PROPERTY_SUGGESTIONS(String(leadId)),
      { params: { limit } },
    )
    return (unwrap(data) ?? []).map(mapSuggestion)
  },

  async getLinked(leadId: string | number): Promise<LeadPropertyLink[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendLeadPropertyLink[]>>(
      ENDPOINTS.LEADS.LINKED_PROPERTIES(String(leadId)),
    )
    return (unwrap(data) ?? []).map(mapLink)
  },

  async link(leadId: string | number, dto: LinkPropertyDto): Promise<LeadPropertyLink> {
    const { data } = await apiClient.post<ApiEnvelope<BackendLeadPropertyLink>>(
      ENDPOINTS.LEADS.LINKED_PROPERTIES(String(leadId)),
      dto,
    )
    return mapLink(unwrap(data))
  },

  async updateLink(
    leadId: string | number,
    propertyId: string | number,
    dto: UpdateLinkedPropertyDto,
  ): Promise<LeadPropertyLink> {
    const { data } = await apiClient.put<ApiEnvelope<BackendLeadPropertyLink>>(
      ENDPOINTS.LEADS.LINKED_PROPERTY(String(leadId), propertyId),
      dto,
    )
    return mapLink(unwrap(data))
  },

  async unlink(leadId: string | number, propertyId: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.LEADS.LINKED_PROPERTY(String(leadId), propertyId))
  },
}
