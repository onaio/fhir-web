import * as React from 'react';
import ListView from '@onaio/list-view';
import { notification, Row, Col, Button, Space, Table } from 'antd';
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
  const [filteredInfo, setFilteredInfo] = React.useState<any>(null);
  const [sortedInfo, setSortedInfo] = React.useState<any>(null);
  const { serviceClass } = props;

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

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
      <Link to={`/user/edit/${user.id}`} key={`${index}-userid`}>
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
      <thead>
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

  const dataElements: any = [];
  const tableColumns = users.forEach((user: any, index: number) => {
    if (headerItems[index] === 'ID') {
      dataElements.push({
        title: headerItems[index],
        dataIndex: headerItems[index].split(' ').join('').toLowerCase(),
        key: headerItems[index].split(' ').join('').toLowerCase(),
        filters: users.map((filteredUser: any, idx: number) => {
          const fields = ['id', 'username', 'email', 'firstName', 'lastName'];
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
        // eslint-disable-next-line react/display-name
        render: (text: string) => (
          <Link to={`/user/edit/${text}`} key={`${index}-userid`}>
            {text}
          </Link>
        ),
      });
    } else {
      dataElements.push({
        title: headerItems[index],
        dataIndex: headerItems[index].split(' ').join('').toLowerCase(),
        key: headerItems[index].split(' ').join('').toLowerCase(),
        filters: users.map((filteredUser: any, idx: number) => {
          const fields = ['id', 'username', 'email', 'firstName', 'lastName'];
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
    }
  });
  // const columns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     key: 'name',
  //     filters: [
  //       { text: 'Joe', value: 'Joe' },
  //       { text: 'Jim', value: 'Jim' },
  //     ],
  //     filteredValue: (filteredInfo && filteredInfo.name) || null,
  //     onFilter: (value: any, record: any) => record.name.includes(value),
  //     sorter: (a: any, b: any) => a.name.length - b.name.length,
  //     sortOrder: sortedInfo && sortedInfo.columnKey === 'name' && sortedInfo.order,
  //     ellipsis: true,
  //   },
  //   {
  //     title: 'Age',
  //     dataIndex: 'age',
  //     key: 'age',
  //     sorter: (a: any, b: any) => a.age - b.age,
  //     sortOrder: sortedInfo && sortedInfo.columnKey === 'age' && sortedInfo.order,
  //     ellipsis: true,
  //   },
  //   {
  //     title: 'Address',
  //     dataIndex: 'address',
  //     key: 'address',
  //     filters: [
  //       { text: 'London', value: 'London' },
  //       { text: 'New York', value: 'New York' },
  //     ],
  //     filteredValue: (filteredInfo && filteredInfo.address) || null,
  //     onFilter: (value: any, record: any) => record.address.includes(value),
  //     sorter: (a: any, b: any) => a.address.length - b.address.length,
  //     sortOrder: sortedInfo && sortedInfo.columnKey === 'address' && sortedInfo.order,
  //     ellipsis: true,
  //   },
  // ];
  const tableData: any = users.map((user: Partial<KeycloakUser>, index: number) => {
    return {
      key: `${index}`,
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  });
  // const tableData = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     age: 32,
  //     address: 'New York No. 1 Lake Park',
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'London No. 1 Lake Park',
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'Sidney No. 1 Lake Park',
  //   },
  //   {
  //     key: '4',
  //     name: 'Jim Red',
  //     age: 32,
  //     address: 'London No. 2 Lake Park',
  //   },
  // ];
  return (
    <React.Fragment>
      <Row>
        <Col span={12}>
          <Space>
            <HeaderBreadCrumb />
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
        <Table columns={dataElements} dataSource={tableData} onChange={handleChange} />
      </Row>
    </React.Fragment>
    // <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  );
};
Admin.defaultProps = defaultProps;

export default Admin;
