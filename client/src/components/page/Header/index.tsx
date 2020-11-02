// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Menu, Layout, Image, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import './Header.css';
import { BACKEND_ACTIVE, REACT_APP_LANGUAGE_SWITCHER } from '../../../configs/env';
import {
  URL_BACKEND_LOGIN,
  URL_LOGOUT,
  URL_HOME,
  URL_REACT_LOGIN,
  URL_ADMIN,
  URL_USER_EDIT,
} from '../../../constants';
import { Dictionary } from '@onaio/utils';
import languages from '../../../languages';
import i18next from 'i18next';

const SubMenu = Menu.SubMenu;

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

/** The Header component */

export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { authenticated, user, extraData } = props;
  const { user_id, roles } = extraData;
  const isAdmin = roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS');
  const path = props.location.pathname;
  const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;

  return (
    <div>
      <Layout.Header>
        <div className="logo">
          <Image width={200} src={Logo} />
        </div>
        <Menu mode="horizontal" selectedKeys={[path]}>
          <Menu.Item key={URL_HOME}>
            <Link to={URL_HOME}>Home</Link>
          </Menu.Item>
          {REACT_APP_LANGUAGE_SWITCHER && (
            <SubMenu title="Language" style={{ float: 'right' }}>
              {Object.keys(languages).map((language) => (
                <Menu.Item onClick={() => i18next.changeLanguage(language)} key={language}>
                  {language}
                </Menu.Item>
              ))}
            </SubMenu>
          )}
          {isAdmin && (
            <Menu.Item key={URL_ADMIN}>
              <Link to={URL_ADMIN}>Admin</Link>
            </Menu.Item>
          )}
          {authenticated ? (
            <SubMenu
              title={
                <div>
                  <span>{user.username}</span>
                  <span>&nbsp;</span>
                  <Avatar shape="square" icon={<UserOutlined />} />
                </div>
              }
              style={{ float: 'right' }}
            >
              <Menu.Item key={URL_LOGOUT}>
                <Link to={URL_LOGOUT}>Logout</Link>
              </Menu.Item>
              <Menu.Item key={`${URL_USER_EDIT}/${user_id}`}>
                <Link to={`${URL_USER_EDIT}/${user_id}`}>Manage account</Link>
              </Menu.Item>
            </SubMenu>
          ) : (
            <Menu.Item key={APP_LOGIN_URL} style={{ float: 'right' }}>
              <Link to={APP_LOGIN_URL}>Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Layout.Header>
    </div>
  );
};

HeaderComponent.defaultProps = defaultHeaderProps;

const Header = withRouter(HeaderComponent);

export default Header;
