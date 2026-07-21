import type { ApiEnvelope } from '../types/backend'
import type {
  WhatsAppSendPayload,
  WhatsAppSendResult,
  WhatsAppSettings,
  WhatsAppTemplate,
  WhatsAppTemplatePayload,
} from '@/types'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap } from '../utils/response'

export const whatsappService = {
  async getSettings(): Promise<WhatsAppSettings> {
    const { data } = await apiClient.get<ApiEnvelope<WhatsAppSettings>>(ENDPOINTS.WHATSAPP.SETTINGS)
    return unwrap(data)
  },

  async updateSettings(settings: WhatsAppSettings): Promise<WhatsAppSettings> {
    const { data } = await apiClient.patch<ApiEnvelope<WhatsAppSettings>>(
      ENDPOINTS.WHATSAPP.SETTINGS,
      settings,
    )
    return unwrap(data)
  },

  async getTemplates(): Promise<WhatsAppTemplate[]> {
    const { data } = await apiClient.get<ApiEnvelope<WhatsAppTemplate[]>>(ENDPOINTS.WHATSAPP.TEMPLATES)
    return unwrap(data)
  },

  async createTemplate(payload: WhatsAppTemplatePayload): Promise<WhatsAppTemplate> {
    const { data } = await apiClient.post<ApiEnvelope<WhatsAppTemplate>>(ENDPOINTS.WHATSAPP.TEMPLATES, payload)
    return unwrap(data)
  },

  async updateTemplate(id: number, payload: WhatsAppTemplatePayload): Promise<WhatsAppTemplate> {
    const { data } = await apiClient.put<ApiEnvelope<WhatsAppTemplate>>(ENDPOINTS.WHATSAPP.TEMPLATE_BY_ID(id), payload)
    return unwrap(data)
  },

  async deleteTemplate(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.WHATSAPP.TEMPLATE_BY_ID(id))
  },

  async sendMessage(payload: WhatsAppSendPayload): Promise<WhatsAppSendResult> {
    const { data } = await apiClient.post<ApiEnvelope<WhatsAppSendResult>>(ENDPOINTS.WHATSAPP.SEND, payload)
    return unwrap(data)
  },
}
