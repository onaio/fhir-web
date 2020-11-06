import * as React from 'react';
import { notification, Row, Col, Button, Space, Table, Divider } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import Ripple from '../Loading';
import { makeAPIStateSelector } from '@opensrp/store';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils';
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
import { URL_USER_CREATE, KEYCLOAK_URL_USERS } from '../../constants';
import { getTableColumns } from './utils';
import { getExtraData } from '@onaio/session-reducer';
import { useHistory } from 'react-router';

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
        <Col span={24}>
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
        </Col>
      </Row>
      <Row>
        <Table
          columns={getTableColumns(
            removeKeycloakUsersCreator,
            accessToken,
            keycloakBaseURL,
            isLoadingCallback,
            extraData,
            sortedInfo
          )}
          dataSource={tableData as KeycloakUser[]}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
          }}
          onChange={(_: Dictionary, __: Dictionary, sorter: Dictionary) => {
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
