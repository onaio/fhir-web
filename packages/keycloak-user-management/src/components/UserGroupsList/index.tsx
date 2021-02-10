/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Table, Spin, Divider, Dropdown, Menu } from 'antd';
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
import { ERROR_OCCURED } from '../../lang';
import { KEYCLOAK_URL_USER_GROUPS, SEARCH_QUERY_PARAM } from '../../constants';
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
  keycloakUserGroups: KeycloakUserGroup[];
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

  if (isLoading)
    return (
      <Spin
        size="large"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '85vh',
        }}
      />
    );

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
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: () => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to="#">
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item className="viewdetails">{'View Details'}</Menu.Item>
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
    <section className="layout-content">
      <Helmet>
        <title>{'User Groups'}</title>
      </Helmet>
      <h5 className="mb-3">{'User Groups'}</h5>
      <Row>
        <Col className="bg-white p-3" span={24}>
          <div className="mb-3 d-flex justify-content-between">
            <SearchForm {...searchFormProps} />
            <div>
              <Link to="#">
                <Button type="primary">
                  <PlusOutlined />
                  {'New User Group'}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
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
          </div>
        </Col>
      </Row>
    </section>
  );
};

UserGroupsList.defaultProps = defaultProps;

export default UserGroupsList;
