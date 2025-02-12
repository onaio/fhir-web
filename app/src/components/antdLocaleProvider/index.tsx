import React, { createContext, useState } from 'react';
import { ConfigProvider } from 'antd';
import { LanguageCode } from '@opensrp/pkg-config';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import type { Locale } from 'antd/es/locale';
import { opensrpI18nInstance } from '@opensrp/i18n';

const defaultContext = {
  setLocale: (_: LanguageCode) => {},
};

export const LocaleContext = createContext<{
  locale?: LanguageCode;
  setLocale: (code: LanguageCode) => void;
}>(defaultContext);

const antdLanguageLocaleLookup: Partial<Record<LanguageCode, Locale>> = {
  en: enUS,
  fr: frFR,
};

export const AntdLocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configuredLanguage = opensrpI18nInstance.language;
  const languageCodePart = configuredLanguage?.split('-')?.[0] as LanguageCode | undefined;
  const [locale, setLocale] = useState<LanguageCode | undefined>(languageCodePart);
  const antdLanguage = locale ? antdLanguageLocaleLookup[locale] : enUS;

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ConfigProvider locale={antdLanguage}>{children}</ConfigProvider>
    </LocaleContext.Provider>
  );
};
