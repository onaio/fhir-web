import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { URL_HOME } from '../../../constants';
import { Route, getRoutes } from '../../../routes';
import { getActiveKey } from './utils';
import { MAIN_LOGO_SRC, OPENSRP_WEB_VERSION } from '../../../configs/env';
import { useTranslation } from '../../../mls';
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

/** The Sidebar component */
export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {
  const { t } = useTranslation();
  const { extraData } = props;
  const { roles } = extraData;
  let location = useLocation();
  const [openKeys, setOpenKeys] = React.useState<React.Key[]>([]);

  const routes = React.useMemo(() => getRoutes(roles as string[], t), [roles, t]);

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

  const activeLocationPaths = location.pathname
    .split('/')
    .filter((locString: string) => locString.length);
  const activeKey = getActiveKey(location.pathname, routes);

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
        openKeys={openKeys.length ? (openKeys as string[]) : activeLocationPaths}
        defaultOpenKeys={activeLocationPaths}
        defaultSelectedKeys={[activeKey ?? '']}
        onOpenChange={(keys) => setOpenKeys(keys)}
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
