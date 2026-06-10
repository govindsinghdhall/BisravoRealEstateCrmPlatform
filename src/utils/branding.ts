import { APP_NAME } from '@/utils/constants'
import { getImageUrl } from '@/utils/formatters'
import type { Organization } from '@/types/organization'

export function getOrganizationDisplayName(organization?: Organization | null) {
  return organization?.name?.trim() || APP_NAME
}

export function getOrganizationLogo(organization?: Organization | null) {
  const logo = organization?.logo
  if (!logo) return null
  if (logo.startsWith('data:')) return logo
  return getImageUrl(logo)
}

export function getOrganizationFavicon(organization?: Organization | null) {
  const favicon = organization?.settings?.faviconUrl
  if (!favicon) return '/favicon.svg'
  if (favicon.startsWith('data:')) return favicon
  return getImageUrl(favicon)
}

export function applyOrganizationBranding(organization?: Organization | null) {
  const name = getOrganizationDisplayName(organization)
  const favicon = getOrganizationFavicon(organization)

  document.title = `${name} — CRM`

  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  const cacheBust = organization?.settings?.faviconUrl ? `?v=${Date.now()}` : ''
  link.href = `${favicon}${cacheBust}`
  link.type = favicon.endsWith('.svg') || favicon.includes('svg')
    ? 'image/svg+xml'
    : 'image/png'
}
