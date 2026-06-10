import { TablePill } from '@/components/common/TablePill'
import type { Property } from '@/types'

interface PropertyStatusCellProps {
  property: Property
}

export function PropertyStatusCell({ property }: PropertyStatusCellProps) {
  return <TablePill label={property.status} />
}
