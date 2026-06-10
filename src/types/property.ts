import type {
  FACING_OPTIONS,
  FURNISHING_OPTIONS,
  LISTING_CATEGORIES,
  POSSESSION_STATUSES,
  PROPERTY_AGES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from '@/utils/constants'

export type PropertyStatus = (typeof PROPERTY_STATUSES)[number]
export type PropertyType = (typeof PROPERTY_TYPES)[number]
export type ListingCategory = (typeof LISTING_CATEGORIES)[number]
export type PropertyAge = (typeof PROPERTY_AGES)[number]
export type Furnishing = (typeof FURNISHING_OPTIONS)[number]
export type Facing = (typeof FACING_OPTIONS)[number]
export type PossessionStatus = (typeof POSSESSION_STATUSES)[number]

export interface PropertyImage {
  id: string
  url: string
  isPrimary?: boolean
  caption?: string | null
}

export interface Property {
  id: string
  title: string
  description: string
  listingCategory: ListingCategory
  type: PropertyType
  status: PropertyStatus
  price: number
  area: number
  carpetArea?: number
  builtUpArea?: number
  superArea?: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  state: string
  zipCode: string
  locality: string
  sector?: string
  landmark?: string
  latitude?: number
  longitude?: number
  builderName?: string
  propertyAge?: PropertyAge
  furnishing?: Furnishing
  facing?: Facing
  possessionStatus?: PossessionStatus
  possessionDate?: string
  roiPotential?: number
  isVerified: boolean
  hasRera: boolean
  reraId?: string
  videoTourUrl?: string
  virtualTourUrl?: string
  brochureUrl?: string
  amenities: string[]
  images: PropertyImage[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePropertyDto {
  title: string
  description: string
  listingCategory: ListingCategory
  type: PropertyType
  status: PropertyStatus
  price: number
  area: number
  carpetArea?: number
  builtUpArea?: number
  superArea?: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  state: string
  zipCode: string
  locality: string
  sector?: string
  landmark?: string
  latitude?: number
  longitude?: number
  builderName?: string
  propertyAge?: PropertyAge
  furnishing?: Furnishing
  facing?: Facing
  possessionStatus?: PossessionStatus
  possessionDate?: string
  roiPotential?: number
  isVerified?: boolean
  hasRera?: boolean
  reraId?: string
  videoTourUrl?: string
  virtualTourUrl?: string
  brochureUrl?: string
  amenities: string[]
  isActive?: boolean
}

export type UpdatePropertyDto = Partial<CreatePropertyDto>
