import React from 'react';
import { Row, Col, Button } from 'antd';
import {
  getQueryParams,
  SearchForm,
  TableLayout,
  BrokenPage,
  searchQuery,
} from '@opensrp/react-utils';
import { PlusOutlined } from '@ant-design/icons';
import { URL_USER_CREATE, KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { loadKeycloakResources } from './utils';
import { getTableColumns } from './tableColumns';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { PageHeader } from 'antd';
import { getExtraData } from '@onaio/session-reducer';
import { KeycloakUser } from '@opensrp/user-management';
import { useSelector } from 'react-redux';
import { ViewDetailsWrapper } from '../ViewDetails';
import { useQueryClient } from 'react-query';

interface OrganizationListProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
}

interface RouteParams {
  id?: string;
}

/**
 * Renders users in a table
 *
 * @param props -  component props
 */
export const UserList = (props: OrganizationListProps) => {
  const { fhirBaseURL, keycloakBaseURL } = props;
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const extraData = useSelector(getExtraData);
  const queryClient = useQueryClient();

  const { id: resourceId } = useParams<RouteParams>();
  const { isLoading, data, error, isFetching } = useQuery([KEYCLOAK_URL_USERS], () =>
    loadKeycloakResources(keycloakBaseURL, KEYCLOAK_URL_USERS)
  );

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  // consider filter while creating the table data records.
  const tableData = (data?.records ?? [])
    .filter((user: KeycloakUser) => {
      const searchParam = new URLSearchParams(location.search).get(searchQuery);
      if (!searchParam) {
        return true;
      }
      const { firstName, username, lastName } = user;
      return [firstName, username, lastName]
        .filter((x) => !!x)
        .map((x) => x.replace(' ', ''))
        .map((x) => x.toLowerCase())
        .some((word) => word.includes(searchParam.toLowerCase().replace(' ', '')));
    })
    .map((obj: KeycloakUser) => {
      return {
        ...obj,
        key: obj.id,
      };
    });

  const columns = getTableColumns(keycloakBaseURL, fhirBaseURL, extraData, queryClient);

  const searchFormProps = {
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
      const searchText = event.target.value;
      let nextUrl = match.url;
      const currentSParams = new URLSearchParams(location.search);

      if (searchText) {
        currentSParams.set(searchQuery, searchText);
      } else {
        currentSParams.delete(searchQuery);
      }

      nextUrl = ''.concat(nextUrl, '?').concat(currentSParams.toString());
      history.push(nextUrl);
    },
  };

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
  };

  const title = 'User Management';

  return (
    <div className="content-section">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageHeader title={title} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <Link to={URL_USER_CREATE}>
              <Button type="primary">
                <PlusOutlined />
                Add User
              </Button>
            </Link>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        <ViewDetailsWrapper
          resourceId={resourceId}
          fhirBaseUrl={fhirBaseURL}
          keycloakBaseUrl={keycloakBaseURL}
        />
      </Row>
    </div>
  );
};
