/** globe icon with a dropdown where users can select language */
import React, { SetStateAction } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { getConfig, LanguageCode, setConfig } from '@opensrp/pkg-config';
import { SUPPORTED_LANGUAGES } from '../../../configs/env';
import i18n from '../../../mls';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

/** describes object representation of language options */
export type LanguageOptions = {
  [key in LanguageCode]?: string;
};

/** enum of all possible language options */
export const languageOptions: LanguageOptions = {
  en: 'English',
  fr: 'Français',
};

/** returns options that are allowed with respect to configured env */
const getSupportedLanguageOptions = () => {
  const supported: LanguageOptions = {};
  Object.keys(languageOptions).forEach((languageCode) => {
    if (SUPPORTED_LANGUAGES.includes(languageCode)) {
      const code = languageCode as LanguageCode;
      supported[code] = languageOptions[code];
    }
  });
  return supported;
};

const supportedLanguageOptions = getSupportedLanguageOptions();

/** handler for when language changes
 * changes the configs and changes the language on the i18n instance
 */
const languageChangeHandler: MenuClickEventHandler = ({ key }) => {
  const projectLanguageCode = getConfig('projectLanguageCode');
  const newLanguage = `${key}_${projectLanguageCode}`;
  setConfig('languageCode', key as SetStateAction<LanguageCode | undefined>);
  i18n.changeLanguage(newLanguage);
};

const menu = (
  <Menu onClick={languageChangeHandler}>
    {Object.entries(supportedLanguageOptions).map(([languageCode, label]) => {
      return <Menu.Item key={languageCode}>{label}</Menu.Item>;
    })}
  </Menu>
);

const LanguageSwitcher = () => {
  return (
    <Dropdown overlay={menu} placement="bottomRight">
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
