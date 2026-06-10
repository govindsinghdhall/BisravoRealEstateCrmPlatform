import { Alert, CircularProgress, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import type { Control } from 'react-hook-form'
import { FormTextField } from '@/components/forms/FormTextField'
import { FormSelect } from '@/components/forms/FormSelect'
import { SITE_VISIT_STATUSES } from '@/utils/constants'
import { capitalize, formatLeadId } from '@/utils/formatters'
import type { SiteVisitFormData } from '@/schemas/siteVisit.schema'
import type { Lead, Property, UserRecord } from '@/types'

interface SiteVisitFormFieldsProps {
  control: Control<SiteVisitFormData>
  leads: Lead[]
  properties: Property[]
  agents: UserRecord[]
  loading?: boolean
  readOnlyParticipants?: boolean
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

export function SiteVisitFormFields({
  control,
  leads,
  properties,
  agents,
  loading = false,
  readOnlyParticipants = false,
}: SiteVisitFormFieldsProps) {
  if (loading) {
    return (
      <Grid container spacing={2} justifyContent="center" py={6}>
        <CircularProgress size={28} />
      </Grid>
    )
  }

  const hasLeads = leads.length > 0
  const hasProperties = properties.length > 0
  const hasAgents = agents.length > 0

  return (
    <Grid container spacing={2}>
      {!hasLeads && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning">No leads found. Add a lead first before scheduling a visit.</Alert>
        </Grid>
      )}
      {!hasProperties && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning">No properties found. Add a property before scheduling a visit.</Alert>
        </Grid>
      )}
      {!hasAgents && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="warning">No agents found. Add a user with agent/manager role first.</Alert>
        </Grid>
      )}

      <SectionTitle>Visit Participants</SectionTitle>
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
          disabled={!hasLeads || readOnlyParticipants}
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
            label: `${property.title} · ${property.locality || property.city} · ${capitalize(property.type)}`,
          }))}
          required
          disabled={!hasProperties || readOnlyParticipants}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormSelect
          name="agentId"
          control={control}
          label="Agent"
          placeholder="Select agent..."
          options={agents.map((agent) => ({
            value: agent.id,
            label: `${agent.firstName} ${agent.lastName} · ${capitalize(agent.role)}`,
          }))}
          required
          disabled={!hasAgents || readOnlyParticipants}
        />
      </Grid>

      <SectionTitle>Schedule</SectionTitle>
      <Grid size={{ xs: 12 }}>
        <FormTextField name="scheduledAt" control={control} label="Scheduled At" type="datetime-local" required />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormSelect name="status" control={control} label="Status" options={SITE_VISIT_STATUSES} required />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormTextField name="notes" control={control} label="Notes" multiline rows={3} />
      </Grid>
    </Grid>
  )
}
