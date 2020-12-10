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
  PLANS,
  PRODUCT_CATALOGUE,
  TEAMS,
  URL_ADMIN,
  URL_HOME,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_DOWNLOAD_CLIENT_DATA,
  URL_LOCATION_UNIT,
  USER_MANAGEMENT,
  USERS,
  ADMIN,
} from '../../../constants';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue';
import {
  ENABLE_LOCATIONS,
  ENABLE_PLANS,
  ENABLE_PRODUCT_CATALOGUE,
  ENABLE_CARD_SUPPORT,
} from '../../../configs/env';
import { PLANS_LIST_VIEW_URL } from '@opensrp/plans';

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
    <Layout.Sider width="275px" className="layout-sider">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={Logo} className="img-fluid" alt="" />
        </Link>
      </div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" className="menu-dark">
        <Menu.SubMenu key="admin" icon={<DashboardOutlined />} title={ADMIN}>
          {roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS') && (
            <Menu.SubMenu key="users" title={USERS}>
              <Menu.Item key="users">
                <Link to={URL_ADMIN} className="admin-link">
                  {USER_MANAGEMENT}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.Item key="teams">
            <Link to={URL_TEAMS} className="admin-link">
              {TEAMS}
            </Link>
          </Menu.Item>
          {ENABLE_PRODUCT_CATALOGUE && (
            <Menu.Item key="product-catalogue">
              <Link to={CATALOGUE_LIST_VIEW_URL} className="admin-link">
                {PRODUCT_CATALOGUE}
              </Link>
            </Menu.Item>
          )}
          {ENABLE_PLANS && (
            <Menu.Item key="plans">
              <Link to={PLANS_LIST_VIEW_URL} className="admin-link">
                {PLANS}
              </Link>
            </Menu.Item>
          )}
          {ENABLE_CARD_SUPPORT && (
            <Menu.SubMenu key="admin-card-support" title="Card Support">
              <Menu.Item key="admin-card-support-client-data">
                <Link to={URL_DOWNLOAD_CLIENT_DATA} className="admin-link">
                  Download Client Data
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          {ENABLE_LOCATIONS && (
            <Menu.SubMenu key="admin-locations" title="Locations">
              <Menu.Item key="locations-unit">
                <Link to={URL_LOCATION_UNIT} className="admin-link">
                  {LOCATIONS_UNIT}
                </Link>
              </Menu.Item>
              <Menu.Item key="locations-unit-group">
                <Link to={URL_LOCATION_UNIT_GROUP} className="admin-link">
                  {LOCATIONS_UNIT_GROUP}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
