import { useEffect, useMemo, useState } from 'react'
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
  cellClassName?: string
  headerClassName?: string
  noTruncate?: boolean
  hideOnTablet?: boolean
  hideOnMobile?: boolean
  render: (row: T, index: number) => React.ReactNode
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
  toolbarExtra?: React.ReactNode
  filters?: React.ReactNode
  onRowClick?: (row: T) => void
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

  const showToolbar = onSearchChange || toolbarExtra
  const showIndexColumn = showIndex && breakpoint !== 'mobile'

  return (
    <>
      {showToolbar && (
        <Box className={styles.toolbar}>
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
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

      <Paper
        className={styles.tableCard}
        elevation={0}
        data-density={breakpoint}
      >
        {loading ? (
          <LoadingSpinner />
        ) : rows.length === 0 ? (
          <Box className={styles.empty}>{emptyMessage}</Box>
        ) : (
          <>
            <TableContainer className={styles.tableWrap}>
              <Table className={styles.table} size="medium" stickyHeader>
                <colgroup>
                  {showIndexColumn && <col className={styles.colIndex} />}
                  {visibleColumns.map((col) => (
                    <col
                      key={col.id}
                      className={col.id === 'actions' ? styles.colActions : undefined}
                    />
                  ))}
                </colgroup>
                <TableHead>
                  <TableRow>
                    {showIndexColumn && <TableCell className={styles.cellIndex}>#</TableCell>}
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align ?? 'left'}
                        className={[
                          col.id === 'actions' ? styles.cellActions : undefined,
                          col.headerClassName,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, index) => {
                    const rowIndex = page * rowsPerPage + index
                    return (
                      <TableRow
                        key={String(getRowId(row))}
                        hover
                        className={onRowClick ? styles.clickableRow : undefined}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                      >
                        {showIndexColumn && (
                          <TableCell className={styles.cellIndex}>{rowIndex + 1}</TableCell>
                        )}
                        {visibleColumns.map((col) => (
                          <TableCell
                            key={col.id}
                            align={col.align ?? 'left'}
                            className={[
                              col.noTruncate || col.id === 'actions'
                                ? styles.cellNoTruncate
                                : styles.cellFit,
                              col.id === 'actions' ? styles.cellActions : undefined,
                              col.cellClassName,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {col.render(row, rowIndex)}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </>
  )
}
