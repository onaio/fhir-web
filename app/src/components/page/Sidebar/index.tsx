// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import { IdcardOutlined, SettingOutlined } from '@ant-design/icons';
import { useKeycloak, AuthorizedElement, AuthorizedFunction } from 'secure-react-keycloak';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  URL_USER,
  URL_HOME,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_DOWNLOAD_CLIENT_DATA,
  URL_LOCATION_UNIT,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_MANIFEST_RELEASE_LIST,
  URL_USER_GROUPS,
  URL_USER_ROLES,
} from '../../../constants';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue';
import {
  ENABLE_FORM_CONFIGURATION,
  ENABLE_PLANS,
  ENABLE_TEAMS,
  ENABLE_LOCATIONS,
  ENABLE_PRODUCT_CATALOGUE,
  ENABLE_CARD_SUPPORT,
  ENABLE_INVENTORY,
  MAIN_LOGO_SRC,
} from '../../../configs/env';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
} from '@opensrp/plans';
import {
  CARD_SUPPORT,
  DOWNLOAD_CLIENT_DATA,
  USER_MANAGEMENT,
  TEAMS,
  LOCATION_UNIT,
  LOCATION_UNIT_GROUP,
  PRODUCT_CATALOGUE,
  FORM_CONFIGURATION,
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
  LOCATIONS,
  SERVICE_POINT_INVENTORY,
  INVENTORY,
  ADD_INVENTORY_VIA_CSV,
  USER_GROUPS,
  USER_ROLES,
} from '../../../lang';
import { INVENTORY_BULK_UPLOAD_URL, INVENTORY_SERVICE_POINT_LIST_VIEW } from '@opensrp/inventory';
import ArchiveOutline from '@opensrp/ant-icons/lib/ArchiveOutline';
import MapMarkerOutline from '@opensrp/ant-icons/lib/MapMarkerOutline';

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
  const [keycloak, initialized] = useKeycloak();
  const { extraData } = props;
  const { roles } = extraData;
  console.log('roles', roles);
  console.log('auth function', AuthorizedFunction(roles));
  let location = useLocation();
  let loc = location.pathname.split('/');
  loc.shift();

  return (
    <Layout.Sider width="275px" className="layout-sider">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={MAIN_LOGO_SRC} className="img-fluid" alt="" />
        </Link>
      </div>

      <Menu
        theme="dark"
        selectedKeys={[loc[loc.length - 1]]}
        defaultOpenKeys={loc}
        defaultSelectedKeys={[loc[loc.length - 1]]}
        mode="inline"
        className="menu-dark"
      >
        {ENABLE_PLANS && (
          <Menu.SubMenu
            key="missions"
            icon={<MapMarkerOutline className="sidebar-icons" />}
            title={MISSIONS}
          >
            <Menu.Item key="active">
              <Link to={ACTIVE_PLANS_LIST_VIEW_URL} className="admin-link">
                {ACTIVE}
              </Link>
            </Menu.Item>
            <Menu.Item key="draft">
              <Link to={DRAFT_PLANS_LIST_VIEW_URL} className="admin-link">
                {DRAFT}
              </Link>
            </Menu.Item>
            <Menu.Item key="complete">
              <Link to={COMPLETE_PLANS_LIST_VIEW_URL} className="admin-link">
                {COMPLETE}
              </Link>
            </Menu.Item>
            <Menu.Item key="trash">
              <Link to={TRASH_PLANS_LIST_VIEW_URL} className="admin-link">
                {TRASH}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}
        {ENABLE_CARD_SUPPORT && (
          <Menu.SubMenu
            key="card-support"
            title={CARD_SUPPORT}
            icon={<IdcardOutlined className="sidebar-icons" />}
          >
            <Menu.Item key="card-support-client-data">
              <Link to={URL_DOWNLOAD_CLIENT_DATA} className="admin-link">
                {DOWNLOAD_CLIENT_DATA}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}
        {ENABLE_INVENTORY && (
          <Menu.SubMenu
            key="inventory"
            icon={<ArchiveOutline className="sidebar-icons" />}
            title={INVENTORY}
          >
            <Menu.Item key="list">
              <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW} className="admin-link">
                {SERVICE_POINT_INVENTORY}
              </Link>
            </Menu.Item>
            <Menu.Item key="bulk">
              <Link to={INVENTORY_BULK_UPLOAD_URL} className="admin-link">
                {ADD_INVENTORY_VIA_CSV}
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        )}
        <Menu.SubMenu
          key="admin"
          icon={<SettingOutlined className="sidebar-icons" />}
          title={ADMIN}
        >
          {roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS') && (
            <Menu.SubMenu key="users" title={USERS}>
              <Menu.Item key={'list'}>
                <Link to={URL_USER} className="admin-link">
                  {USER_MANAGEMENT}
                </Link>
              </Menu.Item>
              <Menu.Item key={'groups'}>
                <Link to={URL_USER_GROUPS} className="admin-link">
                  {USER_GROUPS}
                </Link>
              </Menu.Item>
              <Menu.Item key={'roles'}>
                <Link to={URL_USER_ROLES} className="admin-link">
                  {USER_ROLES}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          {ENABLE_TEAMS && (
            <Menu.Item key="teams">
              <Link to={URL_TEAMS} className="admin-link">
                {TEAMS}
              </Link>
            </Menu.Item>
          )}
          {ENABLE_PRODUCT_CATALOGUE && (
            <Menu.Item key="product-catalogue">
              <Link to={CATALOGUE_LIST_VIEW_URL} className="admin-link">
                {PRODUCT_CATALOGUE}
              </Link>
            </Menu.Item>
          )}
          {ENABLE_LOCATIONS && (
            <Menu.SubMenu key="location" title={LOCATIONS}>
              <Menu.Item key="unit">
                <Link to={URL_LOCATION_UNIT} className="admin-link">
                  {LOCATION_UNIT}
                </Link>
              </Menu.Item>
              <Menu.Item key="group">
                <Link to={URL_LOCATION_UNIT_GROUP} className="admin-link">
                  {LOCATION_UNIT_GROUP}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
          {ENABLE_FORM_CONFIGURATION && (
            <Menu.SubMenu key="form-config" title={FORM_CONFIGURATION}>
              <Menu.Item key="releases">
                <Link to={URL_MANIFEST_RELEASE_LIST} className="admin-link">
                  {MANIFEST_RELEASES}
                </Link>
              </Menu.Item>
              <Menu.Item key="drafts">
                <Link to={URL_DRAFT_FILE_LIST} className="admin-link">
                  {DRAFT_FILES}
                </Link>
              </Menu.Item>
              <Menu.Item key="json-validators">
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
