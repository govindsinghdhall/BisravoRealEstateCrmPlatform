export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ')
}

export function formatLeadId(id: number): string {
  return `LD-${String(id).padStart(6, '0')}`
}

export function formatContactRecordId(id: number): string {
  return `CT-${String(id).padStart(6, '0')}`
}

export function formatContactId(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return `CT-${digits.slice(-8).padStart(8, '0')}`
}

export function getImageUrl(url?: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1').replace(
    '/api/v1',
    '',
  )
  return `${base}${url}`
}
