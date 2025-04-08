import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="bg-white text-gray-800 rounded-full shadow-lg px-3 py-1.5 flex items-center space-x-2 hover:bg-gray-50 transition-colors"
      aria-label={language === 'en' ? 'Switch to Bahasa Melayu' : 'Switch to English'}
    >
      <span className={`text-sm font-medium ${language === 'en' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
        EN
      </span>
      <span className="text-gray-300">|</span>
      <span className={`text-sm font-medium ${language === 'my' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
        MY
      </span>
    </button>
  );
};

export default LanguageToggle; 