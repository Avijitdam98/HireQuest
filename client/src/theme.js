import { createTheme as createMuiTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode colors
          primary: {
            main: '#0284c7',
            light: '#38bdf8',
            dark: '#0369a1',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#14b8a6',
            light: '#5eead4',
            dark: '#0f766e',
            contrastText: '#ffffff',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
            alt: '#f1f5f9',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            muted: '#94a3b8',
          },
          divider: '#e2e8f0',
        }
      : {
          // Dark mode colors
          primary: {
            main: '#38bdf8',
            light: '#7dd3fc',
            dark: '#0284c7',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#5eead4',
            light: '#99f6e4',
            dark: '#14b8a6',
            contrastText: '#ffffff',
          },
          success: {
            main: '#34d399',
            light: '#6ee7b7',
            dark: '#10b981',
          },
          error: {
            main: '#f87171',
            light: '#fca5a5',
            dark: '#ef4444',
          },
          background: {
            default: '#020617', // Darkest background
            paper: '#0f172a',   // Dark paper
            alt: '#1e293b',     // Slightly lighter for hover/active states
          },
          text: {
            primary: '#f1f5f9',   // Very light gray for primary text
            secondary: '#e2e8f0', // Light gray for secondary text
            muted: '#94a3b8',    // Muted text for less emphasis
          },
          action: {
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
          },
          divider: '#334155',
        }),
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.1)',
    '0px 2px 4px rgba(15, 23, 42, 0.08)',
    '0px 4px 8px rgba(15, 23, 42, 0.08)',
    '0px 8px 16px rgba(15, 23, 42, 0.08)',
    '0px 16px 24px rgba(15, 23, 42, 0.08)',
    '0px 20px 32px rgba(15, 23, 42, 0.08)',
    '0px 24px 48px rgba(15, 23, 42, 0.08)',
    '0px 32px 64px rgba(15, 23, 42, 0.08)',
    '0px 40px 80px rgba(15, 23, 42, 0.08)',
    '0px 48px 96px rgba(15, 23, 42, 0.08)',
    '0px 56px 112px rgba(15, 23, 42, 0.08)',
    '0px 64px 128px rgba(15, 23, 42, 0.08)',
    '0px 72px 144px rgba(15, 23, 42, 0.08)',
    '0px 80px 160px rgba(15, 23, 42, 0.08)',
    '0px 88px 176px rgba(15, 23, 42, 0.08)',
    '0px 96px 192px rgba(15, 23, 42, 0.08)',
    '0px 104px 208px rgba(15, 23, 42, 0.08)',
    '0px 112px 224px rgba(15, 23, 42, 0.08)',
    '0px 120px 240px rgba(15, 23, 42, 0.08)',
    '0px 128px 256px rgba(15, 23, 42, 0.08)',
    '0px 136px 272px rgba(15, 23, 42, 0.08)',
    '0px 144px 288px rgba(15, 23, 42, 0.08)',
    '0px 152px 304px rgba(15, 23, 42, 0.08)',
    '0px 160px 320px rgba(15, 23, 42, 0.08)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
        contained: ({ theme }) => ({
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: theme.palette.mode === 'dark' 
              ? theme.palette.primary.light 
              : theme.palette.primary.dark,
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.mode === 'dark' 
            ? theme.palette.primary.light 
            : theme.palette.primary.main,
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[1],
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.background.paper 
            : '#ffffff',
        }),
      },
    },
  },
});

export const createTheme = (mode = 'light') => {
  return createMuiTheme(getDesignTokens(mode));
};

export default createTheme();