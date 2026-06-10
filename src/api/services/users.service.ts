import type { CreateUserDto, PaginatedResponse, QueryParams, UpdateUserDto, UserRecord } from '@/types'
import type { ApiEnvelope, BackendUser } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { toApiParams } from '../utils/params'
import { mapUser } from '../utils/mappers'

export const usersService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<UserRecord>> {
    const { data } = await apiClient.get<ApiEnvelope<BackendUser[]>>(ENDPOINTS.USERS.BASE, {
      params: toApiParams(params),
    })
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapUser) }
  },

  async getById(id: string): Promise<UserRecord> {
    const { data } = await apiClient.get<ApiEnvelope<BackendUser>>(ENDPOINTS.USERS.BY_ID(id))
    return mapUser(unwrap(data))
  },

  async create(dto: CreateUserDto): Promise<UserRecord> {
    const { data } = await apiClient.post<ApiEnvelope<BackendUser>>(ENDPOINTS.USERS.BASE, {
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      roleId: dto.roleId,
    })
    return mapUser(unwrap(data))
  },

  async update(id: string, dto: UpdateUserDto): Promise<UserRecord> {
    const payload: Record<string, unknown> = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      roleId: dto.roleId,
      isActive: dto.isActive,
    }
    if (dto.password) payload.password = dto.password

    const { data } = await apiClient.put<ApiEnvelope<BackendUser>>(
      ENDPOINTS.USERS.BY_ID(id),
      payload,
    )
    return mapUser(unwrap(data))
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS.BY_ID(id))
  },
}
