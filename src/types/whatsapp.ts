export interface WhatsAppSettings {
  businessPhone?: string
  businessId?: string
  displayName?: string
}

export interface WhatsAppTemplate {
  id: number
  name: string
  message: string
  createdAt: string
  updatedAt: string
}

export interface WhatsAppTemplatePayload {
  name: string
  message: string
}

export interface WhatsAppSendPayload {
  contactIds: number[]
  templateId?: number
  customMessage?: string
}

export interface WhatsAppSendResult {
  success: boolean
  sentCount: number
  failedCount?: number
  errors?: string[]
}
