/** globe icon with a dropdown where users can select language */
import React, { SetStateAction } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { getConfig, LanguageCode, setConfig } from '@opensrp/pkg-config';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import type { i18n as i18nInstance } from 'i18next';

/** describes object representation of language options */
export type LanguageOptions = {
  [key in LanguageCode]?: string;
};

interface LanguageSwitcherProps {
  fullLanguageOptions: LanguageOptions;
  supportedLanguages: LanguageCode[];
  i18n: i18nInstance;
}

/** default enum of all possible language options */
export const languageOptions: LanguageOptions = {
  en: 'English',
  fr: 'Français',
};

/** returns section of all the options that will be rendered as option in the ui
 * 
 * @param languageOptions - a map of all allowed language options
 * @param supportedLanguages - an array of the keys for options that will be displayed
*/
function getSupportedLanguageOptions  (
  languageOptions: LanguageOptions,
  supportedLanguages?: LanguageCode[]
) {
  const supported: LanguageOptions = {};
  const supportedLangIsDefined = supportedLanguages;
  if (!supportedLangIsDefined) {
    return languageOptions;
  }
  Object.keys(languageOptions).forEach((languageCode) => {
    if (supportedLanguages?.includes(languageCode as LanguageCode)) {
      const code = languageCode as LanguageCode;
      supported[code] = languageOptions[code];
    }
  });
  return supported;
};

const LanguageSwitcher = (props: LanguageSwitcherProps) => {
  const { i18n, fullLanguageOptions, supportedLanguages } = props;

  const supportedLanguageOptions = getSupportedLanguageOptions(fullLanguageOptions, supportedLanguages);

  /** handler for when language changes
   * changes the configs and changes the language on the i18n instance
   */
  const languageChangeHandler: MenuClickEventHandler = ({ key }) => {
    const projectLanguageCode = getConfig('projectLanguageCode');
    const newLanguage = `${key}_${projectLanguageCode}`;
    setConfig('languageCode', key as SetStateAction<LanguageCode | undefined>);
    i18n.changeLanguage(newLanguage);
  };

  const LangMenu = (
    <Menu onClick={languageChangeHandler}>
      {Object.entries(supportedLanguageOptions).map(([languageCode, label]) => {
        return <Menu.Item key={languageCode}>{label}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <Dropdown overlay={LangMenu} placement="bottomRight">
      <Button
        onClick={(e) => e.preventDefault()}
        shape="circle"
        icon={<GlobalOutlined />}
        style={{
          background: 'transparent',
          border: 0,
        }}
        type="primary"
      />
    </Dropdown>
  );
};

export { LanguageSwitcher };
