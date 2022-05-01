// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Menu, Layout, Avatar, Button, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import './Header.css';
import { URL_LOGOUT, URL_REACT_LOGIN, URL_USER_EDIT } from '../../../constants';
import { Dictionary } from '@onaio/utils';
import { BellOutlined } from '@ant-design/icons';
import { LanguageOptions, LanguageSwitcher } from '@opensrp/react-utils';
import { ENABLE_LANGUAGE_SWITCHER, SUPPORTED_LANGUAGES } from '../../../configs/env';
import {useTranslation} from '../../../mls';
import { getConfig, LanguageCode, setConfig } from '@opensrp/pkg-config';

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
  if(languageCode){
    const newLanguage = projectCode ? `${languageCode}_${projectCode}` : languageCode as string;
    setConfig('languageCode', languageCode as LanguageCode);
    i18n.changeLanguage(newLanguage);
  }
};

/** The Header component */
export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { authenticated, user, extraData } = props;
  const { user_id } = extraData;
  const { t, i18n } = useTranslation();

  /** default enum of all possible language options */

  const languageChangeHandler = languageChangeHandlerFactory(i18n);
  const languageSwitcherProps = {
    value: i18n.language,
    onLanguageChange: languageChangeHandler,
    allLanguageOptions: languageOptions,
    supportedLanguages: SUPPORTED_LANGUAGES as LanguageCode[],
  };
  return (
    <Layout.Header className="app-header txt-white align-items-center justify-content-end px-1 layout-header">
      {authenticated ? (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key={URL_LOGOUT}>
                <Link to={URL_LOGOUT}>{t('Logout')}</Link>
              </Menu.Item>
              <Menu.Item key={`${URL_USER_EDIT}/${user_id}`}>
                <Link to={`${URL_USER_EDIT}/${user_id}`}>{t('Manage account')}</Link>
              </Menu.Item>
            </Menu>
          }
          placement="bottomRight"
        >
          <Button
            shape="circle"
            icon={
              <Avatar className="mr-1 bg-white" src={user.gravatar}>
                {user.username}
              </Avatar>
            }
            className="h-auto d-flex align-items-center bg-transparent border-0 rounded-0"
            type="primary"
          >
            {user.username}
          </Button>
        </Dropdown>
      ) : (
        <Button icon={<BellOutlined />} className="bg-transparent border-0" type="primary">
          <Link to={URL_REACT_LOGIN}>{t('Login')}</Link>
        </Button>
      )}
      {ENABLE_LANGUAGE_SWITCHER && <LanguageSwitcher {...languageSwitcherProps} />}
    </Layout.Header>
  );
};

HeaderComponent.defaultProps = defaultHeaderProps;

const Header = withRouter(HeaderComponent);

export default Header;
