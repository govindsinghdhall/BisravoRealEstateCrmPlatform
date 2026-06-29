import type { PaginatedResponse } from '@/types'
import type { QueryClient, QueryKey } from '@tanstack/react-query'

/** Mark list queries stale and wait for active instances to refetch. */
export async function invalidateListQueries(
  queryClient: QueryClient,
  queryKey: QueryKey,
): Promise<void> {
  await queryClient.invalidateQueries({ queryKey })
  await queryClient.refetchQueries({ queryKey, type: 'active' })
}

/** Prepend a created record to all matching paginated list caches. */
export function prependToListCaches<T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  item: T,
): void {
  queryClient.setQueriesData<PaginatedResponse<T>>(
    { queryKey },
    (old) => {
      if (!old) return old
      if (old.data.some((row) => row.id === item.id)) return old
      return {
        ...old,
        data: [item, ...old.data],
        total: (old.total ?? old.data.length) + 1,
      }
    },
  )
}

/** Replace a record in all matching paginated list caches. */
export function updateInListCaches<T extends { id: string | number }>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  item: T,
): void {
  queryClient.setQueriesData<PaginatedResponse<T>>(
    { queryKey },
    (old) => {
      if (!old) return old
      return {
        ...old,
        data: old.data.map((row) => (row.id === item.id ? item : row)),
      }
    },
  )
}

/** Remove a record from all matching paginated list caches. */
export function removeFromListCaches(
  queryClient: QueryClient,
  queryKey: QueryKey,
  id: string | number,
): void {
  queryClient.setQueriesData<PaginatedResponse<{ id: string | number }>>(
    { queryKey },
    (old) => {
      if (!old) return old
      const next = old.data.filter((row) => row.id !== id)
      if (next.length === old.data.length) return old
      return {
        ...old,
        data: next,
        total: Math.max(0, (old.total ?? old.data.length) - 1),
      }
    },
  )
}
