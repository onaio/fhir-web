import * as React from 'react';
import { notification, Row, Col, Button, Space, Table, Divider, Popconfirm } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Link } from 'react-router-dom';
import { history } from '@onaio/connected-reducer-registry';
import Ripple from '../components/Loading';
import HeaderBreadCrumb from './HeaderBreadCrumb';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  getKeycloakUsersArray,
  removeKeycloakUsers,
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  makeAPIStateSelector,
} from '@opensrp/store';
import { Store } from 'redux';
import { PropsTypes } from './CreateEditUser';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  URL_USER_CREATE,
  DELETE,
  ERROR_OCCURED,
  USER_DELETED_SUCCESSFULLY,
  URL_USER_EDIT,
} from '../constants';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

// const { Content } = Layout;

// props interface to Admin component
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakUsers: KeycloakUser[];
  accessToken: string;
}

/** default props for UserIdSelect component */
export const defaultProps = {
  accessToken: '',
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
 *
 * @param {object} props - the headers
 * @param {string} userId - the user id
 */
export const deleteUser = (props: Props, userId: string): void => {
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator,
    accessToken,
  } = props;
  const serviceDelete = new serviceClass(
    accessToken,
    `/users/${userId}`,
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage'
  );
  const serviceGet = new serviceClass(
    accessToken,
    '/users',
    'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage'
  );
  serviceDelete
    .delete()
    .then(() => {
      notification.success({
        message: `${USER_DELETED_SUCCESSFULLY}`,
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
            message: `${ERROR_OCCURED}`,
            description: '',
          });
        });
    })
    .catch((_: Error) => {
      notification.error({
        message: `${ERROR_OCCURED}`,
        description: '',
      });
    });
};

const Admin = (props: Props): JSX.Element => {
  const [filteredInfo, setFilteredInfo] = React.useState<Dictionary>();
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { serviceClass, fetchKeycloakUsersCreator, keycloakUsers, accessToken } = props;

  const handleChange = (pagination: Dictionary, filters: Dictionary, sorter: Dictionary) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  React.useEffect(() => {
    if (isLoading) {
      const serve = new serviceClass(
        accessToken,
        '/users',
        'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage'
      );
      serve
        .list()
        .then((res: KeycloakUser[]) => {
          if (isLoading) {
            setIsLoading(false);
            fetchKeycloakUsersCreator(res);
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
        <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
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
          onConfirm={() => deleteUser(props, record.id)}
        >
          <Link to="#">{DELETE}</Link>
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
              onClick={() => history.push(URL_USER_CREATE)}
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
  accessToken: string;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, _: PropsTypes): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  const accessToken = makeAPIStateSelector()(state, { accessToken: true });
  return { keycloakUsers, accessToken };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

export const ConnectedAdminView = connect(mapStateToProps, mapDispatchToProps)(Admin);
