// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import { Link, useLocation } from 'react-router-dom';
import {
  LOCATIONS_UNIT,
  LOCATIONS_UNIT_GROUP,
  PRODUCT_CATALOGUE,
  TEAMS,
  URL_USER,
  URL_HOME,
  URL_LOCATION_UNIT_GROUP,
  URL_TEAMS,
  URL_DOWNLOAD_CLIENT_DATA,
  URL_LOCATION_UNIT,
  USER_MANAGEMENT,
  URL_JSON_VALIDATOR_LIST,
  URL_DRAFT_FILE_LIST,
  URL_MANIFEST_RELEASE_LIST,
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
  SERVICE_POINT_INVENTORY,
  INVENTORY,
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
} from '../../../configs/env';
import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  TRASH_PLANS_LIST_VIEW_URL,
} from '@opensrp/plans';
import { INVENTORY_SERVICE_POINT_LIST_VIEW } from '@opensrp/inventory';

/** interface for SidebarProps */
export interface SidebarProps extends RouteComponentProps {
  authenticated: boolean;
  extraData: { [key: string]: Dictionary };
}

/** Interface for menu items */

export interface MenuItems {
  key: string;
  enabled?: boolean;
  url?: string;
  otherProps: {
    icon?: string | JSX.Element;
    title: string;
  };
  children: MenuItems[];
}

/** default props for Sidebar */
const defaultSidebarProps: Partial<SidebarProps> = {
  authenticated: false,
};

/** The Sidebar component */

export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { extraData } = props;
  const { roles } = extraData;
  let location = useLocation();
  let loc = location.pathname.split('/');
  loc.shift();

  // menu items schema
  const menus: MenuItems[] = [
    {
      otherProps: { icon: <DashboardOutlined />, title: `${MISSIONS}` },
      key: 'missions',
      enabled: ENABLE_PLANS,
      children: [
        {
          otherProps: { title: `${ACTIVE}` },
          url: `${ACTIVE_PLANS_LIST_VIEW_URL}`,
          key: 'missions-active',
          children: [],
        },
        {
          otherProps: { title: `${DRAFT}` },
          url: `${DRAFT_PLANS_LIST_VIEW_URL}`,
          key: 'missions-draft',
          children: [],
        },
        {
          otherProps: { title: `${COMPLETE}` },
          url: `${COMPLETE_PLANS_LIST_VIEW_URL}`,
          key: 'missions-complete',
          children: [],
        },
        {
          otherProps: { title: `${TRASH}` },
          url: `${TRASH_PLANS_LIST_VIEW_URL}`,
          key: 'missions-trash',
          children: [],
        },
      ],
    },
    {
      otherProps: { icon: <DashboardOutlined />, title: `${ADMIN}` },
      key: 'admin',
      enabled: true,
      url: '/admin',
      children: [
        {
          otherProps: { title: `${USERS}` },
          key: 'users',
          enabled: roles && roles.includes('ROLE_EDIT_KEYCLOAK_USERS'),
          children: [
            {
              otherProps: { icon: '', title: `${USER_MANAGEMENT}` },
              key: 'user-management',
              url: `${URL_USER}`,
              children: [],
            },
          ],
        },
        {
          otherProps: { icon: '', title: 'Locations' },
          key: 'locations',
          enabled: ENABLE_LOCATIONS,
          children: [
            {
              otherProps: { icon: '', title: `${LOCATIONS_UNIT}` },
              url: `${URL_LOCATION_UNIT}`,
              key: 'locations-unit',
              children: [],
            },
            {
              otherProps: { icon: '', title: `${LOCATIONS_UNIT_GROUP}` },
              url: `${URL_LOCATION_UNIT_GROUP}`,
              key: 'locations-group',
              children: [],
            },
          ],
        },
        {
          otherProps: { icon: '', title: `${PRODUCT_CATALOGUE}` },
          key: 'product-catalogue',
          enabled: ENABLE_PRODUCT_CATALOGUE,
          url: `${CATALOGUE_LIST_VIEW_URL}`,
          children: [],
        },
        {
          otherProps: { icon: '', title: `${TEAMS}` },
          key: 'teams',
          enabled: ENABLE_TEAMS,
          url: `${URL_TEAMS}`,
          children: [],
        },
        {
          otherProps: { icon: '', title: `${FORM_CONFIGURATION}` },
          key: 'form-configuration',
          enabled: ENABLE_FORM_CONFIGURATION,
          children: [
            {
              otherProps: { icon: '', title: `${MANIFEST_RELEASES}` },
              key: 'form-configuration-releases',
              url: `${URL_MANIFEST_RELEASE_LIST}`,
              children: [],
            },
            {
              otherProps: { icon: '', title: `${DRAFT_FILES}` },
              key: 'form-configuration-draft',
              url: `${URL_DRAFT_FILE_LIST}`,
              children: [],
            },
            {
              otherProps: { icon: '', title: `${JSON_VALIDATORS}` },
              key: 'form-configuration-validators',
              url: `${URL_JSON_VALIDATOR_LIST}`,
              children: [],
            },
          ],
        },
      ],
    },
    {
      otherProps: { icon: '', title: 'Card Support' },
      key: 'card-support',
      enabled: ENABLE_CARD_SUPPORT,
      children: [
        {
          otherProps: { icon: <IdcardOutlined />, title: 'Download Client Data' },
          url: `${URL_DOWNLOAD_CLIENT_DATA}`,
          key: 'download-client-data',
          children: [],
        },
      ],
    },
    {
      otherProps: { icon: '', title: `${INVENTORY}` },
      key: 'inventory',
      enabled: ENABLE_INVENTORY,
      children: [
        {
          otherProps: { icon: <DashboardOutlined />, title: `${SERVICE_POINT_INVENTORY}` },
          url: `${INVENTORY_SERVICE_POINT_LIST_VIEW}`,
          key: 'inventory-list',
          children: [],
        },
      ],
    },
  ];

  const mainMenu: JSX.Element[] = [];

  const mapChildren = React.useCallback((child: any) => {
    if (child.children.length) {
      return (
        <Menu.SubMenu key={child.key} icon={<DashboardOutlined />} title={child.otherProps.title}>
          {child.children.map(mapChildren)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={child.key}>
          <Link className="admin-link" to={`${child.url}`}>
            {child.otherProps.title}
          </Link>
        </Menu.Item>
      );
    }
  }, []);

  const processMenu = React.useMemo(() => {
    if (menus && menus.length) {
      for (let m = 0; m < menus.length; m += 1) {
        mainMenu.push(
          menus[m].enabled ? (
            <Menu.SubMenu
              key={menus[m].key}
              icon={<DashboardOutlined />}
              title={menus[m].otherProps.title}
            >
              {menus[m].children.map(mapChildren)}
            </Menu.SubMenu>
          ) : (
            <></>
          )
        );
      }
    }
    return mainMenu;
  }, [mainMenu, mapChildren, menus]);

  return (
    <Layout.Sider width="275px" className="layout-sider">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={Logo} className="img-fluid" alt="" />
        </Link>
      </div>

      <Menu
        theme="dark"
        selectedKeys={[]}
        defaultOpenKeys={loc}
        defaultSelectedKeys={[]}
        mode="inline"
        className="menu-dark"
      >
        {processMenu}
      </Menu>
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
