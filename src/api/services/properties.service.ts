import type { CreatePropertyDto, PaginatedResponse, Property, PropertyWithOwner, QueryParams, UpdatePropertyDto } from '@/types'
import type { ApiEnvelope, BackendProperty } from '../types/backend'
import { apiClient } from '../client'
import { ENDPOINTS } from '../endpoints'
import { unwrap, unwrapPaginated } from '../utils/response'
import { toApiParams } from '../utils/params'
import { mapProperty } from '../utils/mappers'
import { toApiEnum } from '../utils/enums'

export const MAX_PROPERTY_PHOTOS = 20

function toBackendPayload(dto: CreatePropertyDto | UpdatePropertyDto) {
  return {
    title: dto.title,
    description: dto.description,
    listingCategory: dto.listingCategory ? toApiEnum(dto.listingCategory) : undefined,
    type: dto.type ? toApiEnum(dto.type) : undefined,
    status: dto.status ? toApiEnum(dto.status) : undefined,
    price: dto.price,
    area: dto.area,
    carpetArea: dto.carpetArea,
    builtUpArea: dto.builtUpArea,
    superArea: dto.superArea ?? dto.area,
    bedrooms: dto.bedrooms,
    bathrooms: dto.bathrooms,
    address: dto.address,
    city: dto.city,
    state: dto.state,
    pincode: dto.zipCode,
    locality: dto.locality,
    sector: dto.sector,
    landmark: dto.landmark,
    latitude: dto.latitude,
    longitude: dto.longitude,
    builderName: dto.builderName,
    propertyAge: dto.propertyAge ? toApiEnum(dto.propertyAge) : undefined,
    furnishing: dto.furnishing ? toApiEnum(dto.furnishing) : undefined,
    facing: dto.facing ? toApiEnum(dto.facing) : undefined,
    possessionStatus: dto.possessionStatus ? toApiEnum(dto.possessionStatus) : undefined,
    possessionDate: dto.possessionDate || undefined,
    roiPotential: dto.roiPotential,
    isVerified: dto.isVerified,
    hasRera: dto.hasRera,
    reraId: dto.reraId,
    videoTourUrl: dto.videoTourUrl || undefined,
    virtualTourUrl: dto.virtualTourUrl || undefined,
    brochureUrl: dto.brochureUrl || undefined,
    amenities: dto.amenities,
    isActive: dto.isActive,
    ownerName: dto.ownerName || null,
    ownerPhone: dto.ownerPhone || null,
    ownerEmail: dto.ownerEmail || null,
    ownerAddress: dto.ownerAddress || null,
    ownerNotes: dto.ownerNotes || null,
  }
}

export const propertiesService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Property>> {
    const apiParams = toApiParams(params)
    if (params?.status) apiParams.status = toApiEnum(String(params.status))
    if (params?.type) apiParams.type = toApiEnum(String(params.type))
    const { data } = await apiClient.get<ApiEnvelope<BackendProperty[]>>(ENDPOINTS.PROPERTIES.BASE, {
      params: apiParams,
    })
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapProperty) }
  },

  async getById(id: string): Promise<Property> {
    const { data } = await apiClient.get<ApiEnvelope<BackendProperty>>(ENDPOINTS.PROPERTIES.BY_ID(id))
    return mapProperty(unwrap(data))
  },

  async create(dto: CreatePropertyDto): Promise<Property> {
    const { data } = await apiClient.post<ApiEnvelope<BackendProperty>>(
      ENDPOINTS.PROPERTIES.BASE,
      toBackendPayload(dto),
    )
    return mapProperty(unwrap(data))
  },

  async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
    const { data } = await apiClient.put<ApiEnvelope<BackendProperty>>(
      ENDPOINTS.PROPERTIES.BY_ID(id),
      toBackendPayload(dto),
    )
    return mapProperty(unwrap(data))
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.PROPERTIES.BY_ID(id))
  },

  async getInventory() {
    const { data } = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ENDPOINTS.PROPERTIES.INVENTORY,
    )
    return unwrap(data)
  },

  async getOwners(params?: QueryParams): Promise<PaginatedResponse<PropertyWithOwner>> {
    const apiParams = toApiParams(params)
    const { data } = await apiClient.get<ApiEnvelope<BackendProperty[]>>(
      ENDPOINTS.PROPERTIES.OWNERS,
      { params: apiParams },
    )
    const result = unwrapPaginated(data)
    return { ...result, data: result.data.map(mapProperty) as PropertyWithOwner[] }
  },

  async uploadImages(
    propertyId: string,
    files: File[],
    options?: { hasExistingImages?: boolean },
  ): Promise<number> {
    if (!files.length) return 0

    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    if (!options?.hasExistingImages) {
      formData.append('setPrimary', 'true')
    }

    const { data } = await apiClient.post<ApiEnvelope<unknown[]>>(
      ENDPOINTS.PROPERTIES.IMAGES_BATCH(propertyId),
      formData,
      { timeout: 120_000 },
    )

    return unwrap(data).length
  },
}
