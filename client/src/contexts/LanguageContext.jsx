import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Safe check for browser environment
const isBrowser = typeof window !== 'undefined';

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to 'en', with SSR safety check
  const [language, setLanguage] = useState(() => {
    if (isBrowser) {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage || 'en';
    }
    return 'en'; // Default for SSR
  });

  // Create translations object based on current language
  const t = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  // Save to localStorage whenever language changes - only in browser
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('language', language);
      // Add a data attribute to the HTML element for potential CSS targeting
      document.documentElement.setAttribute('data-language', language);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'my' : 'en');
  };

  // Create a stable context value with both language and translations
  const contextValue = useMemo(() => ({
    language,
    toggleLanguage,
    t  // This provides direct access to translations
  }), [language, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};