/* eslint-disable @typescript-eslint/camelcase */
import { Meta } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/meta';
import { Dictionary } from '@onaio/utils';
import type { i18n as i18nInstance } from 'i18next';
import { deprecate } from 'util';
import path from 'path';
import glob from 'tiny-glob';

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

interface LoadLanguageResources {
  relativePathToResources: string;
  resourceObject: Dictionary;
}

// TODO - R&D if possible to lazy load the translations

// export const experimentalLanguageResource = (i18n: i18nInstance) => {
//   // assume that locales are stored in a single directory,
//   // assume that the name of the translation json file contains the locale code only

//   const thisPackLocaleFolder = path.resolve(process.cwd(), '../locales'); //configurable

//   // assumption locales are in folders with respect to their

//   (async function () {
//     const files = await glob(`${thisPackLocaleFolder}/*/*.json`);
//     const resources: Dictionary = {};
//     for (const file of files) {
//       const { dir, base } = path.parse(file);
//       const dirArray = dir.split(path.sep);
//       const localeFolder = dirArray[dirArray.length - 1];
//       if (localeFolder !== 'locales') {
//         resources[`${localeFolder}-${base}`] = require(file);
//         // eslint-disable-next-line @typescript-eslint/no-var-requires
//         i18n.addResourceBundle(base, '', require(file));
//       }
//     }
//     console.log(resources);
//   })().catch((_) => {
//     void 0;
//   });
// };

// TODO - R&D if possible to lazy load the translations

export const experimentalLanguageResource = (i18n: i18nInstance) => {
  // assume that locales are stored in a single directory,
  // assume that the name of the translation json file contains the locale code only

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const coreFrJson = require('../locales/core/fr.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const coreEnJson = require('../locales/core/en.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const coreArJson = require('../locales/core/ar.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const eusmEnJson = require('../locales/eusm/en.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const eusmFrJson = require('../locales/eusm/fr.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const eusmArJson = require('../locales/eusm/ar.json');

  const namespace = 'sd';

  // the format to load the resource files: <languageCode>_<projectCode>. in small
  const resources = {
    ar_core: {
      [namespace]: coreArJson,
    },
    ar_eusm: {
      [namespace]: eusmArJson,
    },
    fr_core: {
      [namespace]: coreFrJson,
    },
    fr_eusm: {
      [namespace]: eusmFrJson,
    },
    en_core: {
      [namespace]: coreEnJson,
    },
    en_eusm: {
      [namespace]: eusmEnJson,
    },
  };

  loadLanguageResources(i18n, resources);
};
