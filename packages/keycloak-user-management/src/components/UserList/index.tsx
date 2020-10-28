import * as React from 'react';
import { notification, Row, Col, Button, Space, Table, Divider } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { history } from '@onaio/connected-reducer-registry';
import Ripple from '../Loading';
import HeaderBreadCrumb from '../HeaderBreadCrumb';
import { getAccessToken } from '@opensrp/store';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  getKeycloakUsersArray,
  removeKeycloakUsers,
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
} from '../../ducks/user';
import { URL_USER_CREATE, KEYCLOAK_URL_USERS } from '../../constants';
import { getTableColumns } from './utils';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** interface for component props */
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakUsers: KeycloakUser[];
  accessToken: string;
  keycloakBaseURL: string;
}

/** default component props */
export const defaultProps = {
  accessToken: '',
  serviceClass: KeycloakService,
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
  keycloakUsers: [],
  keycloakBaseURL: '',
};

interface TableData {
  key: number | string;
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}

const UserList = (props: Props): JSX.Element => {
  const [filteredInfo, setFilteredInfo] = React.useState<Dictionary>();
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator,
    keycloakUsers,
    accessToken,
    keycloakBaseURL,
  } = props;

  React.useEffect(() => {
    if (isLoading) {
      const serve = new serviceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
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
    <>
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
          columns={getTableColumns(
            keycloakUsers,
            fetchKeycloakUsersCreator,
            removeKeycloakUsersCreator,
            accessToken,
            keycloakBaseURL,
            filteredInfo,
            sortedInfo
          )}
          dataSource={tableData as KeycloakUser[]}
          pagination={{ pageSize: 5 }}
          onChange={(_: Dictionary, filters: Dictionary, sorter: Dictionary) => {
            setFilteredInfo(filters);
            setSortedInfo(sorter);
          }}
          bordered
        />
      </Row>
    </>
  );
};

UserList.defaultProps = defaultProps;
export { UserList };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUsers: KeycloakUser[];
  accessToken: string;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, _: Props): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  const accessToken = getAccessToken(state) as string;
  return { keycloakUsers, accessToken };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

export const ConnectedUserList = connect(mapStateToProps, mapDispatchToProps)(UserList);
