/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Abstraction to add language resources to the i18n instance
 *
 * @param i18n the i18n instance
 * @param resources - an object that contains the resources
 */
export const loadLanguageResources = (i18n: any, resources: any) => {
  Object.entries(resources).forEach(([language, nsObject]) => {
    Object.entries(nsObject as any).forEach(([ns, resource]) => {
      i18n?.addResourceBundle(language, ns, resource);
    });
  });
};
