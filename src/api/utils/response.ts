import type { PaginatedResponse } from '@/types'
import type { ApiEnvelope, PaginationMeta } from '../types/backend'

export function unwrap<T>(envelope: ApiEnvelope<T>): T {
  return envelope.data
}

export function unwrapPaginated<T>(envelope: ApiEnvelope<T[]>): PaginatedResponse<T> {
  const meta: PaginationMeta = envelope.meta ?? {
    page: 1,
    limit: envelope.data.length,
    total: envelope.data.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  }

  return {
    data: envelope.data,
    total: meta.total,
    page: meta.page,
    pageSize: meta.limit,
    totalPages: meta.totalPages,
  }
}
