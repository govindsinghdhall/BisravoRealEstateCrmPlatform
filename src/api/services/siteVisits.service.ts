import type { CreateSiteVisitDto, PaginatedResponse, QueryParams, SiteVisit, UpdateSiteVisitDto } from '@/types'
import type { ApiEnvelope, BackendSiteVisit } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { toApiParams } from '../utils/params'
import { mapSiteVisit } from '../utils/mappers'
import { toApiEnum } from '../utils/enums'

export const siteVisitsService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<SiteVisit>> {
    const apiParams = toApiParams(params)
    if (params?.status) apiParams.status = toApiEnum(String(params.status))
    const { data } = await apiClient.get<ApiEnvelope<BackendSiteVisit[]>>(ENDPOINTS.SITE_VISITS.BASE, {
      params: apiParams,
    })
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapSiteVisit) }
  },

  async getById(id: string): Promise<SiteVisit> {
    const { data } = await apiClient.get<ApiEnvelope<BackendSiteVisit>>(ENDPOINTS.SITE_VISITS.BY_ID(id))
    return mapSiteVisit(unwrap(data))
  },

  async create(dto: CreateSiteVisitDto): Promise<SiteVisit> {
    const { data } = await apiClient.post<ApiEnvelope<BackendSiteVisit>>(ENDPOINTS.SITE_VISITS.BASE, {
      leadId: dto.leadId,
      propertyId: dto.propertyId || undefined,
      agentId: dto.agentId,
      scheduledAt: new Date(dto.scheduledAt).toISOString(),
      notes: dto.notes,
    })
    const visit = mapSiteVisit(unwrap(data))
    if (dto.status && dto.status.toUpperCase() !== 'SCHEDULED') {
      return this.update(visit.id, { status: dto.status })
    }
    return visit
  },

  async update(id: string, dto: UpdateSiteVisitDto): Promise<SiteVisit> {
    const { data } = await apiClient.put<ApiEnvelope<BackendSiteVisit>>(ENDPOINTS.SITE_VISITS.BY_ID(id), {
      scheduledAt: dto.scheduledAt,
      status: dto.status ? toApiEnum(dto.status) : undefined,
      notes: dto.notes,
    })
    return mapSiteVisit(unwrap(data))
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.SITE_VISITS.BY_ID(id))
  },
}
