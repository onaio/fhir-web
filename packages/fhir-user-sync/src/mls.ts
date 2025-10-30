import { useTranslation as useOrigTranslation } from '@opensrp/i18n';

export const namespace = 'fhir-user-sync';

export const useTranslation = () => useOrigTranslation(namespace);
