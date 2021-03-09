/** stores configuration for any other package */
import { createGlobalState } from 'react-hooks-global-state';

export type LanguageCode = 'en' | 'sw' | 'fr' | 'ar' | 'th';
export type ProjectLanguageCode = 'eusm' | 'core';

/** interface for configs for this package */
export interface ConfigState {
  languageCode?: LanguageCode;
  projectLanguageCode?: ProjectLanguageCode;
  appLoginURL?: string;
}

const initialConfigs = {
  languageCode: 'en' as LanguageCode,
  projectLanguageCode: 'core' as ProjectLanguageCode,
  appLoginURL: undefined,
};

const { useGlobalState, getGlobalState, setGlobalState } = createGlobalState<ConfigState>(
  initialConfigs
);

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
 * const language = getConfigs('languageCode');
 */
const setConfig = setGlobalState;

export { useGlobalConfigs, getConfig, setConfig };
