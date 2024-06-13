import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Button, Layout, Menu, MenuProps } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { URL_HOME } from '../../../constants';
import { Route, getRoutes } from '../../../routes';
import { getActivePath } from './utils';
import { COLLAPSED_LOGO_SRC, MAIN_LOGO_SRC } from '../../../configs/env';
import { useTranslation } from '../../../mls';
import './Sidebar.css';
import { RoleContext } from '@opensrp/rbac';
import { LeftOutlined } from '@ant-design/icons';

/** menu item prop type */
type MenuItem = Required<MenuProps>['items'][number];

/** interface for SidebarProps */
export interface SidebarProps extends RouteComponentProps {
  authenticated: boolean;
  extraData: { [key: string]: Dictionary };
}

/** default props for Sidebar */
const defaultSidebarProps: Partial<SidebarProps> = {
  authenticated: false,
};

type MenuLabelProps = Pick<Route, 'title' | 'url'>;

/** Menu title  */
const MenuLabel = (props:MenuLabelProps) => {
  const { title, url } = props;
  if(!url) {
    return <>{title}</>
  }
  return (
    <Link className="admin-link" to={url}>
      {title}
    </Link>
  );
}

/** The Sidebar component */
export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const { extraData } = props;
  const { roles } = extraData;
  let location = useLocation();
  const userRole = useContext(RoleContext);

  const routes = React.useMemo(
    () => getRoutes(roles as string[], t, userRole),
    [roles, t, userRole]
  );

  const sideMenuItems:MenuItem[]  = React.useMemo(() => {
    function buildMenuItems(route: Route) {
      if(route.enabled === false) {
        return;
      }
      const {key, title, otherProps, url, children} = route
      // handle menu children recursively
      const subMenuItems = children?.map(buildMenuItems) as MenuItem[] | undefined;
      const hasChildren = (subMenuItems && subMenuItems.length > 0 )
      // create menu item
      const menuItems: MenuItem = {
        key,
        icon: otherProps?.icon,
        label: <MenuLabel title={title} url={url} />,
        children: hasChildren? subMenuItems : undefined,
      };
      return menuItems
    }
    return routes.map(buildMenuItems) as MenuItem[];
  }, [routes]);

  const { activeKey, activePaths } = getActivePath(location.pathname, routes);

  const [collapsedKeys, setCollapsedKeys] = useState<string[]>([]);

  useEffect(() => {
    const { activePaths } = getActivePath(location.pathname, routes);
    setCollapsedKeys(activePaths.concat(...collapsedKeys));
  }, [location.pathname, routes]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      width="275px"
      className="layout-sider"
      breakpoint='md'
    >
      <div className={`logo ${collapsed ? 'small-logo' : 'main-logo'}`}>
        <Link id="main-logo" hidden={collapsed} to={URL_HOME}>
          <img src={MAIN_LOGO_SRC} alt="The logo" />
        </Link>
        <Button
          id="collapsed-logo"
          hidden={!collapsed}
          onClick={() => setCollapsed(false)} type='link'
        >
          <img src={COLLAPSED_LOGO_SRC} alt="The logo" />
        </Button>
        {!collapsed &&
          <Button className='collapse-icon'  onClick={() => setCollapsed(true)} type='link'><LeftOutlined /></Button>
        }
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
        items={sideMenuItems}
      />
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
