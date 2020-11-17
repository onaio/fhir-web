// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import { DashboardOutlined } from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import { Link } from 'react-router-dom';
import {
  LOCATIONS_UNIT,
  LOCATIONS_UNIT_GROUP,
  URL_ADMIN,
  URL_HOME,
  URL_LOCATION_TAG,
  URL_LOCATION_UNIT,
  USER_MANAGEMENT,
} from '../../../constants';

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
            <Menu.SubMenu key="users" title="Users">
              <Menu.Item key="users">
                <Link to={URL_ADMIN} className="admin-link">
                  {USER_MANAGEMENT}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.SubMenu key="admin-locations" title="Locations">
            <Menu.Item key="locations-unit">
              <Link to={URL_LOCATION_UNIT} className="admin-link">
                {LOCATIONS_UNIT}
              </Link>
            </Menu.Item>
            <Menu.Item key="locations-unit-group">
              <Link to={URL_LOCATION_TAG} className="admin-link">
                {LOCATIONS_UNIT_GROUP}
              </Link>
            </Menu.Item>
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
