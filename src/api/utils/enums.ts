export function toApiEnum(value: string): string {
  return value.toUpperCase().replace(/-/g, '_')
}

export function fromApiEnum(value: string): string {
  return value.toLowerCase().replace(/_/g, '_')
}

export function mapRoleName(role?: string): string {
  return (role || 'agent').toLowerCase()
}
