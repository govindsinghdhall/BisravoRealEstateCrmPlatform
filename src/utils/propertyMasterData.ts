/** Curated master data for Durga Property / Gurgaon listings — keeps CRM + website SEO consistent. */

export const GURGAON_CITIES = ['Gurgaon'] as const
export const HARYANA_STATES = ['Haryana'] as const

export const GURGAON_LOCALITIES = [
  'DLF Phase 1',
  'DLF Phase 2',
  'DLF Phase 3',
  'DLF Phase 4',
  'DLF Phase 5',
  'Sohna Road',
  'Golf Course Road',
  'Sector 57',
  'Sector 62',
  'Sector 65',
  'Sector 82',
  'Sector 84',
  'New Gurgaon',
  'Dwarka Expressway',
  'Manesar',
  'South City 1',
  'South City 2',
  'Palam Vihar',
  'MG Road',
  'Cyber City',
  'Udyog Vihar',
  'Sector 14',
  'Sector 15',
  'Sector 21',
  'Sector 23',
] as const

export const GURGAON_SECTORS = [
  'Sector 14',
  'Sector 15',
  'Sector 21',
  'Sector 23',
  'Sector 27',
  'Sector 43',
  'Sector 45',
  'Sector 47',
  'Sector 49',
  'Sector 50',
  'Sector 57',
  'Sector 62',
  'Sector 65',
  'Sector 67',
  'Sector 82',
  'Sector 84',
  'Sector 92',
  'Sector 95',
  'Sector 99',
  'Sector 102',
] as const

export const GURGAON_PINCODES = [
  '122001',
  '122002',
  '122003',
  '122004',
  '122005',
  '122006',
  '122007',
  '122008',
  '122009',
  '122010',
  '122011',
  '122012',
  '122015',
  '122016',
  '122017',
  '122018',
  '122051',
  '122052',
  '122101',
  '122102',
  '122103',
] as const

export const GURGAON_LANDMARKS = [
  'Cyber Hub',
  'Ambience Mall',
  'MG Road Metro Station',
  'IFFCO Chowk',
  'Golf Course Extension Road',
  'Sohna Road Junction',
  'Huda City Centre Metro',
  'World Mark Mall',
  'South Point Mall',
  'Good Earth City Centre',
  'Galleria Market',
  'Golf Course Road',
  'Dwarka Expressway Junction',
  'NH-48',
  'Rajiv Chowk',
  'Hero Honda Chowk',
  'None / Not Applicable',
] as const

export const GURGAON_BUILDERS = [
  'DLF Limited',
  'M3M India',
  'Godrej Properties',
  'Tata Housing',
  'Emaar India',
  'Sobha Limited',
  'ATS Infrastructure',
  'Vatika Group',
  'Signature Global',
  'Adani Realty',
  'Central Park',
  'Elan Group',
  'BPTP Limited',
  'Experion Developers',
  'Mahindra Lifespaces',
] as const

export const BEDROOM_OPTIONS = [
  { value: 0, label: 'Studio' },
  { value: 1, label: '1 BHK' },
  { value: 2, label: '2 BHK' },
  { value: 3, label: '3 BHK' },
  { value: 4, label: '4 BHK' },
  { value: 5, label: '5+ BHK' },
] as const

export const BATHROOM_OPTIONS = [
  { value: 1, label: '1 Bathroom' },
  { value: 2, label: '2 Bathrooms' },
  { value: 3, label: '3 Bathrooms' },
  { value: 4, label: '4 Bathrooms' },
  { value: 5, label: '5+ Bathrooms' },
] as const

export const AREA_SQFT_OPTIONS = [
  450, 550, 650, 750, 850, 1000, 1150, 1250, 1400, 1600, 1800, 2000, 2200, 2500, 3000, 3500, 4000, 5000,
] as const

export const PRICE_OPTIONS = [
  { value: 2500000, label: '₹25 Lakhs' },
  { value: 3500000, label: '₹35 Lakhs' },
  { value: 5000000, label: '₹50 Lakhs' },
  { value: 7500000, label: '₹75 Lakhs' },
  { value: 10000000, label: '₹1 Crore' },
  { value: 12500000, label: '₹1.25 Crore' },
  { value: 15000000, label: '₹1.5 Crore' },
  { value: 20000000, label: '₹2 Crore' },
  { value: 25000000, label: '₹2.5 Crore' },
  { value: 30000000, label: '₹3 Crore' },
  { value: 40000000, label: '₹4 Crore' },
  { value: 50000000, label: '₹5 Crore' },
  { value: 75000000, label: '₹7.5 Crore' },
  { value: 100000000, label: '₹10 Crore+' },
] as const

export const ROI_OPTIONS = [
  { value: 0, label: 'Not Applicable' },
  { value: 5, label: '5% ROI' },
  { value: 6, label: '6% ROI' },
  { value: 7, label: '7% ROI' },
  { value: 8, label: '8% ROI' },
  { value: 9, label: '9% ROI' },
  { value: 10, label: '10% ROI' },
  { value: 12, label: '12% ROI' },
  { value: 15, label: '15% ROI' },
] as const

export const RERA_STATUS_OPTIONS = [
  'Project Registered',
  'Unit Registered',
  'Registration In Progress',
  'Not Applicable',
] as const

export const POSSESSION_QUARTERS = [
  'Ready to Move',
  'Q1 2026',
  'Q2 2026',
  'Q3 2026',
  'Q4 2026',
  'Q1 2027',
  'Q2 2027',
  'Q3 2027',
  'Q4 2027',
  'Q1 2028',
] as const

/** Include a legacy free-text value when editing older listings. */
export function withLegacyOption<T extends string>(
  options: readonly T[],
  current?: string | null,
): { value: string; label: string }[] {
  const mapped = options.map((value) => ({ value, label: value }))
  if (current && !options.includes(current as T)) {
    return [{ value: current, label: current }, ...mapped]
  }
  return mapped
}
