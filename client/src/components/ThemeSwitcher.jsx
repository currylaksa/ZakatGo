import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Button from './Button';

/**
 * ThemeSwitcher component for testing different theme combinations
 * @returns {JSX.Element} ThemeSwitcher component
 */
const ThemeSwitcher = () => {
  const { updateTheme } = useTheme();

  // Predefined color schemes
  const colorSchemes = [
    { name: 'Dark Blue & Teal', primary: '#04364A', secondary: '#64CCC5' },
    { name: 'Purple & Gray', primary: '#8b5cf6', secondary: '#4b5563' },
    { name: 'Blue & Orange', primary: '#3b82f6', secondary: '#f97316' },
    { name: 'Red & Navy', primary: '#ef4444', secondary: '#1e3a8a' },
  ];

  const handleColorSchemeChange = (scheme) => {
    updateTheme({
      primary: scheme.primary,
      secondary: scheme.secondary,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-medium mb-2">Theme Switcher</h3>
      <div className="space-y-2">
        {colorSchemes.map((scheme) => (
          <div key={scheme.name} className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: scheme.primary }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: scheme.secondary }}
              ></div>
            </div>
            <button
              onClick={() => handleColorSchemeChange(scheme)}
              className="text-sm text-gray-700 hover:text-primary"
            >
              {scheme.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 