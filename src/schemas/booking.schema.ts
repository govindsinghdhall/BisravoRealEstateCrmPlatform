import { z } from 'zod'
import { BOOKING_STATUSES } from '@/utils/constants'

export const bookingSchema = z.object({
  leadId: z.string().uuid('Select a valid lead'),
  propertyId: z.string().uuid('Select a valid property'),
  amount: z.number({ invalid_type_error: 'Amount must be a number' }).min(0, 'Amount must be positive'),
  status: z.enum(BOOKING_STATUSES),
  notes: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>
