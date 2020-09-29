import * as React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Sider } = Layout;

const SideMenu: React.FC = () => {
  return (
    <Sider
      style={{
        overflow: 'auto',
        left: 0,
      }}
      width={250}
    >
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="Admin">
          <Menu.Item key="3">Users</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
