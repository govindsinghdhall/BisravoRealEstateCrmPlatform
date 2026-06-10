import type { QueryParams } from '@/types'

export function toApiParams(params?: QueryParams): Record<string, string | number | boolean> {
  if (!params) return {}

  const apiParams: Record<string, string | number | boolean> = {}

  if (params.page) apiParams.page = params.page
  if (params.pageSize) apiParams.limit = params.pageSize
  if (params.search) apiParams.search = params.search
  if (params.sortBy) apiParams.sortBy = params.sortBy
  if (params.sortOrder) apiParams.sortOrder = params.sortOrder

  Object.entries(params).forEach(([key, value]) => {
    if (['page', 'pageSize', 'search', 'sortBy', 'sortOrder'].includes(key)) return
    if (value !== undefined) apiParams[key] = value
  })

  return apiParams
}
