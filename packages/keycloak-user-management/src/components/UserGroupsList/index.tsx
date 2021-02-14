/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Table, Spin, Divider, Dropdown, Menu, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import { createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  reducerName as keycloakUserGroupsReducerName,
  reducer as keycloakUserGroupsReducer,
} from '../../ducks/userGroups';
import {
  ACTIONS,
  ADD_USER_GROUP,
  ERROR_OCCURED,
  NAME,
  USER_GROUPS_PAGE_HEADER,
  VIEW_DETAILS,
} from '../../lang';
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

/** Register reducer */
reducerRegistry.register(keycloakUserGroupsReducerName, keycloakUserGroupsReducer);

// Define selector instance
const userGroupsSelector = makeKeycloakUserGroupsSelector();

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

/** Function which shows the list of all groups and their details
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns User Groups list display
 */
export const UserGroupsList: React.FC<Props & RouteComponentProps> = (
  props: Props & RouteComponentProps
) => {
  const dispatch = useDispatch();
  const searchQuery = getQueryParams(props.location)[SEARCH_QUERY_PARAM] as string;
  const getUserGroupsList = useSelector((state) =>
    userGroupsSelector(state, { searchText: searchQuery })
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { keycloakBaseURL } = props;

  useEffect(() => {
    if (isLoading) {
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      serve
        .list()
        .then((response: KeycloakUserGroup[]) => {
          dispatch(fetchKeycloakUserGroups(response));
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED))
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

  const columns = [
    {
      title: NAME,
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: ACTIONS,
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (record: KeycloakUserGroup) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={`${URL_USER_GROUP_EDIT}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item className="viewdetails">{VIEW_DETAILS}</Menu.Item>
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
    <div className="content-section">
      <Helmet>
        <title>{USER_GROUPS_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={USER_GROUPS_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_USER_GROUP_CREATE}>
              <Button type="primary">
                <PlusOutlined />
                {ADD_USER_GROUP}
              </Button>
            </Link>
          </div>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

UserGroupsList.defaultProps = defaultProps;

export default UserGroupsList;
