import { Dictionary } from '@onaio/utils';
import type { i18n as i18nInstance } from 'i18next';
import { getConfig, LanguageCode, ProjectLanguageCode } from '@opensrp/pkg-config';

export type LanguageResourceGroups = {
  [plc in ProjectLanguageCode]?: {
    [lc in LanguageCode]?: Dictionary;
  };
};

/**
 * generate resource key when adding a resource bundle to i18n, only core resources
 * are added if no project resource is configured.
 *
 * This means other web projects that use these packages are not forced to specify a
 * projectLanguageCode if it does not apply to them
 *
 * @param resourceGroups - tuple pair from which to generate the resource object from
 */
export const generateLangRes = (resourceGroups: LanguageResourceGroups) => {
  const configuredProjectLanguageCode = getConfig('projectLanguageCode');
  const finalResourceObj: Dictionary = {};
  Object.entries(resourceGroups).forEach(([projectLanguageCode, languageResource]) => {
    Object.entries(languageResource).forEach(([languageCode, resourceObj]) => {
      const projectLanguageCodeLower = projectLanguageCode.toLowerCase();
      const languageCodeLower = languageCode.toLowerCase();
      if (configuredProjectLanguageCode === undefined && projectLanguageCode === 'core') {
        finalResourceObj[languageCodeLower] = resourceObj;
      }
      if (configuredProjectLanguageCode !== undefined) {
        const resourceKey = `${languageCodeLower}_${projectLanguageCodeLower}`;
        finalResourceObj[resourceKey] = resourceObj;
      }
    });
  });
  return finalResourceObj;
};

/**
 * Abstraction to add language resources to the i18n instance
 *
 * @param i18n the i18n instance
 * @param resourceGroups - an object that contains the resources
 * @param ns - the namespace used to register this resource bundle
 */
export const loadLanguageResources = (
  i18n: i18nInstance | undefined,
  resourceGroups: LanguageResourceGroups,
  ns: string
) => {
  const resources = generateLangRes(resourceGroups);
  Object.entries(resources).forEach(([resourceKey, resourceObj]) => {
    i18n?.addResourceBundle(resourceKey, ns, resourceObj);
  });
};
