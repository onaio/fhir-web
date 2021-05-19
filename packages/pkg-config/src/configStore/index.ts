/** stores configuration for any other package */
import { createGlobalState } from 'react-hooks-global-state';
import { USER_PREFERENCE_KEY } from '../constants';

export type LanguageCode = 'en' | 'sw' | 'fr' | 'ar' | 'th';
export type ProjectLanguageCode = 'eusm' | 'core';
export type GlobalState = ConfigState & UserPreference;

export interface TableState {
  pagination?: {
    current?: number;
    pageSize?: number;
  };
}

/** interface for configs for this package */
export interface ConfigState {
  languageCode?: LanguageCode;
  projectLanguageCode?: ProjectLanguageCode;
  appLoginURL?: string;
  keycloakBaseURL?: string;
  opensrpBaseURL?: string;
  i18n?: unknown;
}

export interface UserPreference {
  tablespref?: Record<string, TableState>;
}

const DefaultConfigs: GlobalState = {
  languageCode: 'en',
  projectLanguageCode: 'core',
  appLoginURL: undefined,
  keycloakBaseURL: undefined,
  opensrpBaseURL: undefined,
  i18n: undefined,
  tablespref: undefined,
};

let localstorage: UserPreference = localStorage.getItem(USER_PREFERENCE_KEY)
  ? JSON.parse(localStorage.getItem(USER_PREFERENCE_KEY) as string)
  : {};

const {
  useGlobalState,
  getGlobalState,
  setGlobalState,
  ...unexposedGettersSetters
} = createGlobalState<GlobalState>({ ...DefaultConfigs, ...localstorage });

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
 * @param key name of the config to set
 * @param value value of the config to set
 *
 * @example
 * import {setConfig} from `'@opensrp/pkg-config'`;
 *
 * const language = setConfig('languageCode', 'fr');
 */
function setConfig<T extends keyof GlobalState>(key: T, value: GlobalState[T]) {
  const newstate: GlobalState = {};
  newstate[key] = value;
  saveToLocal(newstate);
  setGlobalState(key, value);
}

/** these properties are part of useGlobalState but the exposed type interface does not include them */
const otherGettersSetters = (unexposedGettersSetters as unknown) as {
  getState: () => GlobalState;
  setState: (nextGlobalState: GlobalState) => void;
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
 * @param value Object for setting all config values
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
function setAllConfigs(value: GlobalState) {
  saveToLocal(value);
  otherGettersSetters.setState(value);
}

/** internal function to save Value to Local Storage for later retrival
 *
 * @param config config to save to local storage
 */
function saveToLocal(config: GlobalState) {
  localstorage = { tablespref: config.tablespref };
  localStorage.setItem(USER_PREFERENCE_KEY, JSON.stringify(localstorage));
}

export { useGlobalConfigs, getConfig, setConfig, getAllConfigs, setAllConfigs };
