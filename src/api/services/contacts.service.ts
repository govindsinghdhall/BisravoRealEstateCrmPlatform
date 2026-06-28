import type {
  Contact,
  ContactDetail,
  ContactDuplicateAction,
  ContactImportPreviewResult,
  ContactImportResult,
  CreateContactDto,
  PaginatedResponse,
  QueryParams,
  UpdateContactDto,
} from '@/types'
import type { ApiEnvelope, BackendContact } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { toApiParams } from '../utils/params'
import { mapContact, mapContactDetail } from '../utils/mappers'

export const contactsService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Contact>> {
    const { data } = await apiClient.get<ApiEnvelope<BackendContact[]>>(ENDPOINTS.CONTACTS.BASE, {
      params: toApiParams(params),
    })
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapContact) }
  },

  async getById(id: number): Promise<ContactDetail> {
    const { data } = await apiClient.get<ApiEnvelope<BackendContact>>(ENDPOINTS.CONTACTS.BY_ID(id))
    return mapContactDetail(unwrap(data))
  },

  async create(dto: CreateContactDto): Promise<Contact> {
    const { data } = await apiClient.post<ApiEnvelope<BackendContact>>(ENDPOINTS.CONTACTS.BASE, dto)
    return mapContact(unwrap(data))
  },

  async update(id: number, dto: UpdateContactDto): Promise<Contact> {
    const { data } = await apiClient.put<ApiEnvelope<BackendContact>>(
      ENDPOINTS.CONTACTS.BY_ID(id),
      dto,
    )
    return mapContact(unwrap(data))
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.CONTACTS.BY_ID(id))
  },

  async importPreview(file: File): Promise<ContactImportPreviewResult> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post<ApiEnvelope<ContactImportPreviewResult>>(
      ENDPOINTS.CONTACTS.IMPORT_PREVIEW,
      formData,
    )
    return unwrap(data)
  },

  async import(file: File, duplicateAction: ContactDuplicateAction): Promise<ContactImportResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('duplicateAction', duplicateAction)
    const { data } = await apiClient.post<ApiEnvelope<ContactImportResult>>(
      ENDPOINTS.CONTACTS.IMPORT,
      formData,
    )
    return unwrap(data)
  },
}
