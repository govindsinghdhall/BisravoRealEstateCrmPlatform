import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { Lead } from '@/types'
import { capitalize, formatDateTime, formatLeadId } from '@/utils/formatters'

export type LeadExportScope = 'all' | 'filtered'
export type LeadExportFormat = 'xlsx' | 'pdf'

export const LEAD_EXPORT_HEADERS = [
  'Lead ID',
  'Lead Name',
  'Mobile Number',
  'Email Address',
  'Property Interest',
  'Source',
  'Status',
  'Assigned Agent',
  'Created Date',
  'Last Updated Date',
  'Notes',
] as const

export type LeadExportRow = Record<(typeof LEAD_EXPORT_HEADERS)[number], string>

export function mapLeadToExportRow(lead: Lead): LeadExportRow {
  return {
    'Lead ID': formatLeadId(lead.id),
    'Lead Name': `${lead.firstName} ${lead.lastName}`.trim(),
    'Mobile Number': lead.phone || '—',
    'Email Address': lead.email || '—',
    'Property Interest': lead.propertyType || '—',
    Source: lead.source || '—',
    Status: capitalize(lead.status),
    'Assigned Agent': lead.assignedToName || '—',
    'Created Date': formatDateTime(lead.createdAt),
    'Last Updated Date': formatDateTime(lead.updatedAt),
    Notes: lead.notes || '—',
  }
}

function buildFilename(scope: LeadExportScope, format: LeadExportFormat): string {
  const stamp = new Date().toISOString().slice(0, 10)
  const scopeLabel = scope === 'filtered' ? 'filtered' : 'all'
  return `leads-${scopeLabel}-${stamp}.${format}`
}

function autoFitExcelColumns(rows: LeadExportRow[]): XLSX.ColInfo[] {
  return LEAD_EXPORT_HEADERS.map((header) => {
    const maxLen = Math.max(
      header.length,
      ...rows.map((row) => String(row[header] ?? '').length),
    )
    return { wch: Math.min(Math.max(maxLen + 2, 12), 48) }
  })
}

export function exportLeadsToExcel(leads: Lead[], scope: LeadExportScope): void {
  const rows = leads.map(mapLeadToExportRow)
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: [...LEAD_EXPORT_HEADERS] })
  worksheet['!cols'] = autoFitExcelColumns(rows)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')
  XLSX.writeFile(workbook, buildFilename(scope, 'xlsx'))
}

async function loadLogoDataUrl(logoUrl?: string | null): Promise<string | null> {
  if (!logoUrl) return null

  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        if (!context) {
          resolve(null)
          return
        }
        context.drawImage(image, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch {
        resolve(null)
      }
    }
    image.onerror = () => resolve(null)
    image.src = logoUrl
  })
}

export interface LeadPdfExportOptions {
  companyName: string
  logoUrl?: string | null
  scope: LeadExportScope
  searchFilter?: string
}

export async function exportLeadsToPdf(
  leads: Lead[],
  options: LeadPdfExportOptions,
): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const generatedAt = formatDateTime(new Date())
  const scopeLabel =
    options.scope === 'filtered'
      ? options.searchFilter?.trim()
        ? `Filtered leads (search: "${options.searchFilter.trim()}")`
        : 'Filtered leads'
      : 'All leads'

  let startY = 16
  const logoDataUrl = await loadLogoDataUrl(options.logoUrl)

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 14, 10, 18, 18)
    startY = 22
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(options.companyName, logoDataUrl ? 36 : 14, 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('Leads Report', logoDataUrl ? 36 : 14, 22)

  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text(scopeLabel, 14, startY + 4)
  doc.text(`Generated: ${generatedAt}`, 14, startY + 9)
  doc.text(`Total records: ${leads.length}`, 14, startY + 14)
  doc.setTextColor(0, 0, 0)

  const body = leads.map((lead) => {
    const row = mapLeadToExportRow(lead)
    return LEAD_EXPORT_HEADERS.map((header) => row[header])
  })

  autoTable(doc, {
    head: [[...LEAD_EXPORT_HEADERS]],
    body,
    startY: startY + 18,
    styles: {
      fontSize: 7,
      cellPadding: 1.8,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: [21, 101, 192],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: () => {
      const pageNumber = doc.getNumberOfPages()
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Page ${pageNumber}`,
        pageWidth - 14,
        pageHeight - 8,
        { align: 'right' },
      )
      doc.setTextColor(0, 0, 0)
    },
  })

  doc.save(buildFilename(options.scope, 'pdf'))
}
