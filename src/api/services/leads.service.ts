import type { CreateLeadDto, Lead, LeadDetail, LeadTimelineEntry, PaginatedResponse, QueryParams, UpdateLeadDto } from '@/types'
import type { ApiEnvelope, BackendLead, BackendLeadTimeline } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { toApiParams } from '../utils/params'
import { mapLead, mapLeadDetail, mapLeadTimeline } from '../utils/mappers'
import { toApiEnum } from '../utils/enums'

function toBackendCreate(dto: CreateLeadDto) {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email || undefined,
    phone: dto.phone,
    sourceId: dto.sourceId,
    budget: dto.budget,
    city: dto.location,
    requirements: dto.propertyType,
    assignedToId: dto.assignedTo || undefined,
  }
}

function toBackendUpdate(dto: UpdateLeadDto) {
  return {
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    status: dto.status ? toApiEnum(dto.status) : undefined,
    sourceId: dto.sourceId,
    budget: dto.budget,
    city: dto.location,
    requirements: dto.propertyType,
    assignedToId: dto.assignedTo,
  }
}

export const leadsService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Lead>> {
    const apiParams = toApiParams(params)
    if (params?.status) apiParams.status = toApiEnum(String(params.status))
    const { data } = await apiClient.get<ApiEnvelope<BackendLead[]>>(ENDPOINTS.LEADS.BASE, {
      params: apiParams,
    })
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapLead) }
  },

  /** Fetch every lead page (100 per request) for exports. */
  async fetchAll(params?: Omit<QueryParams, 'page' | 'pageSize'>): Promise<Lead[]> {
    const pageSize = 100
    let page = 1
    let totalPages = 1
    const leads: Lead[] = []

    while (page <= totalPages) {
      const result = await this.getAll({ ...params, page, pageSize })
      leads.push(...result.data)
      totalPages = result.totalPages
      page += 1
    }

    return leads
  },

  async getById(id: string): Promise<LeadDetail> {
    const { data } = await apiClient.get<ApiEnvelope<BackendLead>>(ENDPOINTS.LEADS.BY_ID(id))
    return mapLeadDetail(unwrap(data))
  },

  async getTimeline(id: string): Promise<LeadTimelineEntry[]> {
    const { data } = await apiClient.get<ApiEnvelope<BackendLeadTimeline[]>>(ENDPOINTS.LEADS.TIMELINE(id))
    return (unwrap(data) ?? []).map(mapLeadTimeline)
  },

  async addNote(id: string, content: string): Promise<void> {
    await apiClient.post(ENDPOINTS.LEADS.NOTES(id), { content })
  },

  async create(dto: CreateLeadDto): Promise<Lead> {
    const { data } = await apiClient.post<ApiEnvelope<BackendLead>>(
      ENDPOINTS.LEADS.BASE,
      toBackendCreate(dto),
    )
    const lead = mapLead(unwrap(data))
    if (dto.status && dto.status.toUpperCase() !== 'NEW') {
      return this.update(lead.id, { status: dto.status })
    }
    return lead
  },

  async update(id: string, dto: UpdateLeadDto): Promise<Lead> {
    const { data } = await apiClient.put<ApiEnvelope<BackendLead>>(
      ENDPOINTS.LEADS.BY_ID(id),
      toBackendUpdate(dto),
    )
    return mapLead(unwrap(data))
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.LEADS.BY_ID(id))
  },
}
