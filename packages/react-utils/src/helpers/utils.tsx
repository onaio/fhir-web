import { Dictionary } from '@onaio/utils';
import type { i18n as i18nInstance } from 'i18next';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

/**
 * From T, convert a set of keys to optional, that are in the union K.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * From T, convert a set of keys to required, that are in the union K.
 */
export type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

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
 * @param bundle - a fhir resource bundle api response
 */
export function getResourcesFromBundle<TResource>(bundle: IBundle) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const temp = bundle.entry?.filter((x) => x !== undefined);
  const rtn = temp?.map((e) => e.resource as TResource) ?? [];
  return rtn;
}
