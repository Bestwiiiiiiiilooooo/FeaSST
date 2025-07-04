import React, { createContext, useContext } from 'react';
import translations from './i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const language = localStorage.getItem('admin_language') || 'en';
  const t = (key) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 