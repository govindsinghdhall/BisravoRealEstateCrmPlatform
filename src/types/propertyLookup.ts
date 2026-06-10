export type PropertyLookupType = 'LOCALITY' | 'SECTOR' | 'LANDMARK' | 'PINCODE' | 'BUILDER'

export type PropertyLookupGroups = Record<PropertyLookupType, string[]>

export interface PropertyLookupRecord {
  id: string
  type: PropertyLookupType
  value: string
  usageCount: number
}
