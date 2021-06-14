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

/**
 * Convert array of Object T to object with param key used for key of resultant object.
 *
 * @param array array of T to be converted
 * @param key key of T to used to the processed Object
 * @returns resultant Object
 */
export function convertToObject<T>(array: Array<T>, key: keyof T): Record<string, T> {
  return array.reduce((prev, item) => {
    const _key = item[key];
    if (typeof _key !== 'string') throw new Error('Key should be a string value');
    return { ...prev, [_key]: item };
  }, {}) as Record<string, T>;
}

/**
 * From T, convert a set of keys to required, that arr in the union K.
 */
export type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
