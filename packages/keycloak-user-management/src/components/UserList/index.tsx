import * as React from 'react';
import { Row, Col, Button, Space, Table, Divider } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Spin } from 'antd';
import { makeAPIStateSelector } from '@opensrp/store';
import { Store } from 'redux';
import { connect, useSelector } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import { getFilteredDataArray, SearchBar } from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  getKeycloakUsersArray,
  removeKeycloakUsers,
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
} from '../../ducks/user';
import { URL_USER_CREATE, KEYCLOAK_URL_USERS, ERROR_OCCURED, NO_DATA_FOUND } from '../../constants';
import { getTableColumns } from './utils';
import { getExtraData } from '@onaio/session-reducer';
import { useHistory } from 'react-router';
import { sendErrorNotification } from '@opensrp/notifications';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

// Define selector instance
const getAccessToken = makeAPIStateSelector();

/** interface for component props */
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakUsers: KeycloakUser[];
  accessToken: string;
  keycloakBaseURL: string;
  extraData: Dictionary;
}

/** default component props */
export const defaultProps = {
  accessToken: '',
  serviceClass: KeycloakService,
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
  keycloakUsers: [],
  keycloakBaseURL: '',
  extraData: {},
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
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const filteredData = useSelector((state) => getFilteredDataArray(state));
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator,
    keycloakUsers,
    accessToken,
    keycloakBaseURL,
    extraData,
  } = props;

  const isLoadingCallback = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };
  const history = useHistory();

  React.useEffect(() => {
    if (isLoading) {
      const serve = new serviceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
      serve
        .list()
        .then((res: KeycloakUser[]) => {
          return fetchKeycloakUsersCreator(res);
        })
        .catch((_: Error) => {
          return sendErrorNotification(ERROR_OCCURED);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  });

  if (isLoading) {
    return <Spin size="large" />;
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
    <section className="layout-content">
      <h5 className="mb-3">User Management</h5>
      <Row>
        <Col className="bg-white p-3" span={24}>
          <SearchBar data={tableData} size="small" filterField={'username'} />
          <Space style={{ marginBottom: 16, float: 'right' }}>
            <Button
              type="primary"
              className="create-user"
              onClick={() => history.push(URL_USER_CREATE)}
            >
              <PlusOutlined />
              Add User
            </Button>
            <Divider type="vertical" />
            <SettingOutlined />
          </Space>
          <Space>
            {tableData.length > 0 ? (
              <Table
                columns={getTableColumns(
                  removeKeycloakUsersCreator,
                  accessToken,
                  keycloakBaseURL,
                  isLoadingCallback,
                  extraData,
                  sortedInfo
                )}
                dataSource={filteredData.length ? filteredData : (tableData as KeycloakUser[])}
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  defaultPageSize: 5,
                  pageSizeOptions: ['5', '10', '20', '50', '100'],
                }}
                onChange={(_: Dictionary, __: Dictionary, sorter: Dictionary) => {
                  setSortedInfo(sorter);
                }}
              />
            ) : (
              NO_DATA_FOUND
            )}
          </Space>
        </Col>
      </Row>
    </section>
  );
};

UserList.defaultProps = defaultProps;
export { UserList };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUsers: KeycloakUser[];
  accessToken: string;
  extraData: Dictionary;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, _: Props): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  const accessToken = getAccessToken(state, { accessToken: true });
  const extraData = getExtraData(state);
  return { keycloakUsers, accessToken, extraData };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

export const ConnectedUserList = connect(mapStateToProps, mapDispatchToProps)(UserList);
