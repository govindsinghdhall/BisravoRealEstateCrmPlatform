import { z } from 'zod'
import { SITE_VISIT_STATUSES } from '@/utils/constants'

export const siteVisitSchema = z.object({
  leadId: z.string().uuid('Select a valid lead'),
  propertyId: z.string().uuid('Select a valid property'),
  agentId: z.string().uuid('Select a valid agent'),
  scheduledAt: z.string().min(1, 'Schedule date is required'),
  status: z.enum(SITE_VISIT_STATUSES),
  notes: z.string().optional(),
})

export type SiteVisitFormData = z.infer<typeof siteVisitSchema>
