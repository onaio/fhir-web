/** stores configuration for any other package */
import { createGlobalState } from 'react-hooks-global-state';

export type LanguageCode = 'en' | 'sw' | 'fr' | 'ar' | 'th';
export type ProjectLanguageCode = 'eusm' | 'core';

/** interface for configs for this package */
export interface ConfigState {
  languageCode?: LanguageCode;
  projectLanguageCode?: ProjectLanguageCode;
  appLoginURL?: string;
  keycloakBaseURL?: string;
  opensrpBaseURL?: string;
  fhirBaseURL?: string;
  i18n?: unknown;
}

const initialConfigs = {
  languageCode: 'en' as LanguageCode,
  projectLanguageCode: 'core' as ProjectLanguageCode,
  appLoginURL: undefined,
  keycloakBaseURL: undefined,
  opensrpBaseURL: undefined,
  fhirBaseURL: undefined,
  i18n: undefined,
};

const {
  useGlobalState,
  getGlobalState,
  setGlobalState,
  ...unexposedGettersSetters
} = createGlobalState<ConfigState>(initialConfigs);

/** hook to get and update values in the config store
 *
 * @example
 * import { useGlobalConfigs } from `'@opensrp/pkg-config'`;
 *
 * const Component = () => {
 *   const [language, setLanguage] = useGlobalConfigs('languageCode');
 *   ...
 * };
 */
const useGlobalConfigs = useGlobalState;

/** function to get config values outside of React
 *
 * @example
 * import {getConfig} from `"@opensrp/pkg-config"`;
 *
 * const language = getConfig('languageCode');
 */
const getConfig = getGlobalState;

/** function to set config values outside of React
 *
 * @example
 * import {setConfig} from `'@opensrp/pkg-config'`;
 *
 * const language = setConfig('languageCode', 'fr');
 */
const setConfig = setGlobalState;

/** these properties are part of useGlobalState but the exposed type interface does not include them */
const otherGettersSetters = (unexposedGettersSetters as unknown) as {
  getState: () => ConfigState;
  setState: (nextGlobalState: ConfigState) => void;
};

/** function to get all config values outside of React
 *
 * @example
 * import {getAllConfigs} from `'@opensrp/pkg-config'`;
 *
 * const allConfigs = getAllConfigs();;
 */
const getAllConfigs = otherGettersSetters.getState;

/** function to get all config values outside of React
 *
 * @example
 * import {setAllConfigs} from `'@opensrp/pkg-config'`;
 *
 * const configs = {
 *  languageCode: 'en',
 *  projectLanguageCode: 'core',
 * }
 *
 * const allConfigs = setAllConfigs(configs);
 */
const setAllConfigs = otherGettersSetters.setState;

export { useGlobalConfigs, getConfig, setConfig, getAllConfigs, setAllConfigs };
