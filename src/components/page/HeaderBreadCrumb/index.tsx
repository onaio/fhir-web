import * as React from 'react';
import { Tabs } from 'antd';
import { history } from '@onaio/connected-reducer-registry';

const { TabPane } = Tabs;

export const HeaderBreadCrumb = (): JSX.Element => {
  const handleTabLink = (key: string) => {
    history.push(`/${key}`);
  };
  return (
    <Tabs type="card" onChange={handleTabLink}>
      <TabPane tab="Users" key="admin"></TabPane>
      <TabPane tab="Roles" key="roles"></TabPane>
      <TabPane tab="Groups" key="groups"></TabPane>
    </Tabs>
  );
};

export default HeaderBreadCrumb;
