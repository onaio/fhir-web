// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Sidebar.css';
import {
  UserOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
  InsertRowAboveOutlined,
  DashboardOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Dictionary } from '@onaio/utils';
import { Layout, Menu } from 'antd';
import Logo from '../../../assets/images/opensrp-logo-color.png';
import { Link } from 'react-router-dom';
import { HOME_URL } from '../../../constants';

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
  return (
    <Layout.Sider width="275px">
      <div className="logo">
        <Link to={HOME_URL}>
          <img src={Logo} className="img-fluid" alt="" />
        </Link>
      </div>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.SubMenu key="admin" icon={<DashboardOutlined />} title="Admin">
          <Menu.Item key="1">Users</Menu.Item>
          <Menu.Item key="2">Teams</Menu.Item>
          <Menu.SubMenu key="admin-locations" title="Locations">
            <Menu.Item key="3">Locations unit</Menu.Item>
            <Menu.Item key="4">Locations unit group</Menu.Item>
            <Menu.Item key="5">Locations unit group set</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.SubMenu key="menu" icon={<FormOutlined />} title="Menu Item">
          <Menu.Item key="6">Menu 1</Menu.Item>
          <Menu.Item key="7">Menu 2</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="menu-2" icon={<InsertRowAboveOutlined />} title="Menu Item">
          <Menu.Item key="8">Menu 3</Menu.Item>
          <Menu.Item key="9">Menu 4</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
};

SidebarComponent.defaultProps = defaultSidebarProps;

const Sidebar = withRouter(SidebarComponent);

export default Sidebar;
