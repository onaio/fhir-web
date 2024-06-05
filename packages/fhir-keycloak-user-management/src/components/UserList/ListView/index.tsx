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
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { BodyLayout } from '@opensrp/react-utils';
import { getExtraData } from '@onaio/session-reducer';
import { KeycloakUser } from '@opensrp/user-management';
import { useSelector } from 'react-redux';
import { useTranslation } from '@opensrp/i18n';
import { RbacCheck, useUserRole } from '@opensrp/rbac';

interface OrganizationListProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
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
  const { t } = useTranslation();
  const userRole = useUserRole();

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

  const columns = getTableColumns(keycloakBaseURL, fhirBaseURL, extraData, t, userRole, history);

  const searchFormProps = {
    wrapperClassName: 'elongate-search-bar',
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

  const title = t('User Management');
  const headerProps = {
    pageHeaderProps: {
      title,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <RbacCheck permissions={['iam_user.create', 'Practitioner.create']}>
              <Button type="primary" onClick={() => history.push(URL_USER_CREATE)}>
                <PlusOutlined />
                {t('Add User')}
              </Button>
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </BodyLayout>
  );
};
