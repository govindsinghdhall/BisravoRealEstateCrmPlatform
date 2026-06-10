import { createTheme, type ThemeOptions } from '@mui/material/styles'

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00897B',
      light: '#4DB6AC',
      dark: '#00695C',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'light' ? '#F4F6F8' : '#0F1419',
      paper: mode === 'light' ? '#FFFFFF' : '#1A2332',
    },
    text: {
      primary: mode === 'light' ? '#1A2332' : '#E8EDF2',
      secondary: mode === 'light' ? '#5A6A7E' : '#8B9CB3',
    },
    divider: mode === 'light' ? '#E2E8F0' : '#2A3544',
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#D32F2F' },
    info: { main: '#0288D1' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            mode === 'light'
              ? '0 1px 3px rgba(0,0,0,0.08)'
              : '0 1px 3px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', borderBottom: '1px solid' },
      },
    },
  },
})

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode))
