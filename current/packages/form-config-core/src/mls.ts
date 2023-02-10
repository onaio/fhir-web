import { useTranslation as useOrigTranslation, UseTranslationOptions } from '@opensrp/i18n';

export const namespace = 'form-config-core';

export const useTranslation = (ns?: string, options?: UseTranslationOptions) => {
  return useOrigTranslation(ns ? ns : namespace, options);
};
