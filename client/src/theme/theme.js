import { createTheme } from '@mui/material/styles';

// Common typography configuration
const typography = {
  fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};

// Common component overrides
const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        padding: '8px 20px',
        fontSize: '0.875rem',
        fontWeight: 500,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
      contained: {
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
};

// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#14B8A6',
      light: '#2DD4BF',
      dark: '#0D9488',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
      alt: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
    },
  },
  typography,
  components: {
    ...commonComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiCard.styleOverrides.root,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E7EB',
        },
      },
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#14B8A6',
      light: '#2DD4BF',
      dark: '#0D9488',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#111827',
      paper: '#1F2937',
      alt: '#374151',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    grey: {
      900: '#111827',
      800: '#1F2937',
      700: '#374151',
      600: '#4B5563',
      500: '#6B7280',
      400: '#9CA3AF',
    },
  },
  typography,
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111827',
          scrollbarColor: '#4B5563 #111827',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#111827',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4B5563',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...commonComponents.MuiCard.styleOverrides.root,
          backgroundColor: '#1F2937',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          border: '1px solid #374151',
        },
      },
    },
  },
});

export const createAppTheme = (mode = 'light') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};