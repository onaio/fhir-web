/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Spin } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { RouteComponentProps } from 'react-router';
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
import {
  reducerName as keycloakUserRolesReducerName,
  reducer as keycloakUserRolesReducer,
} from '../../ducks/userRoles';
import { SEARCH_QUERY_PARAM } from '../../constants';
import { makeKeycloakUserRolesSelector } from '../../ducks/userRoles';
import { fetchAllRoles } from './utils';
import { useTranslation } from '../../mls';

/** Register reducer */
reducerRegistry.register(keycloakUserRolesReducerName, keycloakUserRolesReducer);

// Define selector instance
const userRolesSelector = makeKeycloakUserRolesSelector();

interface TableData {
  name: string;
  composite: boolean | string;
  description?: string;
}

interface Props {
  keycloakBaseURL: string;
}

/** default component props */
const defaultProps = {
  keycloakBaseURL: '',
};

/**
 * Function which shows the list of all roles and their details
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
  const { t } = useTranslation();
  const { keycloakBaseURL } = props;

  useEffect(() => {
    if (isLoading) {
      fetchAllRoles(keycloakBaseURL, dispatch, t)
        .catch(() => {
          sendErrorNotification(t('An error occurred'));
        })
        .finally(() => setIsLoading(false));
    }
  });

  if (isLoading) return <Spin size="large" className="custom-spinner" />;

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const columns: Column<TableData>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('Composite'),
      dataIndex: 'composite',
      render: (value: boolean) => value.toString(),
    },
    {
      title: t('Description'),
      dataIndex: 'description',
    },
  ];

  const pageTitle = t('User roles');
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
          </div>
          <TableLayout
            id="UserRolesList"
            persistState={true}
            datasource={getUserRolesList}
            columns={columns}
          />
        </Col>
      </Row>
    </div>
  );
};

UserRolesList.defaultProps = defaultProps;

export default UserRolesList;

export { fetchAllRoles };
