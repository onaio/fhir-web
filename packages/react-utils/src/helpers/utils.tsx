import { Dictionary } from '@onaio/utils/dist/types/types';
import type { i18n as i18nInstance } from 'i18next';

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

/**
 * From T, convert a set of keys to required, that arr in the union K.
 */
export type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
