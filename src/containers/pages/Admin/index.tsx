import * as React from 'react';
import { notification, Row, Col, Button, Space, Table, Divider, Popconfirm } from 'antd';
import '../Home/Home.css';
import { KeycloakService } from '../../../services';
import { Link } from 'react-router-dom';
import { history } from '@onaio/connected-reducer-registry';
import Ripple from '../../../components/page/Loading';
import HeaderBreadCrumb from '../../../components/page/HeaderBreadCrumb';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  getKeycloakUsersArray,
} from '../../../store/ducks/keycloak';
import { Store } from 'redux';
import { PropsTypes } from './CreateEditUser/Index';
import { connect } from 'react-redux';

// const { Content } = Layout;

// props interface to Admin component
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  keycloakUsers: KeycloakUser[];
}

/** default props for UserIdSelect component */
export const defaultProps = {
  serviceClass: KeycloakService,
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  keycloakUsers: [],
};

const Admin = (props: Props): JSX.Element => {
  const [filteredInfo, setFilteredInfo] = React.useState<any>(null);
  const [sortedInfo, setSortedInfo] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { serviceClass, fetchKeycloakUsersCreator, keycloakUsers } = props;

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  React.useEffect(() => {
    if (isLoading) {
      const serve = new serviceClass('/users');
      serve
        .list()
        .then((res: KeycloakUser[]) => {
          if (isLoading) {
            fetchKeycloakUsersCreator(res);
            setIsLoading(false);
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
  if (isLoading) {
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
        filters: keycloakUsers.map((filteredUser: any, idx: number) => {
          return {
            text: (filteredUser as any)[fields[index]],
            value: (filteredUser as any)[fields[index]],
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
  dataElements.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'Actions',
    // eslint-disable-next-line react/display-name
    render: () => (
      <>
        <Link to="#" key="actions">
          {'Edit'}
        </Link>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <Popconfirm title="Are you sure delete this user?" okText="Yes" cancelText="No">
          <Link
            to="#"
            key="actions"
            onClick={(e) => {
              debugger;
              return;
            }}
          >
            {'Delete'}
          </Link>
        </Popconfirm>
      </>
    ),
  });
  const tableData: any = keycloakUsers.map((user: Partial<KeycloakUser>, index: number) => {
    return {
      key: `${index}`,
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      actions: 'Edit',
    };
  });
  return (
    <React.Fragment>
      <Row>
        <Col span={12}>
          <Space>
            <HeaderBreadCrumb isAdmin={true} />
            <Divider />
          </Space>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Space style={{ marginBottom: 16, justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              className="create-user"
              onClick={() => history.push('/user/new')}
            >
              Add User
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        {/* <ListView {...listViewProps} /> */}
        <Table
          columns={dataElements}
          dataSource={tableData}
          pagination={{ pageSize: 5 }}
          onChange={handleChange}
          bordered
        />
      </Row>
    </React.Fragment>
    // <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  );
};

Admin.defaultProps = defaultProps;

export { Admin };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUsers: KeycloakUser[];
}

// connect to store
const mapStateToProps = (state: Partial<Store>, _: PropsTypes): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  return { keycloakUsers };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

const ConnectedAdminView = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default ConnectedAdminView;
