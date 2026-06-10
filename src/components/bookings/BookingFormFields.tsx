import { useEffect } from 'react'
import { Alert, CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import { FormTextField } from '@/components/forms/FormTextField'
import { FormSelect } from '@/components/forms/FormSelect'
import { BOOKING_STATUSES } from '@/utils/constants'
import { formatCurrency, formatLeadId } from '@/utils/formatters'
import type { BookingFormData } from '@/schemas/booking.schema'
import type { Lead, Property } from '@/types'

interface BookingFormFieldsProps {
  control: Control<BookingFormData>
  setValue: UseFormSetValue<BookingFormData>
  leads: Lead[]
  properties: Property[]
  loading?: boolean
  readOnlyLinks?: boolean
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Grid size={{ xs: 12 }}>
      <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mt: 0.5, mb: -0.5 }}>
        {children}
      </Typography>
    </Grid>
  )
}

export function BookingFormFields({
  control,
  setValue,
  leads,
  properties,
  loading = false,
  readOnlyLinks = false,
}: BookingFormFieldsProps) {
  const propertyId = useWatch({ control, name: 'propertyId' })

  useEffect(() => {
    if (readOnlyLinks || !propertyId) return
    const property = properties.find((p) => p.id === propertyId)
    if (property?.price) {
      setValue('amount', property.price, { shouldValidate: true })
    }
  }, [propertyId, properties, readOnlyLinks, setValue])

  if (loading) {
    return (
      <Grid container spacing={2} justifyContent="center" py={6}>
        <CircularProgress size={28} />
      </Grid>
    )
  }

  const hasLeads = leads.length > 0
  const hasProperties = properties.length > 0

  return (
    <Grid container spacing={2}>
      {!hasLeads && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning">No leads found. Add a lead before creating a booking.</Alert>
        </Grid>
      )}
      {!hasProperties && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning">No properties found. Add a property before creating a booking.</Alert>
        </Grid>
      )}

      <SectionTitle>Booking Details</SectionTitle>
      <Grid size={{ xs: 12 }}>
        <FormSelect
          name="leadId"
          control={control}
          label="Lead"
          placeholder="Select lead..."
          options={leads.map((lead) => ({
            value: lead.id,
            label: `${lead.firstName} ${lead.lastName} · ${formatLeadId(lead.id)} · ${lead.phone}`,
          }))}
          required
          disabled={!hasLeads || readOnlyLinks}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormSelect
          name="propertyId"
          control={control}
          label="Property"
          placeholder="Select property..."
          options={properties.map((property) => ({
            value: property.id,
            label: `${property.title} · ${formatCurrency(property.price)} · ${property.locality || property.city}`,
          }))}
          required
          disabled={!hasProperties || readOnlyLinks}
        />
      </Grid>

      <SectionTitle>Payment & Status</SectionTitle>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField name="amount" control={control} label="Total Amount (INR)" type="number" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect name="status" control={control} label="Status" options={BOOKING_STATUSES} required />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormTextField name="notes" control={control} label="Notes" multiline rows={3} />
      </Grid>
    </Grid>
  )
}
