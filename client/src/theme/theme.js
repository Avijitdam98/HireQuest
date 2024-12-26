import { createTheme } from '@mui/material/styles';

// Light theme configuration
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0A66C2',
      light: '#1F77D4',
      dark: '#004182',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#70B5F9',
      light: '#9CCCFA',
      dark: '#5A91C7',
      contrastText: '#1D2226',
    },
    background: {
      default: '#f3f2ef',
      paper: '#ffffff',
      alt: '#f8fafc',
    },
    text: {
      primary: '#000000E6',
      secondary: '#666666',
    },
  },
});

// Dark theme configuration
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A66C2',
      light: '#1F77D4',
      dark: '#004182',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#70B5F9',
      light: '#9CCCFA',
      dark: '#5A91C7',
      contrastText: '#1D2226',
    },
    background: {
      default: '#1D2226',
      paper: '#282E33',
      alt: '#333B43',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B7BF',
      disabled: '#646D76',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1D2226',
          scrollbarColor: '#404040 #1D2226',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1D2226',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#404040',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#282E33',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: '6px 16px',
        },
      },
    },
  },
});

export const createAppTheme = (mode = 'light') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
