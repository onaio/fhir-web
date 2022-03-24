/** globe icon with a dropdown where users can select language */
import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { LanguageCode } from '@opensrp/pkg-config';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

/** describes object representation of language options */
export type LanguageOptions = {
  [key in LanguageCode]?: string;
};

interface LanguageSwitcherProps {
  allLanguageOptions: LanguageOptions;
  supportedLanguages: LanguageCode[];
  onLanguageChange?: (languageOptionKey: string | number) => void;
}

const defaultProps = {
  allLanguageOptions: {},
  supportedLanguages: [],
};

/**
 * returns section of all the options that will be rendered as option in the ui
 *
 * @param languageOptions - a map of all allowed language options
 * @param supportedLanguages - an array of the keys for options that will be displayed
 */
function getSupportedLanguageOptions(
  languageOptions: LanguageOptions,
  supportedLanguages?: LanguageCode[]
) {
  const supported: LanguageOptions = {};
  const supportedLangIsDefined = supportedLanguages && supportedLanguages.length > 0;
  if (!supportedLangIsDefined) {
    return supported;
  }
  Object.keys(languageOptions).forEach((languageCode) => {
    if (supportedLanguages.includes(languageCode as LanguageCode)) {
      const code = languageCode as LanguageCode;
      supported[code] = languageOptions[code];
    }
  });
  return supported;
}

/**
 * globe icon ui that can be used to change the language of the application
 *
 * @param props - component props
 */
const LanguageSwitcher = (props: LanguageSwitcherProps) => {
  const { onLanguageChange, allLanguageOptions: fullLanguageOptions, supportedLanguages } = props;

  const supportedLanguageOptions = getSupportedLanguageOptions(
    fullLanguageOptions,
    supportedLanguages
  );

  const languageChangeHandler: MenuClickEventHandler = ({ key }) => {
    onLanguageChange?.(key);
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

LanguageSwitcher.defaultProps = defaultProps;

export { LanguageSwitcher };
