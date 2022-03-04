/** Just shows a table that lists organizations, allows users to filter and
 * search organizations, and links to create/edit organization views.
 */
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { SearchForm, BrokenPage, TableLayout, getResourcesFromBundle } from '@opensrp/react-utils';
import lang from '../../../lang';
import {
  ADD_EDIT_ORGANIZATION_URL,
  ORGANIZATION_LIST_URL,
  organizationResourceType,
  pageQuery,
  pageSizeQuery,
  searchQuery,
} from '../../../constants';
import { parseOrganization, ViewDetailsWrapper } from '../ViewDetails';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { getConfig } from '@opensrp/pkg-config';
import { useQuery } from 'react-query';
import { getNumberSearchParam, getStringSearchParam, listDataFetcher } from './utils';

export type TRQuery = [string, number, number];

interface OrganizationListProps {
  fhirBaseURL: string;
}

interface RouteParams {
  id?: string;
}

/** Renders organization in a table
 *
 * @param props -  component props
 */
export const OrganizationList = (props: OrganizationListProps) => {
  const { fhirBaseURL } = props;
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const defaultPage = 1;
  const page = getNumberSearchParam(location, pageQuery, defaultPage);
  const search = getStringSearchParam(location, searchQuery);
  const defaultPageSize = (getConfig('defaultTablesPageSize') as number | undefined) ?? 20;
  const pageSize = getNumberSearchParam(location, pageSizeQuery, defaultPageSize);
  const { id: resourceId } = useParams<RouteParams>();

  type TRQuery = [string, number, number, string];
  type QueryKeyType = { queryKey: TRQuery };
  const loadResources = useCallback(
    async (rOptions) => {
      const {
        queryKey: [qKey, page, pageSize, search],
      }: QueryKeyType = rOptions;
      return listDataFetcher(fhirBaseURL, qKey, { page, pageSize, search });
    },
    [fhirBaseURL]
  );
  const rQuery = {
    queryFn: loadResources,
    select: (data: IBundle) => ({
      records: getResourcesFromBundle<IOrganization>(data),
      total: data.total ?? 0,
    }),
    keepPreviousData: true,
    staleTime: 5000,
    queryKey: [organizationResourceType, page, pageSize, search] as TRQuery,
  };
  const { data, error, isFetching } = useQuery(rQuery);

  if (error && !data) {
    return <BrokenPage errorMessage={'Problem loading data'} />;
  }

  const searchFormProps = {
    defaultValue: getStringSearchParam(location, searchQuery) ?? undefined,
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchText = event.target.value;
      let nextUrl = match.url;
      const currentSParams = new URLSearchParams(location.search);
      if (searchText) {
        currentSParams.set(searchQuery, searchText);
        currentSParams.set(pageQuery, defaultPage.toString());
      } else {
        currentSParams.delete(searchQuery);
      }
      nextUrl = `${nextUrl}?${currentSParams.toString()}`;
      history.push(nextUrl);
    },
  };

  const tableData = (data?.records ?? []).map((org: IOrganization, index: number) => {
    return {
      ...parseOrganization(org),
      key: `${index}`,
    };
  });

  type TableData = typeof tableData[0];

  const columns = [
    {
      title: "Team name",
      dataIndex: 'name' as const,
    },
    {
      title: 'Type',
      dataIndex: 'type' as const,
    },
    {
      title: 'Actions',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${ADD_EDIT_ORGANIZATION_URL}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item className="viewdetails">
                  <Link to={`${ORGANIZATION_LIST_URL}/${record.id}`}>View Details</Link>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns: columns,
    loading: isFetching,
    pagination: {
      current: page,
      pageSize,
      total: data?.total,
      defaultPageSize,
      onChange: (current: number, pageSize?: number) => {
        if (current && pageSize) {
          const newSParams = new URLSearchParams(location.search);
          newSParams.append(pageSizeQuery, pageSize.toString());
          newSParams.append(pageQuery, current.toString());
          history.push(`${match.url}?${newSParams.toString()}`);
        }
      },
    },
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>Organization list</title>
      </Helmet>
      <PageHeader title={'Organization list'} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <Link to={ADD_EDIT_ORGANIZATION_URL}>
              <Button type="primary">
                <PlusOutlined />
                Add Organization
              </Button>
            </Link>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        <ViewDetailsWrapper resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
      </Row>
    </div>
  );
};
