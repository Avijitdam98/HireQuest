import { createTheme as createMuiTheme } from '@mui/material/styles';

// Base theme configuration with shared styles
const baseTheme = {
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
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
};

// Theme customization based on mode (light/dark)
export const createTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  
  return createMuiTheme({
    ...baseTheme,
    palette: {
      mode,
      primary: {
        main: isLight ? '#0284c7' : '#60a5fa',
        light: isLight ? '#38bdf8' : '#93c5fd',
        dark: isLight ? '#0369a1' : '#2563eb',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isLight ? '#14b8a6' : '#a78bfa',
        light: isLight ? '#5eead4' : '#c4b5fd',
        dark: isLight ? '#0f766e' : '#7c3aed',
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
        default: isLight ? '#f8fafc' : '#0f172a',
        paper: isLight ? '#ffffff' : '#1e293b',
        alt: isLight ? '#f1f5f9' : '#1e293b',
      },
      text: {
        primary: isLight ? '#0f172a' : '#f1f5f9',
        secondary: isLight ? '#475569' : '#94a3b8',
        muted: '#94a3b8',
      },
      divider: isLight ? '#e2e8f0' : 'rgba(148, 163, 184, 0.12)',
      action: {
        hover: isLight ? 'rgba(37, 99, 235, 0.04)' : 'rgba(96, 165, 250, 0.08)',
        selected: isLight ? 'rgba(37, 99, 235, 0.08)' : 'rgba(96, 165, 250, 0.16)',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#f8fafc' : '#0f172a',
            margin: 0,
            padding: 0,
            scrollbarColor: isLight ? '#cbd5e1 #f1f5f9' : '#475569 #1e293b',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight ? '#f1f5f9' : '#1e293b',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isLight ? '#cbd5e1' : '#475569',
              borderRadius: '4px',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            color: isLight ? '#0f172a' : '#f8fafc',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            borderRight: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isLight
              ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight
                ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 20px',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            fontWeight: 500,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: isLight ? '#2563eb' : '#60a5fa',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: isLight ? 'rgba(37, 99, 235, 0.04)' : 'rgba(96, 165, 250, 0.08)',
            },
            '&.Mui-selected': {
              backgroundColor: isLight ? 'rgba(37, 99, 235, 0.08)' : 'rgba(96, 165, 250, 0.16)',
              '&:hover': {
                backgroundColor: isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(96, 165, 250, 0.24)',
              },
            },
          },
        },
      },
    },
  });
};

export default createTheme();