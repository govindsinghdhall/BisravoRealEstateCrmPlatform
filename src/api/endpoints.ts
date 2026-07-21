export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  LEADS: {
    BASE: '/leads',
    BY_ID: (id: string) => `/leads/${id}`,
    TIMELINE: (id: string) => `/leads/${id}/timeline`,
    NOTES: (id: string) => `/leads/${id}/notes`,
    PROPERTY_SUGGESTIONS: (id: string) => `/leads/${id}/property-suggestions`,
    LINKED_PROPERTIES: (id: string) => `/leads/${id}/linked-properties`,
    LINKED_PROPERTY: (leadId: string, propertyId: string | number) =>
      `/leads/${leadId}/linked-properties/${propertyId}`,
  },
  CONTACTS: {
    BASE: '/contacts',
    BY_ID: (id: number | string) => `/contacts/${id}`,
    IMPORT_PREVIEW: '/contacts/import/preview',
    IMPORT: '/contacts/import',
  },
  WHATSAPP: {
    SETTINGS: '/whatsapp/settings',
    TEMPLATES: '/whatsapp/templates',
    TEMPLATE_BY_ID: (id: number | string) => `/whatsapp/templates/${id}`,
    SEND: '/whatsapp/send',
  },
  PROPERTIES: {
    BASE: '/properties',
    INVENTORY: '/properties/inventory',
    OWNERS: '/properties/owners',
    BY_ID: (id: string) => `/properties/${id}`,
    IMAGES: (id: string) => `/properties/${id}/images`,
    IMAGES_BATCH: (id: string) => `/properties/${id}/images/batch`,
  },
  PROPERTY_LOOKUPS: {
    BASE: '/property-lookups',
  },
  SITE_VISITS: {
    BASE: '/site-visits',
    BY_ID: (id: string) => `/site-visits/${id}`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  ROLES: {
    BASE: '/roles',
  },
  LEAD_SOURCES: {
    BASE: '/lead-sources',
  },
  REPORTS: {
    LEAD_CONVERSION: '/reports/lead-conversion',
    SALES: '/reports/sales',
    REVENUE: '/reports/revenue',
    AGENT_PERFORMANCE: '/reports/agent-performance',
  },
  ORGANIZATIONS: {
    CURRENT: '/organizations/current',
    LOGO: '/organizations/current/logo',
    FAVICON: '/organizations/current/favicon',
  },
} as const
