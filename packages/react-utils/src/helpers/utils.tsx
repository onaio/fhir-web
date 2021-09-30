import { Meta } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/meta';
import { Dictionary } from '@onaio/utils';
import type { i18n as i18nInstance } from 'i18next';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * Abstraction to add language resources to the i18n instance
 *
 * @param i18n the i18n instance
 * @param resources - an object that contains the resources
 */
export const loadLanguageResources = (i18n: i18nInstance | undefined, resources: Dictionary) => {
  Object.entries(resources).forEach(([language, nsObject]) => {
    Object.entries(nsObject).forEach(([ns, resource]) => {
      i18n?.addResourceBundle(language, ns, resource);
    });
  });
};

/** interface for FHIR response */
export interface FHIRResponse<T> {
  resourceType: string;
  id: string;
  meta?: Meta;
  type: string;
  total: number;
  link: { relation: string; url: string }[];
  entry: {
    fullUrl: string;
    resource: T;
    search: { mode: string };
  }[];
}
