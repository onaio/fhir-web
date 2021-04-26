/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Spin, Divider, Dropdown, Menu, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import { RouteComponentProps, useHistory } from 'react-router';
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
} from '@opensrp/react-utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  reducerName as keycloakUserGroupsReducerName,
  reducer as keycloakUserGroupsReducer,
} from '../../ducks/userGroups';
import lang from '../../lang';
import {
  KEYCLOAK_URL_USER_GROUPS,
  ROUTE_PARAM_USER_GROUP_ID,
  SEARCH_QUERY_PARAM,
  URL_USER_GROUPS,
  URL_USER_GROUP_CREATE,
  URL_USER_GROUP_EDIT,
} from '../../constants';
import {
  fetchKeycloakUserGroups,
  KeycloakUserGroup,
  makeKeycloakUserGroupsSelector,
} from '../../ducks/userGroups';
import { ViewDetails } from '../UserGroupDetailView';

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

interface TableData {
  key: number | string;
  id: string | undefined;
  name: string;
}

interface Props {
  keycloakBaseURL: string;
}

/** default component props */
const defaultProps = {
  keycloakBaseURL: '',
};

export type UserGroupListTypes = Props & RouteComponentProps<RouteParams>;

/** Component which shows the list of all groups and their details
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns User Groups list display
 */
export const UserGroupsList: React.FC<UserGroupListTypes> = (props: UserGroupListTypes) => {
  const dispatch = useDispatch();
  const searchQuery = getQueryParams(props.location)[SEARCH_QUERY_PARAM] as string;
  const getUserGroupsList = useSelector((state) =>
    userGroupsSelector(state, { searchText: searchQuery })
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();
  const { keycloakBaseURL } = props;
  const groupId = props.match.params[ROUTE_PARAM_USER_GROUP_ID] ?? '';

  useEffect(() => {
    if (isLoading) {
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      serve
        .list()
        .then((response: KeycloakUserGroup[]) => {
          dispatch(fetchKeycloakUserGroups(response));
        })
        .catch(() => sendErrorNotification(lang.ERROR_OCCURED))
        .finally(() => setIsLoading(false));
    }
  });

  if (isLoading) return <Spin size="large" />;

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const tableData: TableData[] = getUserGroupsList.map(
    (userGroup: KeycloakUserGroup, index: number) => {
      return {
        key: `${index}`,
        id: userGroup.id,
        name: userGroup.name,
      };
    }
  );

  const columns: Column<TableData>[] = [
    {
      title: lang.NAME,
      dataIndex: 'name',
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: lang.ACTIONS,
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (record: KeycloakUserGroup) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={`${URL_USER_GROUP_EDIT}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              {lang.EDIT}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item
                  className="viewdetails"
                  onClick={() => {
                    history.push(`${URL_USER_GROUPS}/${record.id}`);
                  }}
                >
                  {lang.VIEW_DETAILS}
                </Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <div className="content-section user-group">
      <Helmet>
        <title>{lang.USER_GROUPS_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={lang.USER_GROUPS_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className={'main-content'}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_USER_GROUP_CREATE}>
              <Button type="primary">
                <PlusOutlined />
                {lang.ADD_USER_GROUP}
              </Button>
            </Link>
          </div>
          <TableLayout
            datasource={tableData}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
        <ViewDetails keycloakBaseURL={keycloakBaseURL} groupId={groupId} />
      </Row>
    </div>
  );
};

UserGroupsList.defaultProps = defaultProps;

export default UserGroupsList;
