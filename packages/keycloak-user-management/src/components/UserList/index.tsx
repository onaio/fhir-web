import * as React from 'react';
import { Row, Col, Button, Space, Table } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Spin } from 'antd';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { Dictionary } from '@onaio/utils';
import { createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
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

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

// Define selector instance
const usersSelector = makeKeycloakUsersSelector();

export interface PaginationProps {
  currentPage: number;
  pageSize: number | undefined;
}

/** interface for component props */
export interface Props {
  serviceClass: typeof KeycloakService;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakUsers: KeycloakUser[];
  keycloakBaseURL: string;
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
  extraData: {},
  usersPageSie: 20,
};

interface TableData {
  key: number | string;
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  enabled: string | undefined;
}

export type UserListTypes = Props & RouteComponentProps;

const UserList = (props: UserListTypes): JSX.Element => {
  const [sortedInfo, setSortedInfo] = React.useState<Dictionary>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [usersCount, setUsersCount] = React.useState<number>(0);
  const [pageProps, setPageProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: 20,
  });
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator,
    keycloakUsers,
    keycloakBaseURL,
    extraData,
    usersPageSize,
  } = props;

  const isLoadingCallback = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };
  const history = useHistory();

  const searchParam = getQueryParams(props.location)[SEARCH_QUERY_PARAM] ?? '';

  React.useEffect(() => {
    const { currentPage, pageSize } = pageProps;
    let filterParams: Dictionary = {
      first: currentPage * (pageSize ?? usersPageSize) - (pageSize ?? usersPageSize),
      max: pageSize ?? usersPageSize,
    };
    if (searchParam) {
      filterParams = {
        ...filterParams,
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
        if (keycloakUsers.length) {
          removeKeycloakUsersCreator();
        }
        fetchKeycloakUsersCreator(res);
      });

    Promise.all([usersCountPromise, usersListPromise])
      .catch(() => sendErrorNotification(lang.ERROR_OCCURED))
      .finally(() => setIsLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, JSON.stringify(pageProps)]);

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
            <Table
              columns={getTableColumns(
                removeKeycloakUsersCreator,
                keycloakBaseURL,
                isLoadingCallback,
                extraData,
                sortedInfo
              )}
              dataSource={tableData}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultPageSize: usersPageSize,
                pageSize: pageProps.pageSize,
                current: pageProps.currentPage,
                onChange: (page: number, pageSize: number | undefined) => {
                  setPageProps({
                    currentPage: page,
                    pageSize: pageSize,
                  });
                  setIsLoading(true);
                },
                total: searchParam && searchParam.length ? keycloakUsers.length : usersCount,
                pageSizeOptions: ['5', '10', '20', '50', '100'],
              }}
              onChange={(_: Dictionary, __: Dictionary, sorter: Dictionary) => {
                setSortedInfo(sorter);
              }}
            />
            )
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
