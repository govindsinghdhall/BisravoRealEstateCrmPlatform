import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Box, Typography, alpha, useTheme } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { LoadingSpinner } from './LoadingSpinner'
import { EmptyState } from './EmptyState'
import { useTableBreakpoint, useTableViewportHeight } from '@/utils/tableResponsive'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '@/styles/data-table.css'

interface DataTableProps<T> {
  rowData: T[]
  columnDefs: ColDef<T>[]
  loading?: boolean
  height?: number | string
  gridOptions?: GridOptions<T>
  onRowClick?: (data: T) => void
  emptyMessage?: string
  title?: string
  totalRecords?: number
  toolbar?: React.ReactNode
  /** Pin action column and fit remaining columns to viewport (no horizontal scroll). */
  fitViewport?: boolean
}

export function DataTable<T>({
  rowData,
  columnDefs,
  loading = false,
  height,
  gridOptions,
  onRowClick,
  emptyMessage = 'No records found',
  title,
  totalRecords,
  toolbar,
  fitViewport = true,
}: DataTableProps<T>) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const breakpoint = useTableBreakpoint()
  const viewportHeight = useTableViewportHeight()
  const gridRef = useRef<GridApi<T> | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: false,
      resizable: breakpoint === 'desktop',
      flex: 1,
      minWidth: breakpoint === 'mobile' ? 68 : 88,
      suppressHeaderMenuButton: true,
      cellClass: 'crm-cell',
      wrapHeaderText: true,
      autoHeaderHeight: true,
    }),
    [breakpoint],
  )

  const agTheme = useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: isDark ? '#1A2332' : '#FFFFFF',
        foregroundColor: isDark ? '#E2E8F0' : '#0F172A',
        headerBackgroundColor: isDark ? '#141C27' : '#FAFBFC',
        headerTextColor: isDark ? '#94A3B8' : '#64748B',
        borderColor: isDark ? '#243040' : '#E8EDF3',
        accentColor: '#1565C0',
        oddRowBackgroundColor: isDark ? '#171F2C' : '#FFFFFF',
        rowHoverColor: isDark ? '#1E2A3A' : '#F8FAFC',
        fontFamily: '"Inter", system-ui, sans-serif',
        headerFontWeight: 600,
        cellHorizontalPadding: 0,
        rowHeight: breakpoint === 'mobile' ? 48 : 52,
        headerHeight: breakpoint === 'mobile' ? 44 : 48,
        wrapperBorderRadius: 0,
        spacing: 4,
      }),
    [isDark, breakpoint],
  )

  const fitColumns = useCallback(() => {
    if (!fitViewport || !gridRef.current) return
    gridRef.current.sizeColumnsToFit({
      defaultMinWidth: breakpoint === 'mobile' ? 72 : 96,
      columnLimits: [
        { key: 'si', minWidth: 56, maxWidth: 72 },
        { key: 'property', minWidth: breakpoint === 'mobile' ? 160 : 220 },
        { key: 'price', minWidth: 108 },
        { key: 'status', minWidth: 110 },
        { key: 'type', minWidth: 88 },
        { key: 'actions', minWidth: 104, maxWidth: 112 },
      ],
    })
  }, [fitViewport, breakpoint])

  const onGridReady = useCallback(
    (event: GridReadyEvent<T>) => {
      gridRef.current = event.api
      fitColumns()
      gridOptions?.onGridReady?.(event)
    },
    [fitColumns, gridOptions],
  )

  useEffect(() => {
    if (!containerRef.current || !fitViewport) return
    const observer = new ResizeObserver(() => fitColumns())
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [fitColumns, fitViewport, rowData.length])

  useEffect(() => {
    fitColumns()
  }, [columnDefs, fitColumns, breakpoint])

  const mergedGridOptions = useMemo<GridOptions<T>>(
    () => ({
      ...gridOptions,
      suppressHorizontalScroll: fitViewport,
      alwaysShowHorizontalScroll: false,
      onGridReady,
      onFirstDataRendered: (event) => {
        fitColumns()
        gridOptions?.onFirstDataRendered?.(event)
      },
      onGridSizeChanged: (event) => {
        fitColumns()
        gridOptions?.onGridSizeChanged?.(event)
      },
    }),
    [gridOptions, fitViewport, onGridReady, fitColumns],
  )

  const displayCount = totalRecords ?? rowData.length
  const pageSize = breakpoint === 'mobile' ? 8 : 10
  const resolvedHeight = useMemo(() => {
    if (height) return height
    const headerH = breakpoint === 'mobile' ? 44 : 48
    const rowH = breakpoint === 'mobile' ? 48 : 52
    const pagerH = 52
    const visibleRows = Math.max(Math.min(rowData.length, pageSize), rowData.length > 0 ? 1 : 0)
    const contentH = headerH + visibleRows * rowH + pagerH + 12
    const minH = 220
    return `min(max(${contentH}px, ${minH}px), ${viewportHeight})`
  }, [height, breakpoint, rowData.length, pageSize, viewportHeight])

  const shellSx = {
    borderRadius: '16px',
    border: '1px solid',
    borderColor: isDark ? alpha('#fff', 0.06) : '#E8EDF3',
    overflow: 'hidden',
    bgcolor: 'background.paper',
    boxShadow: isDark
      ? '0 1px 0 rgba(255,255,255,0.03) inset'
      : '0 4px 24px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
  }

  if (loading) {
    return (
      <Box sx={shellSx}>
        <Box py={8}>
          <LoadingSpinner />
        </Box>
      </Box>
    )
  }

  if (!rowData.length) {
    return (
      <Box sx={shellSx}>
        {(title || toolbar) && (
          <>
            {title && (
              <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.25, pb: toolbar ? 1.5 : 2 }}>
                <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.02em">
                  {title}
                </Typography>
              </Box>
            )}
            {toolbar && (
              <Box
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  bgcolor: isDark ? alpha('#fff', 0.02) : '#F8FAFC',
                  borderTop: title ? '1px solid' : 'none',
                  borderBottom: '1px solid',
                  borderColor: isDark ? alpha('#fff', 0.06) : '#E8EDF3',
                }}
              >
                {toolbar}
              </Box>
            )}
          </>
        )}
        <Box px={2} py={2}>
          <EmptyState title={emptyMessage} />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      className="premium-data-table"
      data-theme={isDark ? 'dark' : 'light'}
      data-density={breakpoint}
      sx={shellSx}
    >
      {(title || toolbar) && (
        <>
          {title && (
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.25, pb: toolbar ? 1.5 : 2 }}>
              <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.02em" lineHeight={1.2}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary" mt={0.35} display="block">
                {displayCount.toLocaleString()} {displayCount === 1 ? 'record' : 'records'}
              </Typography>
            </Box>
          )}
          {toolbar && (
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 2,
                bgcolor: isDark ? alpha('#fff', 0.02) : '#F8FAFC',
                borderTop: title ? '1px solid' : 'none',
                borderBottom: '1px solid',
                borderColor: isDark ? alpha('#fff', 0.06) : '#E8EDF3',
              }}
            >
              {toolbar}
            </Box>
          )}
        </>
      )}

      <Box
        ref={containerRef}
        className="ag-theme-quartz premium-data-table__grid"
        sx={{
          width: '100%',
          height: resolvedHeight,
          minHeight: 240,
          pt: 0.5,
          pb: 0.5,
          overflow: 'hidden',
          boxSizing: 'border-box',
          '& .ag-root-wrapper': { border: 'none' },
          '& .table-actions': {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            width: '100%',
            justifyContent: 'flex-end',
          },
          '& .table-action-btn': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: breakpoint === 'mobile' ? 32 : 34,
            height: breakpoint === 'mobile' ? 32 : 34,
            border: '1px solid',
            borderColor: isDark ? '#2A3544' : '#E2E8F0',
            borderRadius: '7px',
            bgcolor: isDark ? '#1A2332' : '#FFFFFF',
            color: isDark ? '#94A3B8' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            padding: 0,
            '&:hover': {
              borderColor: '#1565C0',
              color: '#1565C0',
              bgcolor: isDark ? alpha('#1565C0', 0.12) : '#F0F7FF',
            },
          },
          '& .table-action-btn--danger:hover': {
            borderColor: '#DC2626',
            color: '#DC2626',
            bgcolor: isDark ? alpha('#DC2626', 0.12) : '#FEF2F2',
          },
        }}
      >
        <AgGridReact<T>
          theme={agTheme}
          rowData={rowData}
          getRowId={(params) => String((params.data as { id?: string })?.id ?? '')}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          paginationPageSize={breakpoint === 'mobile' ? 8 : 10}
          paginationPageSizeSelector={breakpoint === 'mobile' ? [8, 15, 25] : [10, 25, 50]}
          suppressCellFocus
          suppressRowClickSelection
          enableCellTextSelection
          rowClass={onRowClick ? 'crm-table-row--clickable' : undefined}
          onRowClicked={
            onRowClick
              ? (event) => {
                  const target = event.event?.target as HTMLElement | undefined
                  if (target?.closest('.table-actions, .table-action-btn, button, a')) return
                  if (event.data) onRowClick(event.data)
                }
              : undefined
          }
          gridOptions={mergedGridOptions}
        />
      </Box>
    </Box>
  )
}
