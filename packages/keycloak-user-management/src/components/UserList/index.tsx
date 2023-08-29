import React, { useState } from 'react';
import { PageHeader } from '@opensrp/react-utils';
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
  OpenSRPService,
} from '@opensrp/react-utils';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { PlusOutlined } from '@ant-design/icons';
import {
  KeycloakUser,
  fetchKeycloakUsers,
  removeKeycloakUsers,
  reducerName as keycloakUsersReducerName,
  reducer as keycloakUsersReducer,
  Practitioner,
} from '../../ducks/user';
import {
  URL_USER_CREATE,
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_USERS_COUNT,
  SEARCH_QUERY_PARAM,
  OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
  ORGANIZATION_BY_PRACTITIONER,
  UserQueryId,
} from '../../constants';
import { useTranslation } from '../../mls';
import { getTableColumns } from './utils';
import { getExtraData } from '@onaio/session-reducer';
import { RouteComponentProps, useHistory } from 'react-router';
import { sendErrorNotification } from '@opensrp/notifications';
import { TableActions } from './TableActions';
import { UserDetails, UserDetailType } from '../UserDetails';
import { Organization } from '@opensrp/team-management';
import { RbacCheck } from '@opensrp/rbac';

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
  const { t } = useTranslation();

  const searchParam = getQueryParams(props.location)[SEARCH_QUERY_PARAM] ?? '';
  const [sortedInfo, setSortedInfo] = useState<Dictionary>();
  const [userDetails, setUserDetails] = useState<UserDetailType | null>(null);
  const [openDetails, setOpenDetails] = useState<boolean>(false);

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
    if (searchquery) filterParams = { ...filterParams, search: searchParam };
    const usersService = new serviceClass(KEYCLOAK_URL_USERS, keycloakBaseURL);
    const keycloakUsers: KeycloakUser[] = await usersService.list(filterParams as Dictionary);
    fetchKeycloakUsersCreator(keycloakUsers, true);
    return keycloakUsers;
  }

  const isSearchActive = searchParam && searchParam.length;

  // fetch practitioner tied to keycloak user
  const fetchPractitioner = async (userId: string) => {
    const serve = new OpenSRPService(OPENSRP_CREATE_PRACTITIONER_ENDPOINT, opensrpBaseURL);
    try {
      const practitioner: Practitioner | undefined = await serve.read(userId);
      return practitioner;
    } catch (error) {
      sendErrorNotification(t('There was a problem fetching Practitioner tied to this User'));
      return undefined;
    }
  };

  // fetch teams (organizations) a practitioner is assigned to
  const fetchAssignedTeams = async (practitionerId: string) => {
    const serve = new OpenSRPService(ORGANIZATION_BY_PRACTITIONER, opensrpBaseURL);
    try {
      const organizations: Organization[] = await serve.read(practitionerId);
      return organizations;
    } catch (error) {
      sendErrorNotification(t('There was a problem fetching teams assigned to Practitioner'));
      return [];
    }
  };

  // Callback function that populates the user details section from table row data (keycloak user)
  const setDetailsCallback = async (keycloakUser: KeycloakUser) => {
    // show spinner between evaluations without closing modal
    onCloseCallback();

    // open details section
    setOpenDetails(true);

    // fetch practitioner
    fetchPractitioner(keycloakUser.id)
      .then((practitioner: Practitioner | undefined) => {
        if (practitioner) {
          // fetch assigned teams
          fetchAssignedTeams(practitioner.identifier)
            .then((assignedTeams: Organization[]) => {
              setUserDetails({
                keycloakUser: keycloakUser,
                practitioner: practitioner,
                assignedTeams: assignedTeams,
              });
            })
            .catch(() => {
              sendErrorNotification(t('There was a problem fetching assigned teams'));
            });
        } else {
          setUserDetails({
            keycloakUser: keycloakUser,
            practitioner: practitioner,
            assignedTeams: [],
          });
        }
      })
      .catch(() => {
        sendErrorNotification(t('There was a problem fetching practitioner'));
      });
  };

  // reset values and close modal
  const onCloseCallback = () => {
    setUserDetails(null);
    setOpenDetails(false);
  };

  return (
    <section className="content-section">
      <PageHeader title={t('User Management')} />
      <Row className="list-view">
        <Col className="main-content" span={openDetails ? 19 : 24}>
          <div className="main-content__header">
            <SearchForm
              defaultValue={getQueryParams(props.location)[SEARCH_QUERY_PARAM]}
              onChange={createChangeHandler(SEARCH_QUERY_PARAM, props)}
              size={'middle'}
            />
            <RbacCheck permissions={['iam_user.create']}>
              <Space style={{ marginBottom: 16, float: 'right' }}>
                <Button
                  type="primary"
                  className="create-user"
                  onClick={() => history.push(URL_USER_CREATE)}
                >
                  <PlusOutlined />
                  {t('Add User')}
                </Button>
              </Space>
            </RbacCheck>
          </div>
          <Space>
            <PaginateData<KeycloakUser>
              queryFn={FetchData}
              onError={() => sendErrorNotification(t('There was a problem fetching Users'))}
              queryPram={{ searchParam }}
              pageSize={usersPageSize}
              queryid={UserQueryId}
              total={() => {
                const usersCountService = new serviceClass(
                  `${KEYCLOAK_URL_USERS_COUNT}`,
                  keycloakBaseURL
                );

                let filterParams: Dictionary | undefined = undefined;
                if (isSearchActive) filterParams = { search: searchParam };

                return usersCountService.list(filterParams);
              }}
            >
              {(tableProps) => (
                <TableLayout
                  {...tableProps}
                  columns={getTableColumns(t, sortedInfo)}
                  dataKeyAccessor="id"
                  // eslint-disable-next-line @typescript-eslint/naming-convention
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
                        setDetailsCallback,
                      };
                      return <TableActions {...tableActionsProps} />;
                    },
                  }}
                />
              )}
            </PaginateData>
          </Space>
        </Col>
        {openDetails ? (
          <Col className="pl-3" span={5}>
            <UserDetails onClose={() => onCloseCallback()} {...userDetails} />
          </Col>
        ) : null}
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
