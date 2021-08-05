import * as React from 'react';
import { Row, Col, Button, Space } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Spin } from 'antd';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import { createChangeHandler, getQueryParams, SearchForm, TableLayout } from '@opensrp/react-utils';
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
import { PaginationProps } from 'antd/lib/pagination';
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

export interface TableData {
  key: number | string;
  id: string;
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  enabled: string | undefined;
}

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

  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [usersCount, setUsersCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<Pick<PaginationProps, 'current' | 'pageSize'>>({
    current: 1,
    pageSize: usersPageSize,
  });

  const isLoadingCallback = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };
  const history = useHistory();

  const searchParam = getQueryParams(props.location)[SEARCH_QUERY_PARAM] ?? '';

  React.useEffect(() => {
    const { current, pageSize } = page;
    let filterParams: Dictionary = {
      first: (current ?? 1) * (pageSize ?? usersPageSize) - (pageSize ?? usersPageSize),
      max: pageSize ?? usersPageSize,
    };
    if (searchParam) {
      filterParams = {
        ...filterParams,
        first: 0,
        search: searchParam,
      };
    }
    const usersCountService = new serviceClass(`${KEYCLOAK_URL_USERS_COUNT}`, keycloakBaseURL);
    const usersCountPromise = usersCountService.list().then((res: number) => {
      setUsersCount(res);
    });
    const usersService = new serviceClass(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const usersListPromise = usersService
      .list(filterParams as Dictionary)
      .then((res: KeycloakUser[]) => {
        fetchKeycloakUsersCreator(res, true);
      });

    Promise.all([usersCountPromise, usersListPromise])
      .catch(() => sendErrorNotification(lang.ERROR_OCCURED))
      .finally(() => setIsLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, JSON.stringify(page)]);

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
      enabled: user.enabled ? 'Enabled' : 'Disabled',
    };
  });

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
            <TableLayout
              columns={getTableColumns(sortedInfo)}
              datasource={tableData}
              pagination={{
                current: page.current,
                pageSize: page.pageSize,
                total: isSearchActive ? keycloakUsers.length : usersCount,
              }}
              onChange={(pagination, __, sorter) => {
                setPage({
                  current: pagination.current ?? 1,
                  pageSize: pagination.pageSize ?? usersPageSize,
                });
                setSortedInfo(sorter);
              }}
              actions={{
                title: 'Actions',
                // eslint-disable-next-line react/display-name
                render: (_: string, record) => {
                  const tableActionsProps = {
                    removeKeycloakUsersCreator,
                    keycloakBaseURL,
                    opensrpBaseURL,
                    isLoadingCallback,
                    record,
                    extraData,
                  };
                  return <TableActions {...tableActionsProps} />;
                },
              }}
            />
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
