// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Menu, Layout, Image, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import './Header.css';
import { BACKEND_ACTIVE } from '../../../configs/env';
import {
  BACKEND_LOGIN_URL,
  LOGOUT_URL,
  HOME_URL,
  REACT_LOGIN_URL,
  ADMIN_URL,
  USER_EDIT_URL,
} from '../../../constants';
import { Dictionary } from '@onaio/utils';

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
  const APP_LOGIN_URL = BACKEND_ACTIVE ? BACKEND_LOGIN_URL : REACT_LOGIN_URL;
  return (
    <div>
      <Layout.Header>
        <div className="logo">
          <Image width={200} src={Logo} />
        </div>
        <Menu mode="horizontal" selectedKeys={[path]}>
          <Menu.Item key={HOME_URL}>
            <Link to={HOME_URL}>Home</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key={ADMIN_URL}>
              <Link to={ADMIN_URL}>Admin</Link>
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
              <Menu.Item key={LOGOUT_URL}>
                <Link to={LOGOUT_URL}>Logout</Link>
              </Menu.Item>
              <Menu.Item key={`${USER_EDIT_URL}/${user_id}`}>
                <Link to={`${USER_EDIT_URL}/${user_id}`}>Manage account</Link>
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
