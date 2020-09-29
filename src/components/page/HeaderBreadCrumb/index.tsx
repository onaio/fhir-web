import * as React from 'react';
import { Tabs } from 'antd';
import { history } from '@onaio/connected-reducer-registry';

const { TabPane } = Tabs;

interface HeaderBreadCrumbProps {
  isAdmin?: boolean;
  userId?: string;
}

export const HeaderBreadCrumb: React.FC<HeaderBreadCrumbProps> = (props: HeaderBreadCrumbProps) => {
  const { userId } = props;
  const [activeKey, setActiveKey] = React.useState<string>('');
  const handleTabLink = (key: string) => {
    if (key === 'credentials') {
      history.push(`/user/credentials/${userId}`);
    } else if (key === 'details') {
      history.push(`/user/edit/${userId}`);
    } else {
      history.push(`/${key}`);
    }
    setActiveKey(key);
  };
  return !userId ? (
    <Tabs type="card" onChange={handleTabLink}>
      <TabPane tab="Users" key="admin"></TabPane>
    </Tabs>
  ) : (
    <Tabs type="card" onChange={handleTabLink} activeKey={`${activeKey}`}>
      <TabPane tab="Details" key="details"></TabPane>
      <TabPane tab="Credentials" key="credentials"></TabPane>
      <TabPane tab="Groups" key="groups"></TabPane>
    </Tabs>
  );
};

export default HeaderBreadCrumb;
