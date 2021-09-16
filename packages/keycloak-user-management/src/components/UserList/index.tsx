import * as React from 'react';
import { Row, Col, Button, Space } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import {
  createChangeHandler,
  getQueryParams,
  SearchForm,
  TableLayout,
  PaginateData,
} from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { PlusOutlined } from '@ant-design/icons';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  removeKeycloakUsers,
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
} from '../../ducks/user';
import {
  URL_USER_CREATE,
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_USERS_COUNT,
  SEARCH_QUERY_PARAM,
} from '../../constants';
import lang from '../../lang';
import { getTableColumns } from './utils';
import { getExtraData } from '@onaio/session-reducer';
import { RouteComponentProps, useHistory } from 'react-router';
import { sendErrorNotification } from '@opensrp/notifications';
import { TableActions } from './TableActions';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** interface for component props */
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakUsers: KeycloakUser[];
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  extraData: Dictionary;
  usersPageSize: number;
}

/** default component props */
export const defaultProps = {
  serviceClass: KeycloakService,
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
  keycloakUsers: [],
  keycloakBaseURL: '',
  opensrpBaseURL: '',
  extraData: {},
  usersPageSize: 20,
};

export type UserListTypes = Props & RouteComponentProps;

const UserList = (props: UserListTypes): JSX.Element => {
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator,
    keycloakBaseURL,
    opensrpBaseURL,
    extraData,
    usersPageSize,
  } = props;

  const history = useHistory();

  const searchParam = getQueryParams(props.location)[SEARCH_QUERY_PARAM] ?? '';
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();

  /**
   * Function to fetch Users
   *
   * @param {number} page - current Page number in Table
   * @param {number} pageSize - Page Size of the table
   * @param {string|undefined} searchquery - searchquery generated from Paginated data
   * @returns {Promise<KeycloakUser[]>} Return data Fetched from server
   */
  async function FetchData(
    page: number,
    pageSize: number,
    searchquery?: string
  ): Promise<KeycloakUser[]> {
    let filterParams: Dictionary = { first: page * pageSize - pageSize, max: pageSize };
    if (searchquery) filterParams = { ...filterParams, first: 0, search: searchParam };
    const usersService = new serviceClass(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const keycloakUsers: KeycloakUser[] = await usersService.list(filterParams as Dictionary);
    fetchKeycloakUsersCreator(keycloakUsers, true);
    return keycloakUsers;
  }

  const isSearchActive = searchParam && searchParam.length;

  return (
    <section className="layout-content">
      <h5 className="mb-3">{lang.USER_MANAGEMENT_PAGE_HEADER}</h5>
      <Row className="list-view">
        <Col className="main-content" span={24}>
          <div className="main-content__header">
            <SearchForm
              defaultValue={getQueryParams(props.location)[SEARCH_QUERY_PARAM]}
              onChange={createChangeHandler(SEARCH_QUERY_PARAM, props)}
              size={'middle'}
            />
            <Space style={{ marginBottom: 16, float: 'right' }}>
              <Button
                type="primary"
                className="create-user"
                onClick={() => history.push(URL_USER_CREATE)}
              >
                <PlusOutlined />
                {lang.ADD_USER}
              </Button>
            </Space>
          </div>
          <Space>
            <PaginateData<KeycloakUser>
              queryFn={FetchData}
              onError={() => sendErrorNotification(lang.ERROR_OCCURED)}
              queryPram={{ searchParam }}
              pageSize={usersPageSize}
              queryid="Users"
              total={(data) => {
                if (isSearchActive) return data.length;

                const usersCountService = new serviceClass(
                  `${KEYCLOAK_URL_USERS_COUNT}`,
                  keycloakBaseURL
                );
                return usersCountService.list();
              }}
            >
              {(tableProps) => (
                <TableLayout
                  {...tableProps}
                  columns={getTableColumns(sortedInfo)}
                  dataKeyAccessor="id"
                  onChange={(_, __, sorter) => setSortedInfo(sorter)}
                  actions={{
                    title: 'Actions',
                    // eslint-disable-next-line react/display-name
                    render: (_, record) => {
                      const tableActionsProps = {
                        removeKeycloakUsersCreator,
                        keycloakBaseURL,
                        opensrpBaseURL,
                        record,
                        extraData,
                      };
                      return <TableActions {...tableActionsProps} />;
                    },
                  }}
                />
              )}
            </PaginateData>
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
  extraData: Dictionary;
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const extraData = getExtraData(state);
  return { extraData };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

export const ConnectedUserList = connect(mapStateToProps, mapDispatchToProps)(UserList);
