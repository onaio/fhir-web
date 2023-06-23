/** globe icon with a dropdown where users can select language */
import React from 'react';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { LanguageCode } from '@opensrp/pkg-config';

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

  const languageChangeHandler: MenuProps['onClick'] = ({ key }) => {
    onLanguageChange?.(key);
  };

  const dropdownItems: MenuProps['items'] = [];

  for (const [languageCode, label] of Object.entries(supportedLanguageOptions)) {
    dropdownItems.push({
      key: languageCode,
      label: (<Button type="link">{label}</Button>),
    });
  }

  return (
    <Dropdown
      menu={{ items: dropdownItems, onClick: languageChangeHandler }}
      placement="bottomRight"
      trigger={['click', 'hover']}
    >
      <GlobalOutlined style={{ fontSize: '17px', color: 'white', margin: '10px' }} className="more-options" data-testid="more-options" />
    </Dropdown>
  );
};

LanguageSwitcher.defaultProps = defaultProps;

export { LanguageSwitcher };
  