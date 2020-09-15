// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Menu, Layout, Image } from 'antd';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import './Header.css';
import { BACKEND_ACTIVE } from '../../../configs/env';
import { BACKEND_LOGIN_URL, LOGOUT_URL, HOME_URL, REACT_LOGIN_URL } from '../../../constants';

const SubMenu = Menu.SubMenu;

/** interface for HeaderProps */
export interface HeaderProps extends RouteComponentProps {
  authenticated: boolean;
  user: User;
}

/** default props for Header */
const defaultHeaderProps: Partial<HeaderProps> = {
  authenticated: false,
  user: {
    email: '',
    name: '',
    username: '',
  },
};

/** The Header component */

export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { authenticated, user } = props;
  const path = props.location.pathname;
  const APP_LOGIN_URL = BACKEND_ACTIVE ? BACKEND_LOGIN_URL : REACT_LOGIN_URL;
  return (
    <div>
      <Layout.Header>
        <div className="logo">
          <Image width={200} src={Logo} />
        </div>
        <Menu mode="horizontal" selectedKeys={[path]}>
          <Menu.Item key="/">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/admin">
            <Link to="/admin">Admin</Link>
          </Menu.Item>
          {authenticated ? (
            <SubMenu title={`${user.username}`} style={{ float: 'right' }}>
              <Menu.Item key={LOGOUT_URL}>
                <Link to={LOGOUT_URL}>Logout</Link>
              </Menu.Item>
              <Menu.Item key="/manage-account">
                <Link to="/manage-account">Manage account</Link>
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
