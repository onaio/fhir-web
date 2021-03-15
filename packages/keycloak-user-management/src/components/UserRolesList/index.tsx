/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Table, Spin, PageHeader } from 'antd';
import { RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import { createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
import {
  reducerName as keycloakUserRolesReducerName,
  reducer as keycloakUserRolesReducer,
} from '../../ducks/userRoles';
import { COMPOSITE, DESCRIPTION, ERROR_OCCURED, NAME, USER_ROLES_PAGE_HEADER } from '../../lang';
import { SEARCH_QUERY_PARAM } from '../../constants';
import { KeycloakUserRole, makeKeycloakUserRolesSelector } from '../../ducks/userRoles';
import { fetchAllRoles } from './utils';

/** Register reducer */
reducerRegistry.register(keycloakUserRolesReducerName, keycloakUserRolesReducer);

// Define selector instance
const userRolesSelector = makeKeycloakUserRolesSelector();

interface TableData {
  key: number | string;
  id: string | undefined;
  name: string;
  composite: boolean | string;
  description: string;
}

interface Props {
  keycloakBaseURL: string;
}

/** default component props */
const defaultProps = {
  keycloakBaseURL: '',
};

/** Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */
export const UserRolesList: React.FC<Props & RouteComponentProps> = (
  props: Props & RouteComponentProps
) => {
  const dispatch = useDispatch();
  const searchQuery = getQueryParams(props.location)[SEARCH_QUERY_PARAM] as string;
  const getUserRolesList = useSelector((state) =>
    userRolesSelector(state, { searchText: searchQuery })
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { keycloakBaseURL } = props;

  useEffect(() => {
    if (isLoading) {
      fetchAllRoles(keycloakBaseURL, dispatch)
        .catch(() => sendErrorNotification(ERROR_OCCURED))
        .finally(() => setIsLoading(false));
    }
  });

  if (isLoading) return <Spin size="large" />;

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const tableData: TableData[] = getUserRolesList.map(
    (userRole: KeycloakUserRole, index: number) => {
      return {
        key: `${index}`,
        id: userRole.id,
        name: userRole.name,
        composite: userRole.composite.toString(),
        description: userRole.description,
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
      title: COMPOSITE,
      dataIndex: 'composite',
      editable: true,
    },
    {
      title: DESCRIPTION,
      dataIndex: 'description',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.description.localeCompare(b.description),
    },
  ];

  return (
    <div className="content-section">
      <Helmet>
        <title>{USER_ROLES_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={USER_ROLES_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
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

UserRolesList.defaultProps = defaultProps;

export default UserRolesList;
