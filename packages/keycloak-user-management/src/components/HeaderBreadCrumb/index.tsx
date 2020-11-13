import * as React from 'react';
import { Tabs } from 'antd';
import { URL_USER_CREDENTIALS, URL_USER_EDIT } from '../../constants';
import { useHistory } from 'react-router';
import { Dictionary } from '@onaio/utils/dist/types/types';

const { TabPane } = Tabs;

interface HeaderBreadCrumbProps {
  isAdmin?: boolean;
  userId?: string;
}
/**
 * Find Most appropriate type for useHistory
 *
 * @param {string} key key for selected tab
 * @param {Function} setActiveKeyStateMethod sets activekey to state
 * @param {string} userId selected user identifier
 * @param {Dictionary} history useState history Object
 */
export const handleTabLink = (
  key: string,
  setActiveKeyStateMethod: (key: string) => void,
  userId: string | undefined,
  history: Dictionary
) => {
  if (key === 'credentials') {
    history.push(`${URL_USER_CREDENTIALS}/${userId}`);
  } else if (key === 'details') {
    history.push(`${URL_USER_EDIT}/${userId}`);
  } else {
    history.push(`/${key}`);
  }
  setActiveKeyStateMethod(key);
};
export const HeaderBreadCrumb: React.FC<HeaderBreadCrumbProps> = (props: HeaderBreadCrumbProps) => {
  const { userId } = props;
  const history = useHistory();
  const [activeKey, setActiveKey] = React.useState<string>('');
  return !userId ? (
    <Tabs type="card" onChange={() => handleTabLink(activeKey, setActiveKey, userId, history)}>
      <TabPane tab="Users" key="admin"></TabPane>
    </Tabs>
  ) : (
    <Tabs
      type="card"
      onChange={() => handleTabLink(activeKey, setActiveKey, userId, history)}
      activeKey={`${activeKey}`}
    >
      <TabPane tab="Details" key="details"></TabPane>
      <TabPane tab="Credentials" key="credentials"></TabPane>
      <TabPane tab="Groups" key="groups"></TabPane>
    </Tabs>
  );
};

export default HeaderBreadCrumb;
