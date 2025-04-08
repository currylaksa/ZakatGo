import React, { createContext, useContext, useState } from 'react';
import theme from '../utils/theme';

// Create context
const ThemeContext = createContext();

/**
 * ThemeProvider component for managing theme state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ThemeProvider component
 */
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState({
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    neutral: theme.colors.neutral,
  });

  /**
   * Update theme colors
   * @param {Object} newColors - New theme colors
   */
  const updateTheme = (newColors) => {
    setCurrentTheme(prevTheme => ({
      ...prevTheme,
      ...newColors,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * @returns {Object} Theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 