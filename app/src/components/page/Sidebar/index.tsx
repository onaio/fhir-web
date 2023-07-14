import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { URL_HOME } from '../../../constants';
import { Route, getRoutes } from '../../../routes';
import { getActivePath } from './utils';
import { MAIN_LOGO_SRC, OPENSRP_WEB_VERSION } from '../../../configs/env';
import { useTranslation } from '../../../mls';
import type { MenuProps } from 'antd';
import './Sidebar.css';

/** interface for SidebarProps */
export interface SidebarProps extends RouteComponentProps {
  authenticated: boolean;
  extraData: { [key: string]: Dictionary };
}

/** default props for Sidebar */
const defaultSidebarProps: Partial<SidebarProps> = {
  authenticated: false,
};

type MenuItem = Required<MenuProps>['items'][number];

/**
 * @param label - Menu label
 * @param Key - Unique ID of the menu item
 * @param icon - The icon of the menu item
 * @param children - Sub-menus or sub-menu items
 */
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    label,
    children,
  } as MenuItem;
}

/** The Sidebar component */
export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { t } = useTranslation();
  const { extraData } = props;
  const { roles } = extraData;
  let location = useLocation();
  const history = useHistory();

  const routes = React.useMemo(() => getRoutes(roles as string[], t), [roles, t]);

  const menuItems: MenuProps['items'] = [];

  /**
   *
   * @param route - All routes
   * @param targetKey - Item key whose url we want
   */
  const findRoute = (route: Route[], targetKey: string): string | undefined => {
    for (const item of route) {
      if (item.key === targetKey) {
        return item.url;
      }
      if (item.children) {
        const childRoute = findRoute(item.children, targetKey);
        if (childRoute) {
          return childRoute;
        }
      }
    }
    return undefined;
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const route = findRoute(routes, key);
    if (route) {
      history.push(route);
    }
  };

  const setItems = (routes: Route[]) => {
    function mapChildren(route: Route) {
      if (route.children) {
        menuItems?.push(
          getItem(route.title, route.key, route.otherProps?.icon, [
            ...route.children?.map((child) => {
              if (child.children) {
                return getItem(child.title, child.key, null, [
                  ...child.children.map((kid) => getItem(kid.title, kid.key)),
                ]);
              }
              return getItem(child.title, child.key);
            }),
          ])
        );
      } else {
        menuItems?.push(getItem(route.title, route.key, route.otherProps?.icon));
      }
    }
    return routes.map(mapChildren);
  };

  setItems(routes);

  const { activeKey, activePaths } = getActivePath(location.pathname, routes);

  const [collapsedKeys, setCollapsedKeys] = useState<string[]>([]);

  useEffect(() => {
    const { activePaths } = getActivePath(location.pathname, routes);
    setCollapsedKeys(activePaths.concat(...collapsedKeys));
  }, [location.pathname, routes]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout.Sider width="275px" className="layout-sider">
      <div className="logo">
        <Link to={URL_HOME}>
          <img src={MAIN_LOGO_SRC} alt="The logo" />
        </Link>
        {OPENSRP_WEB_VERSION.length > 0 ? (
          <p className="sidebar-version">{OPENSRP_WEB_VERSION}</p>
        ) : null}
      </div>

      <Menu
        key="main-menu"
        theme="dark"
        selectedKeys={[activeKey ?? '']}
        openKeys={collapsedKeys}
        defaultOpenKeys={activePaths}
        defaultSelectedKeys={[activeKey ?? '']}
        onOpenChange={(openKeys) => setCollapsedKeys(openKeys)}
        mode="inline"
        className="menu-dark"
        items={menuItems}
        onClick={onClick}
      />
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
