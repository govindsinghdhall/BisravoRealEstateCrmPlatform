import * as XLSX from 'xlsx'

const SAMPLE_HEADERS = [
  'First Name',
  'Last Name',
  'Phone',
  'Email',
  'Alternate Phone',
  'Address',
  'City',
  'State',
  'Pincode',
] as const

const SAMPLE_ROWS: (string | number)[][] = [
  [
    'John',
    'Doe',
    '9876543210',
    'john@example.com',
    '9876543211',
    'Sector 56',
    'Gurgaon',
    'Haryana',
    '122011',
  ],
  [
    'Jane',
    'Smith',
    '9876543212',
    'jane@example.com',
    '',
    'MG Road',
    'Gurgaon',
    'Haryana',
    '122002',
  ],
]

export function downloadContactsSampleExcel(): void {
  const worksheet = XLSX.utils.aoa_to_sheet([
    [...SAMPLE_HEADERS],
    ...SAMPLE_ROWS,
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts')
  XLSX.writeFile(workbook, 'contacts_sample.xlsx')
}
