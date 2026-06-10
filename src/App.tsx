import { useEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { router } from '@/routes'
import { useThemeStore } from '@/store/themeStore'
import { createAppTheme } from '@/theme'
import { useOrganizationStore } from '@/store/organizationStore'
import { applyOrganizationBranding } from '@/utils/branding'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

export default function App() {
  const { mode } = useThemeStore()
  const organization = useOrganizationStore((state) => state.organization)
  const theme = useMemo(() => createAppTheme(mode), [mode])

  useEffect(() => {
    applyOrganizationBranding(organization)
  }, [organization])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
