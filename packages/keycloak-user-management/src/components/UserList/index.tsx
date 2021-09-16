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
  makeKeycloakUsersSelector,
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

// Define selector instance
const usersSelector = makeKeycloakUsersSelector();

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
    keycloakUsers,
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
   * @returns {Promise<KeycloakUser[]>} Return data Fetched from server
   */
  async function FetchData(page: number, pageSize: number): Promise<KeycloakUser[]> {
    let filterParams: Dictionary = { first: page * pageSize - pageSize, max: pageSize };
    if (searchParam) filterParams = { ...filterParams, first: 0, search: searchParam };
    const usersService = new serviceClass(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const res: KeycloakUser[] = await usersService.list(filterParams as Dictionary);
    fetchKeycloakUsersCreator(res, true);
    return keycloakUsers;
  }

  // React.useEffect(() => {}, [searchParam]);

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const isSearchActive = searchParam && searchParam.length;

  return (
    <section className="layout-content">
      <h5 className="mb-3">{lang.USER_MANAGEMENT_PAGE_HEADER}</h5>
      <Row className="list-view">
        <Col className="main-content" span={24}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} size={'middle'} />
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
              total={() => {
                if (isSearchActive) return keycloakUsers.length;

                const usersCountService = new serviceClass(
                  `${KEYCLOAK_URL_USERS_COUNT}`,
                  keycloakBaseURL
                );
                return usersCountService.list() as Promise<number>;
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
  keycloakUsers: KeycloakUser[];
  extraData: Dictionary;
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const keycloakUsers = usersSelector(state, {});
  const extraData = getExtraData(state);
  return { keycloakUsers, extraData };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  removeKeycloakUsersCreator: removeKeycloakUsers,
};

export const ConnectedUserList = connect(mapStateToProps, mapDispatchToProps)(UserList);
