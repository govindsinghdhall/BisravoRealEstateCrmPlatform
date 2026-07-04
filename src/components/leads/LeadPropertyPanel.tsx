import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { getErrorMessage } from '@/api/client'
import { leadPropertiesService } from '@/api/services'
import { invalidateListQueries } from '@/api/utils/query'
import { capitalize, formatCurrency } from '@/utils/formatters'
import type { LeadPropertyInterestLevel } from '@/types'

const INTEREST_LEVELS: LeadPropertyInterestLevel[] = [
  'INTERESTED',
  'SHORTLISTED',
  'VIEWED',
  'SUGGESTED',
  'REJECTED',
]

interface LeadPropertyPanelProps {
  leadId: number
  primaryPropertyTitle?: string
}

function MatchScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'inherit'
  return (
    <Box sx={{ minWidth: 120 }}>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" color="text.secondary">
          Match
        </Typography>
        <Typography variant="caption" fontWeight={700}>
          {score}%
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={score} color={color} sx={{ height: 6, borderRadius: 999 }} />
    </Box>
  )
}

export function LeadPropertyPanel({ leadId, primaryPropertyTitle }: LeadPropertyPanelProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const queryClient = useQueryClient()

  const { data: suggestions = [], isLoading: suggestionsLoading } = useQuery({
    queryKey: ['lead-property-suggestions', leadId],
    queryFn: () => leadPropertiesService.getSuggestions(leadId, 8),
  })

  const { data: linked = [], isLoading: linkedLoading } = useQuery({
    queryKey: ['lead-linked-properties', leadId],
    queryFn: () => leadPropertiesService.getLinked(leadId),
  })

  const invalidate = async () => {
    await invalidateListQueries(queryClient, ['lead', String(leadId)])
    await queryClient.invalidateQueries({ queryKey: ['lead-property-suggestions', leadId] })
    await queryClient.invalidateQueries({ queryKey: ['lead-linked-properties', leadId] })
    await invalidateListQueries(queryClient, ['leads'])
  }

  const linkMutation = useMutation({
    mutationFn: (input: { propertyId: number; isPrimary?: boolean; matchScore?: number }) =>
      leadPropertiesService.link(leadId, {
        propertyId: input.propertyId,
        isPrimary: input.isPrimary,
        interestLevel: 'INTERESTED',
        matchScore: input.matchScore,
      }),
    onSuccess: invalidate,
  })

  const primaryMutation = useMutation({
    mutationFn: (propertyId: number) =>
      leadPropertiesService.updateLink(leadId, propertyId, { isPrimary: true, interestLevel: 'SHORTLISTED' }),
    onSuccess: invalidate,
  })

  const interestMutation = useMutation({
    mutationFn: (input: { propertyId: number; interestLevel: LeadPropertyInterestLevel }) =>
      leadPropertiesService.updateLink(leadId, input.propertyId, { interestLevel: input.interestLevel }),
    onSuccess: invalidate,
  })

  const unlinkMutation = useMutation({
    mutationFn: (propertyId: number) => leadPropertiesService.unlink(leadId, propertyId),
    onSuccess: invalidate,
  })

  const mutationError =
    linkMutation.error || primaryMutation.error || interestMutation.error || unlinkMutation.error

  const primaryLink = linked.find((item) => item.isPrimary) ?? linked[0]

  return (
    <SectionCard
      title="Property Matching"
      subtitle="Suggested listings and linked properties for this buyer"
    >
      {mutationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(mutationError)}
        </Alert>
      )}

      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: isDark ? alpha('#1565C0', 0.08) : '#F0F7FF',
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          Primary Property Interest
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          <HomeWorkOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="body1" fontWeight={700}>
            {primaryLink?.property?.title || primaryPropertyTitle || 'No property linked yet'}
          </Typography>
          {primaryLink?.property && (
            <Chip
              size="small"
              label={formatCurrency(primaryLink.property.price)}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>
      </Box>

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinkOutlinedIcon fontSize="small" />
        Linked Properties ({linked.length})
      </Typography>

      {linkedLoading ? (
        <LinearProgress sx={{ mb: 3 }} />
      ) : linked.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          No properties linked yet. Use suggestions below to connect suitable listings.
        </Typography>
      ) : (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {linked.map((link) => (
            <Box
              key={link.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: link.isPrimary ? 'primary.main' : 'divider',
                bgcolor: isDark ? alpha('#fff', 0.02) : '#FAFBFC',
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                    <Typography variant="body2" fontWeight={700}>
                      {link.property?.title || `Property #${link.propertyId}`}
                    </Typography>
                    {link.isPrimary && (
                      <Chip size="small" icon={<StarOutlineIcon />} label="Primary" color="primary" />
                    )}
                    {link.matchScore != null && (
                      <Chip size="small" label={`${link.matchScore}% match`} variant="outlined" />
                    )}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    {[link.property?.locality, link.property?.city].filter(Boolean).join(' · ')}
                    {link.property?.price ? ` · ${formatCurrency(link.property.price)}` : ''}
                  </Typography>
                </Box>

                <TextField
                  select
                  size="small"
                  label="Interest"
                  value={link.interestLevel}
                  onChange={(e) =>
                    interestMutation.mutate({
                      propertyId: link.propertyId,
                      interestLevel: e.target.value as LeadPropertyInterestLevel,
                    })
                  }
                  sx={{ minWidth: 150 }}
                >
                  {INTEREST_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {capitalize(level)}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack direction="row" spacing={1}>
                  {!link.isPrimary && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => primaryMutation.mutate(link.propertyId)}
                      disabled={primaryMutation.isPending}
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => unlinkMutation.mutate(link.propertyId)}
                    disabled={unlinkMutation.isPending}
                  >
                    Unlink
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeOutlinedIcon fontSize="small" color="secondary" />
        Suggested Properties
      </Typography>

      {suggestionsLoading ? (
        <LinearProgress />
      ) : suggestions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No matching properties found. Add budget, location, and property type requirements to improve suggestions.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {suggestions.map(({ property, matchScore, matchReasons }) => (
            <Box
              key={property.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                    <Typography variant="body2" fontWeight={700}>
                      {property.title}
                    </Typography>
                    <StatusBadge status={property.status} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                    {[property.locality, property.city].filter(Boolean).join(' · ')} · {formatCurrency(property.price)}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" mt={1}>
                    {matchReasons.slice(0, 3).map((reason) => (
                      <Chip key={reason} size="small" label={reason} variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <MatchScoreBar score={matchScore} />
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LinkOutlinedIcon />}
                  onClick={() =>
                    linkMutation.mutate({
                      propertyId: Number(property.id),
                      isPrimary: linked.length === 0,
                      matchScore,
                    })
                  }
                  disabled={linkMutation.isPending}
                >
                  Link to Lead
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </SectionCard>
  )
}
