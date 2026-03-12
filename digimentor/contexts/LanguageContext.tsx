'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/types';
import { translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved language preference from localStorage on mount
    try {
      const saved = localStorage.getItem('rebooted_language') as Language;
      if (saved === 'en' || saved === 'zh') {
        setLanguageState(saved);
      }
    } catch (error) {
      // localStorage might not be available (SSR, private browsing, etc.)
      console.warn('Failed to load language preference from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Persist language selection to localStorage
    try {
      localStorage.setItem('rebooted_language', lang);
    } catch (error) {
      // localStorage might not be available
      console.warn('Failed to save language preference to localStorage:', error);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
