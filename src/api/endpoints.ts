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
  },
  CONTACTS: {
    BASE: '/contacts',
    BY_ID: (id: number | string) => `/contacts/${id}`,
    IMPORT_PREVIEW: '/contacts/import/preview',
    IMPORT: '/contacts/import',
  },
  PROPERTIES: {
    BASE: '/properties',
    INVENTORY: '/properties/inventory',
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
