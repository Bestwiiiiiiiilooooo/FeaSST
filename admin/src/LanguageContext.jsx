import React, { createContext, useContext, useState } from 'react';
import translations from './i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('admin_language') || 'en';
  });
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('admin_language', newLanguage);
  };
  
  const t = (key) => {
    const translation = translations[language]?.[key];
    return translation || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 