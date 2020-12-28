// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import { DashboardOutlined } from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import { Link, useLocation } from 'react-router-dom';
import {
  LOCATIONS_UNIT,
  LOCATIONS_UNIT_GROUP,
  PRODUCT_CATALOGUE,
  TEAMS,
  URL_ADMIN,
  URL_HOME,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_LOCATION_UNIT,
  USER_MANAGEMENT,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_MANIFEST_RELEASE_LIST,
  FORM_CONFIGURATIONS,
  MANIFEST_RELEASES,
  DRAFT_FILES,
  JSON_VALIDATORS,
  USERS,
  ADMIN,
  ACTIVE,
  DRAFT,
  COMPLETE,
  TRASH,
  MISSIONS,
} from '../../../constants';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue';
import {
  ENABLE_FORM_CONFIGURATION,
  ENABLE_PLANS,
  ENABLE_LOCATIONS,
  ENABLE_PRODUCT_CATALOGUE,
} from '../../../configs/env';
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
  const [openKeys, setOpenKeys] = useState(['admin']);
  let location = useLocation();

  useEffect(() => {
    setOpenKeys(['admin']);
    if (location.pathname.indexOf('/admin') !== -1) {
      setOpenKeys([...openKeys, 'users', location.pathname]);
    } else if (location.pathname.indexOf('/location') !== -1) {
      setOpenKeys([...openKeys, 'admin-locations', location.pathname]);
    } else if (location.pathname !== '/') {
      setOpenKeys([...openKeys, 'admin-form-config', location.pathname]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout.Sider width="275px" className="layout-sider">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={Logo} className="img-fluid" alt="" />
        </Link>
      </div>
      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={openKeys}
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        className="menu-dark"
      >
        {ENABLE_PLANS && (
          <Menu.SubMenu key="missions" icon={<DashboardOutlined />} title={MISSIONS}>
            <Menu.Item key={ACTIVE_PLANS_LIST_VIEW_URL}>
              <Link to={ACTIVE_PLANS_LIST_VIEW_URL} className="admin-link">
                {ACTIVE}
              </Link>
            </Menu.Item>
            <Menu.Item key={DRAFT_PLANS_LIST_VIEW_URL}>
              <Link to={DRAFT_PLANS_LIST_VIEW_URL} className="admin-link">
                {DRAFT}
              </Link>
            </Menu.Item>
            <Menu.Item key={COMPLETE_PLANS_LIST_VIEW_URL}>
              <Link to={COMPLETE_PLANS_LIST_VIEW_URL} className="admin-link">
                {COMPLETE}
              </Link>
            </Menu.Item>
            <Menu.Item key={TRASH_PLANS_LIST_VIEW_URL}>
              <Link to={TRASH_PLANS_LIST_VIEW_URL} className="admin-link">
                {TRASH}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}
        <Menu.SubMenu key="admin" icon={<DashboardOutlined />} title={ADMIN}>
          {roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS') && (
            <Menu.SubMenu key="users" title={USERS}>
              <Menu.Item key={URL_ADMIN}>
                <Link to={URL_ADMIN} className="admin-link">
                  {USER_MANAGEMENT}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          <Menu.Item key={URL_TEAMS}>
            <Link to={URL_TEAMS} className="admin-link">
              {TEAMS}
            </Link>
          </Menu.Item>
          {ENABLE_PRODUCT_CATALOGUE && (
            <Menu.Item key={CATALOGUE_LIST_VIEW_URL}>
              <Link to={CATALOGUE_LIST_VIEW_URL} className="admin-link">
                {PRODUCT_CATALOGUE}
              </Link>
            </Menu.Item>
          )}
          {ENABLE_LOCATIONS && (
            <Menu.SubMenu key="admin-locations" title="Locations">
              <Menu.Item key={URL_LOCATION_UNIT}>
                <Link to={URL_LOCATION_UNIT} className="admin-link">
                  {LOCATIONS_UNIT}
                </Link>
              </Menu.Item>
              <Menu.Item key={URL_LOCATION_UNIT_GROUP}>
                <Link to={URL_LOCATION_UNIT_GROUP} className="admin-link">
                  {LOCATIONS_UNIT_GROUP}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          {ENABLE_FORM_CONFIGURATION && (
            <Menu.SubMenu key="admin-form-config" title={FORM_CONFIGURATIONS}>
              <Menu.Item key={URL_MANIFEST_RELEASE_LIST}>
                <Link to={URL_MANIFEST_RELEASE_LIST} className="admin-link">
                  {MANIFEST_RELEASES}
                </Link>
              </Menu.Item>
              <Menu.Item key={URL_DRAFT_FILE_LIST}>
                <Link to={URL_DRAFT_FILE_LIST} className="admin-link">
                  {DRAFT_FILES}
                </Link>
              </Menu.Item>
              <Menu.Item key={URL_JSON_VALIDATOR_LIST}>
                <Link to={URL_JSON_VALIDATOR_LIST} className="admin-link">
                  {JSON_VALIDATORS}
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
