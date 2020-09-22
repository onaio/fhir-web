import * as React from 'react';
import { Tabs } from 'antd';
import { history } from '@onaio/connected-reducer-registry';

const { TabPane } = Tabs;

export const HeaderBreadCrumb = (props: any): JSX.Element => {
  const { isAdmin } = props;
  const handleTabLink = (key: string) => {
    history.push(`/${key}`);
  };
  return isAdmin ? (
    <Tabs type="card" onChange={handleTabLink}>
      <TabPane tab="Users" key="admin"></TabPane>
    </Tabs>
  ) : (
    <Tabs type="card" onChange={handleTabLink}>
      <TabPane tab="Details" key="admin"></TabPane>
      <TabPane tab="Credentials" key="credentials"></TabPane>
      <TabPane tab="Groups" key="groups"></TabPane>
    </Tabs>
  );
};

export default HeaderBreadCrumb;
