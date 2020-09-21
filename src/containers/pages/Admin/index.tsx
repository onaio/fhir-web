import * as React from 'react';
import ListView from '@onaio/list-view';
import { notification, Row, Col, Button, Space, Table, Divider } from 'antd';
import '../Home/Home.css';
import { KeycloakService } from '../../../services';
import { Link } from 'react-router-dom';
import Ripple from '../../../components/page/Loading';
import HeaderBreadCrumb from '../../../components/page/HeaderBreadCrumb';
import { KeycloakUser } from '../../../store/ducks/keycloak';

// const { Content } = Layout;

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
  email: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName: string;
  id: string;
  lastName: string;
  notBefore?: number;
  requiredActions?: string[];
  totp?: boolean;
  username: string;
}

export const Admin = (props: Props): JSX.Element => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [filteredInfo, setFilteredInfo] = React.useState<any>(null);
  const [sortedInfo, setSortedInfo] = React.useState<any>(null);
  const { serviceClass } = props;

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  React.useEffect(() => {
    if (!users.length) {
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
    }
  });
  if (!users.length) {
    return <Ripple />;
  }

  const headerItems: string[] = ['ID', 'Username', 'Email', 'Last Name', 'First Name', 'Actions'];

  const dataElements: any = [];
  const fields = ['id', 'username', 'email', 'firstName', 'lastName'];
  fields.forEach((user: any, index: number) => {
    if (headerItems[index] === 'ID') {
      dataElements.push({
        title: headerItems[index],
        dataIndex: headerItems[index].split(' ').join('').toLowerCase(),
        key: headerItems[index].split(' ').join('').toLowerCase(),
        ellipsis: true,
        // eslint-disable-next-line react/display-name
        render: (text: string) => (
          <Link to={`/user/edit/${text}`} key={`${index}-userid`}>
            {text}
          </Link>
        ),
      });
    } else if (headerItems[index] === 'Username') {
      dataElements.push({
        title: headerItems[index],
        dataIndex: headerItems[index].split(' ').join('').toLowerCase(),
        key: headerItems[index].split(' ').join('').toLowerCase(),
        filters: users.map((filteredUser: any, idx: number) => {
          return {
            text: (filteredUser as any)[fields[1]],
            value: (filteredUser as any)[fields[1]],
          };
        }),
        filteredValue: (filteredInfo && filteredInfo.username) || null,
        onFilter: (value: any, record: any) => record.username.includes(value),
        sorter: (a: any, b: any) => a.username.length - b.username.length,
        sortOrder: sortedInfo && sortedInfo.columnKey === 'username' && sortedInfo.order,
        ellipsis: true,
      });
    } else {
      dataElements.push({
        title: headerItems[index],
        dataIndex: headerItems[index].split(' ').join('').toLowerCase(),
        key: headerItems[index].split(' ').join('').toLowerCase(),
      });
    }
  });
  const tableData: any = users.map((user: Partial<KeycloakUser>, index: number) => {
    return {
      key: `${index}`,
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
    };
  });
  return (
    <React.Fragment>
      <Row>
        <Col span={12}>
          <Space>
            <HeaderBreadCrumb />
            <Divider />
          </Space>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space style={{ marginBottom: 16, justifyContent: 'flex-end' }}>
            <Button type="primary" className="create-user">
              Create User
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        {/* <ListView {...listViewProps} /> */}
        <Table columns={dataElements} dataSource={tableData} onChange={handleChange} bordered />
      </Row>
    </React.Fragment>
    // <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  );
};
Admin.defaultProps = defaultProps;

export default Admin;
