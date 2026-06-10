import type { Booking, CreateBookingDto, PaginatedResponse, QueryParams, UpdateBookingDto } from '@/types'
import type { ApiEnvelope, BackendBooking } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { toApiParams } from '../utils/params'
import { mapBooking } from '../utils/mappers'
import { toApiEnum } from '../utils/enums'

export const bookingsService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Booking>> {
    const apiParams = toApiParams(params)
    if (params?.status) apiParams.status = toApiEnum(String(params.status))
    const { data } = await apiClient.get<ApiEnvelope<BackendBooking[]>>(ENDPOINTS.BOOKINGS.BASE, {
      params: apiParams,
    })
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapBooking) }
  },

  async getById(id: string): Promise<Booking> {
    const { data } = await apiClient.get<ApiEnvelope<BackendBooking>>(ENDPOINTS.BOOKINGS.BY_ID(id))
    return mapBooking(unwrap(data))
  },

  async create(dto: CreateBookingDto): Promise<Booking> {
    const { data } = await apiClient.post<ApiEnvelope<BackendBooking>>(ENDPOINTS.BOOKINGS.BASE, {
      leadId: dto.leadId,
      propertyId: dto.propertyId,
      unitId: dto.unitId || undefined,
      totalAmount: dto.amount,
      notes: dto.notes,
    })
    const booking = mapBooking(unwrap(data))
    if (dto.status && dto.status.toUpperCase() !== 'PENDING') {
      return this.update(booking.id, { status: dto.status })
    }
    return booking
  },

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const { data } = await apiClient.put<ApiEnvelope<BackendBooking>>(ENDPOINTS.BOOKINGS.BY_ID(id), {
      status: dto.status ? toApiEnum(dto.status) : undefined,
      notes: dto.notes,
    })
    return mapBooking(unwrap(data))
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.BOOKINGS.BY_ID(id))
  },
}
