// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import {
  EnvironmentOutlined,
  IdcardOutlined,
  SettingOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { isAuthorized } from '@opensrp/react-utils';
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
  URL_TEAM_ASSIGNMENT,
  URL_USER_GROUPS,
  URL_USER_ROLES,
} from '../../../constants';
import { CATALOGUE_LIST_VIEW_URL } from '@opensrp/product-catalogue';
import {
  ENABLE_FORM_CONFIGURATION,
  ENABLE_TEAMS,
  ENABLE_LOCATIONS,
  ENABLE_PLANS,
  ENABLE_PRODUCT_CATALOGUE,
  ENABLE_CARD_SUPPORT,
  ENABLE_INVENTORY,
  MAIN_LOGO_SRC,
  OPENSRP_ROLES,
  ENABLE_TEAMS_ASSIGNMENT_MODULE,
} from '../../../configs/env';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
} from '@opensrp/plans';
import lang from '../../../lang';
import { INVENTORY_BULK_UPLOAD_URL, INVENTORY_SERVICE_POINT_LIST_VIEW } from '@opensrp/inventory';
import { useTranslation } from 'react-i18next';

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
  const activeRoles = OPENSRP_ROLES;
  let location = useLocation();
  let loc = location.pathname.split('/');
  loc.shift();
  useTranslation();

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
        {ENABLE_PLANS &&
          roles &&
          activeRoles.PLANS &&
          isAuthorized(roles as string[], activeRoles.PLANS.split(',')) && (
            <Menu.SubMenu
              key="missions"
              icon={<EnvironmentOutlined className="sidebar-icons" />}
              title={lang.MISSIONS}
            >
              <Menu.Item key="active">
                <Link to={ACTIVE_PLANS_LIST_VIEW_URL} className="admin-link">
                  {lang.ACTIVE}
                </Link>
              </Menu.Item>
              <Menu.Item key="draft">
                <Link to={DRAFT_PLANS_LIST_VIEW_URL} className="admin-link">
                  {lang.DRAFT}
                </Link>
              </Menu.Item>
              <Menu.Item key="complete">
                <Link to={COMPLETE_PLANS_LIST_VIEW_URL} className="admin-link">
                  {lang.COMPLETE}
                </Link>
              </Menu.Item>
              <Menu.Item key="trash">
                <Link to={TRASH_PLANS_LIST_VIEW_URL} className="admin-link">
                  {lang.TRASH}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
        {ENABLE_CARD_SUPPORT &&
          roles &&
          activeRoles.CARD_SUPPORT &&
          isAuthorized(roles as string[], activeRoles.CARD_SUPPORT.split(',')) && (
            <Menu.SubMenu
              key="card-support"
              title={lang.CARD_SUPPORT}
              icon={<IdcardOutlined className="sidebar-icons" />}
            >
              <Menu.Item key="card-support-client-data">
                <Link to={URL_DOWNLOAD_CLIENT_DATA} className="admin-link">
                  {lang.DOWNLOAD_CLIENT_DATA}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
        {ENABLE_INVENTORY &&
          roles &&
          activeRoles.INVENTORY &&
          isAuthorized(roles as string[], activeRoles.INVENTORY.split(',')) && (
            <Menu.SubMenu
              key="inventory"
              icon={<InboxOutlined className="sidebar-icons" />}
              title={lang.INVENTORY}
            >
              <Menu.Item key="list">
                <Link to={INVENTORY_SERVICE_POINT_LIST_VIEW} className="admin-link">
                  {lang.SERVICE_POINT_INVENTORY}
                </Link>
              </Menu.Item>
              <Menu.Item key="bulk">
                <Link to={INVENTORY_BULK_UPLOAD_URL} className="admin-link">
                  {lang.ADD_INVENTORY_VIA_CSV}
                </Link>
              </Menu.Item>
            </Menu.SubMenu>
          )}
        <Menu.SubMenu
          key="admin"
          icon={<SettingOutlined className="sidebar-icons" />}
          title={lang.ADMIN}
        >
          {roles &&
            activeRoles.USERS &&
            isAuthorized(roles as string[], activeRoles.USERS.split(',')) && (
              <Menu.SubMenu key="users" title={lang.USERS}>
                <Menu.Item key={'list'}>
                  <Link to={URL_USER} className="admin-link">
                    {lang.USER_MANAGEMENT}
                  </Link>
                </Menu.Item>
                <Menu.Item key={'groups'}>
                  <Link to={URL_USER_GROUPS} className="admin-link">
                    {lang.USER_GROUPS}
                  </Link>
                </Menu.Item>
                <Menu.Item key={'roles'}>
                  <Link to={URL_USER_ROLES} className="admin-link">
                    {lang.USER_ROLES}
                  </Link>
                </Menu.Item>
              </Menu.SubMenu>
            )}
          {ENABLE_TEAMS &&
            roles &&
            activeRoles.TEAMS &&
            isAuthorized(roles as string[], activeRoles.TEAMS.split(',')) && (
              <Menu.SubMenu key="teams" title={lang.TEAMS}>
                <Menu.Item key="teams-list">
                  <Link to={URL_TEAMS} className="admin-link">
                    {lang.TEAMS}
                  </Link>
                </Menu.Item>
                {ENABLE_TEAMS_ASSIGNMENT_MODULE && (
                  <Menu.Item key="team-assignment">
                    <Link to={URL_TEAM_ASSIGNMENT} className="admin-link">
                      {lang.TEAM_ASSIGNMENT}
                    </Link>
                  </Menu.Item>
                )}
              </Menu.SubMenu>
            )}
          {ENABLE_PRODUCT_CATALOGUE &&
            roles &&
            activeRoles.PRODUCT_CATALOGUE &&
            isAuthorized(roles as string[], activeRoles.PRODUCT_CATALOGUE.split(',')) && (
              <Menu.Item key="product-catalogue">
                <Link to={CATALOGUE_LIST_VIEW_URL} className="admin-link">
                  {lang.PRODUCT_CATALOGUE}
                </Link>
              </Menu.Item>
            )}
          {ENABLE_LOCATIONS &&
            roles &&
            activeRoles.LOCATIONS &&
            isAuthorized(roles as string[], activeRoles.LOCATIONS.split(',')) && (
              <Menu.SubMenu key="location" title={lang.LOCATIONS}>
                <Menu.Item key="unit">
                  <Link to={URL_LOCATION_UNIT} className="admin-link">
                    {lang.LOCATION_UNIT}
                  </Link>
                </Menu.Item>
                <Menu.Item key="group">
                  <Link to={URL_LOCATION_UNIT_GROUP} className="admin-link">
                    {lang.LOCATION_UNIT_GROUP}
                  </Link>
                </Menu.Item>
              </Menu.SubMenu>
            )}
          {ENABLE_FORM_CONFIGURATION &&
            roles &&
            activeRoles.FORM_CONFIGURATION &&
            isAuthorized(roles as string[], activeRoles.FORM_CONFIGURATION.split(',')) && (
              <Menu.SubMenu key="form-config" title={lang.FORM_CONFIGURATION}>
                <Menu.Item key="releases">
                  <Link to={URL_MANIFEST_RELEASE_LIST} className="admin-link">
                    {lang.MANIFEST_RELEASES}
                  </Link>
                </Menu.Item>
                <Menu.Item key="drafts">
                  <Link to={URL_DRAFT_FILE_LIST} className="admin-link">
                    {lang.DRAFT_FILES}
                  </Link>
                </Menu.Item>
                <Menu.Item key="json-validators">
                  <Link to={URL_JSON_VALIDATOR_LIST} className="admin-link">
                    {lang.JSON_VALIDATORS}
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
