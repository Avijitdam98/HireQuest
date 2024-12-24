import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Logo = ({ showText = true, size = 'medium' }) => {
  const theme = useTheme();

  const sizes = {
    small: {
      icon: 24,
      text: '1rem',
    },
    medium: {
      icon: 32,
      text: '1.25rem',
    },
    large: {
      icon: 48,
      text: '1.5rem',
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        '&:hover .logo-icon': {
          animation: `${pulse} 1s ease-in-out infinite`,
        },
        '&:hover .logo-dot': {
          animation: `${rotate} 2s linear infinite`,
        },
      }}
    >
      <Box
        className="logo-icon"
        sx={{
          width: sizes[size].icon,
          height: sizes[size].icon,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 0 20px rgba(96, 165, 250, 0.3)' 
            : 'none',
        }}
      >
        <Box
          className="logo-dot"
          sx={{
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            bgcolor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
            position: 'absolute',
            top: '15%',
            right: '15%',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 0 10px rgba(255, 255, 255, 0.5)'
              : 'none',
          }}
        />
      </Box>
      {showText && (
        <Typography
          variant="h6"
          sx={{
            fontSize: sizes[size].text,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: theme.palette.mode === 'dark'
              ? '0 0 8px rgba(96, 165, 250, 0.3)'
              : 'none',
            letterSpacing: '-0.02em',
          }}
        >
          HireQuest
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
