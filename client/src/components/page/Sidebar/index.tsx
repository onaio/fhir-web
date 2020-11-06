// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import { DashboardOutlined } from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import { Link } from 'react-router-dom';
import { URL_ADMIN, URL_HOME, URL_TEAMS } from '../../../constants';

/** interface for SidebarProps */
export interface SidebarProps extends RouteComponentProps {
  authenticated: boolean;
  extraData: { [key: string]: Dictionary };
}

/** default props for Sidebar */
const defaultSidebarProps: Partial<SidebarProps> = {
  authenticated: false,
};

/** The Sidebar component */

export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { extraData } = props;
  const { roles } = extraData;

  return (
    <Layout.Sider width="275px">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={Logo} className="img-fluid" alt="" />
        </Link>
      </div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.SubMenu key="admin" icon={<DashboardOutlined />} title="Admin">
          {roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS') && (
            <Menu.Item key="users">
              <Link to={URL_ADMIN} className="admin-link">
                Users
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="teams">
            <Link to={URL_TEAMS} className="admin-link">
              Teams
            </Link>
          </Menu.Item>
          <Menu.SubMenu key="admin-locations" title="Locations">
            <Menu.Item key="locations-unit">Locations unit</Menu.Item>
            <Menu.Item key="locations-unit-group">Locations unit group</Menu.Item>
            <Menu.Item key="locations-unit-group-set">Locations unit group set</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
