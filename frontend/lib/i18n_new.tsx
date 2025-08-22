'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Define messages inline since JSON imports may not exist
const enMessages = {
  nav: {
    home: "Home",
    dashboard: "Dashboard",
    projects: "Projects", 
    login: "Login",
    register: "Sign Up",
    logout: "Logout",
    language: "Language"
  }
};

const arMessages = {
  nav: {
    home: "الرئيسية",
    dashboard: "لوحة التحكم", 
    projects: "المشاريع",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    language: "اللغة"
  }
};

export type Locale = 'en' | 'ar';

const messages = {
  en: enMessages,
  ar: arMessages,
};

interface I18nContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  t: (key: string) => any;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  fontClass: string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  changeLocale: () => {},
  t: (key) => key,
  isRTL: false,
  dir: 'ltr',
  fontClass: 'font-en'
});

export { I18nContext };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ar');

  useEffect(() => {
    // Check localStorage for saved language
    const savedLanguage = localStorage.getItem('language') as Locale;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLocale(savedLanguage);
    }
  }, []);

  // Update HTML attributes when locale changes
  useEffect(() => {
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const fontClass = locale === 'ar' ? 'font-ar' : 'font-en';
    
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.body.className = `${fontClass} transition-all duration-300`;
  }, [locale]);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = messages[locale] || messages.en;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value;
  };

  const contextValue: I18nContextType = {
    locale,
    changeLocale,
    t,
    isRTL: locale === 'ar',
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    fontClass: locale === 'ar' ? 'font-ar' : 'font-en',
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }
  return context;
}
