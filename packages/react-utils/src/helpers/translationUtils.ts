import { Dictionary } from '@onaio/utils';
import type { i18n as i18nInstance } from 'i18next';
import { getConfig, LanguageCode, ProjectLanguageCode } from '@opensrp/pkg-config';

export type LanguageResourceTuples = Array<[LanguageCode, ProjectLanguageCode, Dictionary]>;

/**
 * generate resource key when adding a resource bundle to i18n, only core resources
 * are added if no project resource is configured.
 *
 * This means other web projects that use these packages are not forced to specify a
 * projectLanguageCode if it does not apply to them
 *
 * @param resourceTuple - tuple pair from which to generate the resource object from
 */
export const generateLangRes = (resourceTuple: LanguageResourceTuples) => {
  const configuredProjectLanguageCode = getConfig('projectLanguageCode');
  const finalResourceObj: Dictionary = {};
  for (const eachResource of resourceTuple) {
    const languageCode = eachResource[0].toLowerCase();
    const projectLanguageCode = eachResource[1].toLowerCase();
    const resourceKey = `${languageCode}_${projectLanguageCode}`;
    const resourceObj = eachResource[2];
    // the format to load the resource files: <languageCode>[_<projectCode>].
    if (configuredProjectLanguageCode !== undefined) {
      finalResourceObj[resourceKey] = resourceObj;
    } else if (projectLanguageCode === 'core') {
      finalResourceObj[languageCode] = resourceObj;
    }
  }
  return finalResourceObj;
};

/**
 * Abstraction to add language resources to the i18n instance
 *
 * @param i18n the i18n instance
 * @param resources - an object that contains the resources
 * @param ns - the namespace used to register this resource bundle
 */
export const loadLanguageResources = (
  i18n: i18nInstance | undefined,
  resources: Dictionary,
  ns: string
) => {
  Object.entries(resources).forEach(([resourceKey, resourceObj]) => {
    i18n?.addResourceBundle(resourceKey, ns, resourceObj);
  });
};
