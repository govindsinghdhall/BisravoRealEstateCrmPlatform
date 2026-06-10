import { useMemo } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import type { ColDef } from 'ag-grid-community'

export type TableBreakpoint = 'desktop' | 'tablet' | 'mobile'

export function useTableBreakpoint(): TableBreakpoint {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  return 'desktop'
}

export interface ResponsiveColumnConfig {
  hideOnTablet?: string[]
  hideOnMobile?: string[]
}

function columnId<T>(col: ColDef<T>): string | undefined {
  if (col.colId) return col.colId
  if (typeof col.field === 'string') return col.field
  return undefined
}

export function useResponsiveColumnDefs<T>(
  baseColumns: ColDef<T>[],
  config: ResponsiveColumnConfig,
): ColDef<T>[] {
  const breakpoint = useTableBreakpoint()

  return useMemo(() => {
    const hide = new Set<string>()
    if (breakpoint === 'tablet' || breakpoint === 'mobile') {
      config.hideOnTablet?.forEach((id) => hide.add(id))
    }
    if (breakpoint === 'mobile') {
      config.hideOnMobile?.forEach((id) => hide.add(id))
    }

    return baseColumns.map((col) => {
      const id = columnId(col)
      if (id && hide.has(id)) return { ...col, hide: true }
      return col
    })
  }, [baseColumns, breakpoint, config.hideOnMobile, config.hideOnTablet])
}

export function useTableViewportHeight(offset = 300): string {
  const breakpoint = useTableBreakpoint()
  const base = breakpoint === 'mobile' ? 420 : breakpoint === 'tablet' ? 480 : 540
  return `min(${base}px, calc(100vh - ${offset}px))`
}
