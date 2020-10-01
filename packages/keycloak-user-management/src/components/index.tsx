import * as React from 'react';
import { notification, Row, Col, Button, Space, Table, Divider, Popconfirm } from 'antd';
import '../Home/Home.css';
import { KeycloakService } from '../services';
import { Link } from 'react-router-dom';
import { history } from '@onaio/connected-reducer-registry';
import Ripple from '../../../../client/src/components/page/Loading';
import HeaderBreadCrumb from '../../../../client/src/components/page/HeaderBreadCrumb';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  getKeycloakUsersArray,
  removeKeycloakUsers,
} from '../ducks';
import { Store } from 'redux';
import { PropsTypes } from './CreateEditUser';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils/dist/types/types';

// const { Content } = Layout;

// props interface to Admin component
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakUsers: KeycloakUser[];
}

/** default props for UserIdSelect component */
export const defaultProps = {
  serviceClass: KeycloakService,
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
  keycloakUsers: [],
};

interface TableData {
  key: number | string;
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

/**
 * Handle user deletion
 */
export const deleteUser = (
  serviceClass: typeof KeycloakService,
  userId: string,
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers,
  removeKeycloakUsersCreator: typeof removeKeycloakUsers
): void => {
  const serviceDelete = new serviceClass(`/users/${userId}`);
  const serviceGet = new serviceClass('/users');
  serviceDelete
    .delete()
    .then(() => {
      notification.success({
        message: 'User deleted successfully',
        description: '',
      });
      serviceGet
        .list()
        .then((res: KeycloakUser[]) => {
          // @todo Add action to handle removing one user from the store and
          // remove this workaround that first removes then refetches users
          removeKeycloakUsersCreator();
          fetchKeycloakUsersCreator(res);
        })
        .catch((_: Error) => {
          notification.error({
            message: 'An error occurred',
            description: '',
          });
        });
    })
    .catch((_: Error) => {
      notification.error({
        message: 'An error occurred',
        description: '',
      });
    });
};

const Admin = (props: Props): JSX.Element => {
  const [filteredInfo, setFilteredInfo] = React.useState<Dictionary>();
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    keycloakUsers,
    removeKeycloakUsersCreator,
  } = props;

  const handleChange = (pagination: Dictionary, filters: Dictionary, sorter: Dictionary) => {
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

  const headerItems: string[] = ['Username', 'Email', 'First Name', 'Last Name'];

  const dataElements = [];
  const fields: string[] = ['username', 'email', 'firstName', 'lastName'];
  fields.forEach((field: string, index: number) => {
    const dataFilters = keycloakUsers.map((filteredUser: KeycloakUser | Dictionary) => {
      return {
        text: (filteredUser as Dictionary)[field],
        value: (filteredUser as Dictionary)[field],
      };
    });
    dataElements.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      filters: Array.from(new Set(dataFilters)),
      filteredValue: (filteredInfo && filteredInfo[fields[index]]) || null,
      onFilter: (value: string, record: Dictionary) => record[fields[index]].includes(value),
      sorter: (a: Dictionary, b: Dictionary) => {
        if (b[fields[index]]) {
          return a[fields[index]].length - b[fields[index]].length;
        }
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true,
    });
  });
  // append action column
  dataElements.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'Actions',
    // eslint-disable-next-line react/display-name
    render: (_: string, record: KeycloakUser) => (
      <>
        <Link to={`/user/edit/${record.id}`} key="actions">
          {'Edit'}
        </Link>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <span>&nbsp;</span>
        <Popconfirm
          title="Are you sure delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={() =>
            deleteUser(
              serviceClass,
              record.id,
              fetchKeycloakUsersCreator,
              removeKeycloakUsersCreator
            )
          }
        >
          <Link to="#">{'Delete'}</Link>
        </Popconfirm>
      </>
    ),
  });
  const tableData: TableData[] = keycloakUsers.map((user: KeycloakUser, index: number) => {
    return {
      key: `${index}`,
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
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
        <Table
          columns={dataElements}
          dataSource={tableData as KeycloakUser[]}
          pagination={{ pageSize: 5 }}
          onChange={handleChange}
          bordered
        />
      </Row>
    </React.Fragment>
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
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

const ConnectedAdminView = connect(mapStateToProps, mapDispatchToProps)(Admin);
export default ConnectedAdminView;
