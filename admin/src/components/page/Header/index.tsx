// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import * as React from 'react';
import { RouteComponentProps, withRouter, useHistory } from 'react-router';
import { Layout, Avatar, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import './Header.css';
import { URL_LOGOUT, URL_USER_EDIT } from '../../../constants';
import { Dictionary } from '@onaio/utils';
import { BellOutlined } from '@ant-design/icons';
import { LanguageOptions, LanguageSwitcher } from '@opensrp/react-utils';
import { ENABLE_LANGUAGE_SWITCHER, SUPPORTED_LANGUAGES } from '../../../configs/env';
import { useTranslation } from '../../../mls';
import { getConfig, LanguageCode, setConfig } from '@opensrp/pkg-config';
import { APP_LOGIN_URL } from '../../../configs/dispatchConfig';
import { ButtonLink } from '@opensrp/react-utils';

/** interface for HeaderProps */
export interface HeaderProps extends RouteComponentProps {
  authenticated: boolean;
  user: User;
  extraData: { [key: string]: Dictionary };
}

/** default props for Header */
const defaultHeaderProps: Partial<HeaderProps> = {
  authenticated: false,
  user: {
    email: '',
    name: '',
    username: '',
  },
  extraData: {},
};

const languageOptions: LanguageOptions = {
  en: 'English',
  fr: 'Français',
};

/** handler called when language is changed
 *
 * @param languageCode - contains the languageOption.key of the selected language option
 */
const languageChangeHandlerFactory = (i18n: any) => (languageCode: string | number) => {
  const projectCode = getConfig('projectCode');
  if (languageCode) {
    const newLanguage = projectCode ? `${languageCode}-${projectCode}` : (languageCode as string);
    setConfig('languageCode', languageCode as LanguageCode);
    i18n.changeLanguage(newLanguage);
  }
};

/** The Header component */
export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { authenticated, user, extraData } = props;
  const { user_id } = extraData;
  const { t, i18n } = useTranslation();
  const history = useHistory();

  /** default enum of all possible language options */

  const languageChangeHandler = languageChangeHandlerFactory(i18n);
  const languageSwitcherProps = {
    value: i18n.language,
    onLanguageChange: languageChangeHandler,
    allLanguageOptions: languageOptions,
    supportedLanguages: SUPPORTED_LANGUAGES as LanguageCode[],
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <ButtonLink name={t('Logout')} route={URL_LOGOUT} />,
    },
    {
      key: '2',
      label: <ButtonLink name={t('Manage account')} route={`${URL_USER_EDIT}/${user_id}`} />,
    },
  ];

  return (
    <Layout.Header className="app-header txt-white align-items-center justify-content-end px-1 layout-header">
      {authenticated ? (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click', 'hover']}>
          <Button
            shape="circle"
            icon={
              <Avatar className="mr-1 bg-white" src={user.gravatar}>
                {user.username}
              </Avatar>
            }
            className="h-auto d-flex align-items-center bg-transparent border-0 rounded-0"
            size="large"
            type="primary"
          >
            {user.username}
          </Button>
        </Dropdown>
      ) : (
        <Button
          data-index="login-button"
          icon={<BellOutlined />}
          className="bg-transparent border-0"
          type="primary"
          onClick={() => history.push(APP_LOGIN_URL)}
        >
          {t('Login')}
        </Button>
      )}
      {ENABLE_LANGUAGE_SWITCHER && <LanguageSwitcher {...languageSwitcherProps} />}
    </Layout.Header>
  );
};

HeaderComponent.defaultProps = defaultHeaderProps;

const Header = withRouter(HeaderComponent);

export default Header;
