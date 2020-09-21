import * as React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export const HeaderBreadCrumb = (): JSX.Element => {
  return (
    <Tabs type="card">
      <TabPane tab="Users" key="1"></TabPane>
      <TabPane tab="Roles" key="2"></TabPane>
      <TabPane tab="Groups" key="3"></TabPane>
    </Tabs>
  );
};

export default HeaderBreadCrumb;
