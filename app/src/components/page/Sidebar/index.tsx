// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { URL_HOME } from '../../../constants';

import { getActiveKey, menusSchema } from './utils';
import { MAIN_LOGO_SRC } from '../../../configs/env';
import './Sidebar.css';

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
  const [openKeys, setOpenKeys] = React.useState<React.ReactText[]>([]);

  const mainMenu: JSX.Element[] = [];

  const menus = menusSchema(roles as string[]);

  const mapChildren = React.useCallback((child: MenuItems) => {
    if (child.children.length) {
      return (
        <Menu.SubMenu key={child.key} icon={child.otherProps.icon} title={child.otherProps.title}>
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
    for (let m = 0; m < menus.length; m += 1) {
      mainMenu.push(
        menus[m].enabled ? (
          <Menu.SubMenu
            key={menus[m].key}
            icon={menus[m].otherProps.icon}
            title={menus[m].otherProps.title}
          >
            {menus[m].children.map(mapChildren)}
          </Menu.SubMenu>
        ) : (
          <></>
        )
      );
    }
    return mainMenu;
  }, [mainMenu, mapChildren, menus]);

  const activeLocationPaths = loc.filter((locString: string) => locString.length);
  const activeKey = getActiveKey(menus, loc);

  return (
    <Layout.Sider width="275px" className="layout-sider">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={MAIN_LOGO_SRC} className="img-fluid" alt="" />
        </Link>
      </div>

      <Menu
        key="main-menu"
        theme="dark"
        selectedKeys={[activeKey]}
        openKeys={(openKeys as string[]).length ? (openKeys as string[]) : activeLocationPaths}
        defaultOpenKeys={activeLocationPaths}
        defaultSelectedKeys={[activeKey]}
        onOpenChange={(keys: React.ReactText[]) => {
          setOpenKeys(keys);
        }}
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
