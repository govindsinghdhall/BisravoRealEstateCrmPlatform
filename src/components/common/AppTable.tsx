import { memo, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Box,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { LoadingSpinner } from './LoadingSpinner'
import { useTableBreakpoint } from '@/utils/tableResponsive'
import styles from './AppTable.module.css'

export interface AppTableColumn<T> {
  id: string
  label: string
  align?: 'left' | 'right' | 'center'
  /** Applied to header and body cells — use your page's table CSS module */
  cellClassName?: string
  headerClassName?: string
  /** Applied to the <col> element for column width control */
  colClassName?: string
  /** Inline width for the column, e.g. "12%" or "140px" */
  width?: string
  noTruncate?: boolean
  hideOnTablet?: boolean
  hideOnMobile?: boolean
  render: (row: T, index: number) => ReactNode
}

function useVisibleColumns<T>(columns: AppTableColumn<T>[]) {
  const breakpoint = useTableBreakpoint()

  return useMemo(
    () =>
      columns.filter((col) => {
        if (breakpoint === 'mobile' && col.hideOnMobile) return false
        if ((breakpoint === 'tablet' || breakpoint === 'mobile') && col.hideOnTablet) return false
        return true
      }),
    [columns, breakpoint],
  )
}

function resolveCellClasses<T>(
  col: AppTableColumn<T>,
  variant: 'head' | 'body',
): string {
  const classes: Array<string | undefined> = [
    col.noTruncate ? styles.cellNoTruncate : styles.cellDefault,
    col.id === 'actions' ? styles.cellActions : undefined,
    variant === 'head' ? col.headerClassName : col.cellClassName,
  ]

  return classes.filter(Boolean).join(' ')
}

interface AppTableRowProps<T> {
  row: T
  rowIndex: number
  rowKey: string
  visibleColumns: AppTableColumn<T>[]
  showIndexColumn: boolean
  clickable: boolean
  onRowClick?: (row: T) => void
}

const AppTableRow = memo(function AppTableRow<T>({
  row,
  rowIndex,
  rowKey,
  visibleColumns,
  showIndexColumn,
  clickable,
  onRowClick,
}: AppTableRowProps<T>) {
  const handleClick = useCallback(() => {
    onRowClick?.(row)
  }, [onRowClick, row])

  return (
    <TableRow
      hover
      className={clickable ? styles.clickableRow : undefined}
      onClick={clickable ? handleClick : undefined}
    >
      {showIndexColumn && (
        <TableCell className={styles.cellIndex}>{rowIndex + 1}</TableCell>
      )}
      {visibleColumns.map((col) => (
        <TableCell
          key={`${rowKey}-${col.id}`}
          align={col.align ?? 'left'}
          className={resolveCellClasses(col, 'body')}
        >
          {col.render(row, rowIndex)}
        </TableCell>
      ))}
    </TableRow>
  )
}) as <T>(props: AppTableRowProps<T>) => ReactNode

interface AppTableProps<T> {
  rows: T[]
  columns: AppTableColumn<T>[]
  getRowId: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  showIndex?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  toolbarExtra?: ReactNode
  filters?: ReactNode
  onRowClick?: (row: T) => void
  /** Optional class from your page's table CSS module — applied to the <table> element */
  tableClassName?: string
}

export function AppTable<T>({
  rows,
  columns,
  getRowId,
  loading = false,
  emptyMessage = 'No records found',
  showIndex = true,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  toolbarExtra,
  filters,
  onRowClick,
  tableClassName,
}: AppTableProps<T>) {
  const breakpoint = useTableBreakpoint()
  const visibleColumns = useVisibleColumns(columns)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    setPage(0)
  }, [rows.length, searchValue])

  const paginatedRows = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, page, rowsPerPage],
  )

  const showToolbar = Boolean(onSearchChange || toolbarExtra)
  const showIndexColumn = showIndex && breakpoint !== 'mobile'
  const clickable = Boolean(onRowClick)

  const tableClass = [styles.table, tableClassName].filter(Boolean).join(' ')

  const handlePageChange = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage)
  }, [])

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    },
    [],
  )

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onSearchChange?.(event.target.value)
    },
    [onSearchChange],
  )

  return (
    <>
      {showToolbar && (
        <Box className={styles.toolbar}>
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={handleSearchChange}
              className={styles.search}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="disabled" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          {toolbarExtra}
        </Box>
      )}

      {filters && <Box className={styles.filters}>{filters}</Box>}

      <Paper className={styles.tableCard} elevation={0} data-density={breakpoint}>
        {loading ? (
          <LoadingSpinner />
        ) : rows.length === 0 ? (
          <Box className={styles.empty}>{emptyMessage}</Box>
        ) : (
          <>
            <TableContainer className={styles.tableWrap}>
              <Table className={tableClass} size="medium" stickyHeader>
                <colgroup>
                  {showIndexColumn && <col className={styles.colIndex} />}
                  {visibleColumns.map((col) => (
                    <col
                      key={col.id}
                      className={col.colClassName}
                      style={col.width ? { width: col.width } : undefined}
                    />
                  ))}
                </colgroup>
                <TableHead>
                  <TableRow>
                    {showIndexColumn && (
                      <TableCell className={styles.cellIndex}>#</TableCell>
                    )}
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align ?? 'left'}
                        className={resolveCellClasses(col, 'head')}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, index) => {
                    const rowIndex = page * rowsPerPage + index
                    const rowKey = String(getRowId(row))

                    return (
                      <AppTableRow
                        key={rowKey}
                        row={row}
                        rowIndex={rowIndex}
                        rowKey={rowKey}
                        visibleColumns={visibleColumns}
                        showIndexColumn={showIndexColumn}
                        clickable={clickable}
                        onRowClick={onRowClick}
                      />
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 25, 50]}
              className={styles.pagination}
            />
          </>
        )}
      </Paper>
    </>
  )
}
