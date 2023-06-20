/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@ant-design/pro-layout';
import { Row, Col, Button, Spin, Divider, Dropdown, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import {
  createChangeHandler,
  getQueryParams,
  SearchForm,
  TableLayout,
  Column,
  Resource404,
} from '@opensrp/react-utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import { useQuery } from 'react-query';
import {
  reducerName as keycloakUserGroupsReducerName,
  reducer as keycloakUserGroupsReducer,
} from '../../ducks/userGroups';
import { useTranslation } from '../../mls';
import {
  KEYCLOAK_URL_USER_GROUPS,
  SEARCH_QUERY_PARAM,
  URL_USER_GROUP_CREATE,
  URL_USER_GROUP_EDIT,
} from '../../constants';
import {
  fetchKeycloakUserGroups,
  KeycloakUserGroup,
  makeKeycloakUserGroupsSelector,
} from '../../ducks/userGroups';
import { ViewDetails } from '../UserGroupDetailView';
import { loadGroupDetails, loadGroupMembers } from '../UserGroupsList/utils';
import { UserGroup } from 'keycloak-user-management/src/ducks/user';

/** Register reducer */
reducerRegistry.register(keycloakUserGroupsReducerName, keycloakUserGroupsReducer);

// Define selector instance
const userGroupsSelector = makeKeycloakUserGroupsSelector();

// route params for user group pages
interface RouteParams {
  userGroupId: string | undefined;
}

export interface UserGroupMembers {
  createdTimestamp: number;
  disableableCredentialTypes?: string[];
  email?: string;
  emailVerified: boolean;
  enabled: boolean;
  firstName: string;
  id: string;
  lastName: string;
  notBefore: number;
  totp: boolean;
  username: string;
}

interface Props {
  keycloakBaseURL: string;
}

/** default component props */
const defaultProps = {
  keycloakBaseURL: '',
};

export type UserGroupListTypes = Props & RouteComponentProps<RouteParams>;

/**
 * Component which shows the list of all groups and their details
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns User Groups list display
 */
export const UserGroupsList: React.FC<UserGroupListTypes> = (props: UserGroupListTypes) => {
  const { keycloakBaseURL } = props;
  const dispatch = useDispatch();
  const searchQuery = getQueryParams(props.location)[SEARCH_QUERY_PARAM] as string;
  const getUserGroupsList = useSelector((state) =>
    userGroupsSelector(state, { searchText: searchQuery })
  );
  const [groupId, setGroupId] = useState<string | null>(null);
  const { t } = useTranslation();

  const { isLoading: isUserGroupsLoading, isError: isUserGroupsError } = useQuery(
    ['fetchKeycloakUserGroups', KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL],
    () => new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL).list(),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      onSuccess: (response: KeycloakUserGroup[]) => dispatch(fetchKeycloakUserGroups(response)),
    }
  );

  const {
    isLoading: isGroupDetailsLoading,
    isError: isGroupDetailsError,
    data: GroupDetails,
  } = useQuery(
    ['loadGroupDetails', groupId, keycloakBaseURL],
    () => loadGroupDetails(groupId as string, keycloakBaseURL),
    {
      enabled: groupId !== null,
      onError: () => sendErrorNotification(t('An error occurred')),
    }
  );

  const {
    isLoading: isUserGroupMembersLoading,
    isError: isUserGroupMembersError,
    data: userGroupMembers,
  } = useQuery(
    ['loadGroupMembers', groupId, keycloakBaseURL],
    () => loadGroupMembers(groupId as string, keycloakBaseURL),
    {
      enabled: groupId !== null,
      onError: () => sendErrorNotification(t('An error occurred')),
    }
  );

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const columns: Column<KeycloakUserGroup>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
  ];

  if (isUserGroupsLoading) {
    return <Spin data-testid="group-list-loader" size="large" className="custom-spinner" />;
  }

  if (isUserGroupsError) return <Resource404 />;

  console.log("Confirm record type")
  const getItems = (record: any): MenuProps['items'] => [
    {
      key: record.id,
      label: (
        <Button
          type='link'
          data-testid='view-details'
          onClick={() => {
            setGroupId(record.id);
          }}
        >
          {t('View Details')}
        </Button>
      )
    }
  ]

  return (
    <div className="content-section">
      <Helmet>
        <title>{t('User Groups')}</title>
      </Helmet>
      <PageHeader title={t('User Groups')} className="page-header" />
      <Row className="list-view">
        <Col className={'main-content'}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_USER_GROUP_CREATE}>
              <Button type="primary">
                <PlusOutlined rev={undefined} />
                {t('New User Group')}
              </Button>
            </Link>
          </div>
          <TableLayout
            id="UserGroupsList"
            persistState={true}
            datasource={getUserGroupsList}
            columns={columns}
            actions={{
              title: t('Actions'),
              width: '10%',
              // eslint-disable-next-line react/display-name
              render: (record) => (
                <span>
                  <Link to={`${URL_USER_GROUP_EDIT}/${record.id}`}>
                    <Button type="link" className="m-0 p-1">
                      {t('Edit')}
                    </Button>
                  </Link>
                  <Divider type="vertical" />
                  <Dropdown
                    menu={{ items: getItems(record) }}
                    placement="bottomLeft"
                    arrow
                    trigger={['click']}
                  >
                    <MoreOutlined className="more-options" data-testid='more-options' rev={undefined} />
                  </Dropdown>
                </span>
              ),
            }}
          />
        </Col>
        {groupId ? (
          <Col className="pl-3" span={5}>
            <ViewDetails
              loading={isGroupDetailsLoading || isUserGroupMembersLoading}
              error={isGroupDetailsError || isUserGroupMembersError}
              GroupDetails={GroupDetails}
              userGroupMembers={userGroupMembers}
              onClose={() => {
                setGroupId(null);
              }}
            />
          </Col>
        ) : null}
      </Row>
    </div>
  );
};

UserGroupsList.defaultProps = defaultProps;

export default UserGroupsList;
