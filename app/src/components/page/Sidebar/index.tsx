import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Button, Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { URL_HOME } from '../../../constants';
import { Route, getRoutes } from '../../../routes';
import { getActivePath } from './utils';
import { COLLAPSED_LOGO_SRC, MAIN_LOGO_SRC } from '../../../configs/env';
import { useTranslation } from '../../../mls';
import './Sidebar.css';
import { RoleContext } from '@opensrp/rbac';
import { LeftOutlined } from '@ant-design/icons';

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

  const sidebaritems: JSX.Element[] = React.useMemo(() => {
    function mapChildren(route: Route) {
      if (route.children) {
        return (
          <Menu.SubMenu key={route.key} icon={route.otherProps?.icon} title={route.title}>
            {route.children.map(mapChildren)}
          </Menu.SubMenu>
        );
      } else if (route.url) {
        return (
          <Menu.Item key={route.key} icon={route.otherProps?.icon}>
            <Link className="admin-link" to={route.url}>
              {route.title}
            </Link>
          </Menu.Item>
        );
      } else {
        return <Menu.Item key={route.key}>{route.title}</Menu.Item>;
      }
    }

    return routes.map(mapChildren);
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
    >
      <div className={`logo ${collapsed ? 'small-logo' : 'main-logo'}`}>
        <Link hidden={collapsed} to={URL_HOME}>
          <img src={MAIN_LOGO_SRC} alt="The logo" />
        </Link>
        <Button
          hidden={!collapsed}
          onClick={() => setCollapsed(false)} type='link'
        >
          <img src={COLLAPSED_LOGO_SRC} alt="The logo" />
        </Button>:
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
      >
        {sidebaritems}
      </Menu>
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
