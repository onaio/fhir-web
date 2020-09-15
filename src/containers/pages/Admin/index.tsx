import * as React from 'react';
import ListView from '@onaio/list-view';
import { Layout, Breadcrumb, notification } from 'antd';
import '../Home/Home.css';
import { KeycloakService } from '../../../services';
import { Link } from 'react-router-dom';
import Ripple from '../../../components/page/Loading';

const { Content } = Layout;

// props interface to Admin component
export interface Props {
  serviceClass: typeof KeycloakService;
}

/** default props for UserIdSelect component */
export const defaultProps = {
  serviceClass: KeycloakService,
  showPractitioners: false,
};

/** interface describing a user */
interface User {
  access?: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
  createdTimestamp?: number;
  disableableCredentialTypes?: string[];
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName?: string;
  id: string;
  lastName?: string;
  notBefore?: number;
  requiredActions?: string[];
  totp?: boolean;
  username: string;
}

export const Admin = (props: Props): JSX.Element => {
  const [users, setUsers] = React.useState<User[]>([]);
  const { serviceClass } = props;

  React.useEffect(() => {
    const serve = new serviceClass('/users');
    serve
      .list()
      .then((res: User[]) => {
        if (res.length && !users.length) {
          setUsers(res);
        }
      })
      .catch((err) => {
        notification.error({
          message: `${err}`,
          description: '',
        });
      });
  });
  if (!users.length) {
    return <Ripple />;
  }

  const data = users.map((user: User, index: number) => {
    return [
      <Link to={`/user/${user.id}`} key={`${index}-userid`}>
        {user.id}
      </Link>,
      <span key={`${index}-username`}>{user.username}</span>,
      <span key={`${index}-email`}>{user.email}</span>,
      <span key={`${index}-lname`}>{user.lastName}</span>,
      <span key={`${index}-fname`}>{user.firstName}</span>,
      <Link to={`/user/edit/${user.id}`} key={`${index}-actions`}>
        Edit
      </Link>,
    ];
  });
  const headerItems: string[] = ['ID', 'Username', 'Email', 'Last Name', 'First Name', 'Actions'];
  const tableClass = 'table table-bordered';
  const renderHeaders = () => {
    return (
      <thead className="thead-plan-orgs">
        <tr>
          {headerItems.map((item: string, index: number) => {
            return (
              <th style={{ width: `${100 / headerItems.length}%` }} key={`${index}-headers`}>
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };
  const listViewProps = {
    data,
    headerItems,
    renderHeaders,
    tableClass,
  };
  return (
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>
      <ListView {...listViewProps} />
    </Content>
    // <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  );
};
Admin.defaultProps = defaultProps;

export default Admin;
