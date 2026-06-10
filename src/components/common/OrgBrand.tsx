import { Avatar, Box, Typography } from '@mui/material'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { useOrganizationStore } from '@/store/organizationStore'
import { getOrganizationDisplayName, getOrganizationLogo } from '@/utils/branding'

interface OrgBrandProps {
  showName?: boolean
  iconOnly?: boolean
  size?: 'sm' | 'md'
}

export function OrgBrand({ showName = true, iconOnly = false, size = 'md' }: OrgBrandProps) {
  const organization = useOrganizationStore((state) => state.organization)
  const name = getOrganizationDisplayName(organization)
  const logo = getOrganizationLogo(organization)
  const avatarSize = size === 'sm' ? 28 : 36

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
      {logo ? (
        <Avatar
          src={logo}
          alt={name}
          variant="rounded"
          sx={{ width: avatarSize, height: avatarSize, bgcolor: 'transparent' }}
        />
      ) : (
        <ApartmentIcon color="primary" sx={{ fontSize: avatarSize }} />
      )}
      {showName && !iconOnly && (
        <Typography variant={size === 'sm' ? 'body2' : 'subtitle1'} fontWeight={700} noWrap>
          {name}
        </Typography>
      )}
    </Box>
  )
}
