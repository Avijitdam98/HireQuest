import { useState, useEffect } from 'react';

export const useThemeMode = () => {
  const [mode, setMode] = useState(() => {
    // Check if theme preference is saved in localStorage
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    // Save theme preference to localStorage when it changes
    localStorage.setItem('themeMode', mode);
    // Update body class for global theme styling
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return { mode, toggleTheme };
};
