import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { AppFooter } from './AppFooter'
import { OrganizationBootstrap } from './OrganizationBootstrap'
import { useSidebarStore } from '@/store/sidebarStore'
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '@/utils/constants'

export function AppLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { isCollapsed } = useSidebarStore()

  const sidebarWidth = isMobile ? 0 : isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  return (
    <Box display="flex" minHeight="100vh">
      <OrganizationBootstrap />
      <Sidebar />
      <Box
        component="main"
        flex={1}
        display="flex"
        flexDirection="column"
        sx={{
          width: `calc(100% - ${sidebarWidth}px)`,
          transition: theme.transitions.create('width'),
        }}
      >
        <TopNavbar />
        <Box
          flex={1}
          p={{ xs: 2, sm: 3 }}
          sx={{ bgcolor: 'background.default', overflow: 'auto' }}
        >
          <Outlet />
        </Box>
        <AppFooter />
      </Box>
    </Box>
  )
}
