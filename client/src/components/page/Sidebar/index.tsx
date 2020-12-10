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
  LOCATIONS_UNIT_GROUP_SET,
  PLANS,
  PRODUCT_CATALOGUE,
  TEAMS,
  URL_ADMIN,
  URL_HOME,
  URL_TEAMS,
  USER_MANAGEMENT,
  LOCATIONS,
  USERS,
  ADMIN,
  ACTIVE,
  DRAFT,
  COMPLETE,
  TRASH,
} from '../../../constants';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue';
import { ENABLE_PLANS, ENABLE_PRODUCT_CATALOGUE } from '../../../configs/env';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
} from '@opensrp/plans';

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
            <Menu.SubMenu key="admin-locations" title={PLANS}>
              <Menu.Item key="plans-active">
                <Link to={ACTIVE_PLANS_LIST_VIEW_URL} className="admin-link">
                  {ACTIVE}
                </Link>
              </Menu.Item>
              <Menu.Item key="plans-draft">
                <Link to={DRAFT_PLANS_LIST_VIEW_URL} className="admin-link">
                  {DRAFT}
                </Link>
              </Menu.Item>
              <Menu.Item key="plans-complete">
                <Link to={COMPLETE_PLANS_LIST_VIEW_URL} className="admin-link">
                  {COMPLETE}
                </Link>
              </Menu.Item>
              <Menu.Item key="plans-trash">
                <Link to={TRASH_PLANS_LIST_VIEW_URL} className="admin-link">
                  {TRASH}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.SubMenu key="admin-locations" title={LOCATIONS}>
            <Menu.Item key="locations-unit">{LOCATIONS_UNIT}</Menu.Item>
            <Menu.Item key="locations-unit-group">{LOCATIONS_UNIT_GROUP}</Menu.Item>
            <Menu.Item key="locations-unit-group-set">{LOCATIONS_UNIT_GROUP_SET}</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
