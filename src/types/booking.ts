import type { BOOKING_STATUSES } from '@/utils/constants'

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export interface Booking {
  id: string
  leadId: string
  leadName: string
  propertyId: string
  propertyTitle: string
  agentId: string
  agentName: string
  amount: number
  status: BookingStatus
  bookingDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBookingDto {
  leadId: string
  propertyId: string
  unitId?: string
  amount: number
  status: BookingStatus
  notes?: string
}

export type UpdateBookingDto = Partial<CreateBookingDto>
