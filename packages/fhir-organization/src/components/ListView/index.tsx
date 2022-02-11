/** Just shows a table that lists organizations, allows users to filter and
 * search organizations, and links to create/edit organization views.
 */
import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps, useHistory, useLocation, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import {
  createChangeHandler,
  getQueryParams,
  SearchForm,
  BrokenPage,
  TableLayout,
  defaultProps,
  FHIRServiceClass,
} from '@opensrp/react-utils';
import lang from '../../lang';
import { SEARCH_QUERY_PARAM, URL_EDIT_ORG_AFFILIATION, URL_ORG_AFFILIATION } from '../../constants';
import { parseOrganization, ViewDetails } from '../ViewDetails';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { getConfig } from 'pkg-config/dist/types';

export type TRQuery = [string, number, number];

interface OrganizationListProps {
  fhirBaseURL: string;
  OrgAffiliationPageSize: number;
}

// TODO - move to react-utils
const getNumberParam = (
  location: RouteComponentProps['location'],
  paramKey: string,
  fallback: number
) => {
  const sParams = new URLSearchParams(location.search);
  const rawParamVal = sParams.get(paramKey);
  const paramVal = rawParamVal ? Number(rawParamVal) : NaN;
  return isNaN(paramVal) ? fallback : paramVal;
};

export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';

/** Renders organization in a table
 *
 * @param props -  component props
 */
export const OrganizationList = (props: OrganizationListProps) => {
  const { fhirBaseURL } = props;
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const queryClient = useQueryClient();

  const page = getNumberParam(location, pageQuery, 1);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const defaultPageSize = (getConfig('defaultTablesPageSize') as number | undefined) || 20;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize);

  type QueryKeyType = { queryKey: TRQuery };
  // TODO - how to add more params to loader function
  const loadOrganizations = useCallback(
    async ({ queryKey: [_, page, pageSize] }: QueryKeyType) => {
      return new FHIRServiceClass<IBundle>(fhirBaseURL, 'Organization').list({
        _getpagesoffset: (page - 1) * pageSize,
        _count: pageSize,
      }) as Promise<IBundle>;
    },
    [fhirBaseURL]
  );

  const rQuery = {
    queryFn: loadOrganizations,
    select: (data: IBundle) => ({
      records: (data?.entry?.map((dt) => dt.resource) ?? []) as IOrganization[],
      total: data.total ?? 0,
    }),
    keepPreviousData: true,
    staleTime: 5000,
  };

  const queryKey = 'Organization';
  // Add pagination info to query keys
  const queryOptions = {
    ...rQuery,
    queryKey: [queryKey, page, pageSize] as TRQuery,
  };
  const { data, error, isFetching } = useQuery(queryOptions);

  useEffect(() => {
    const hasMore = page * pageSize < (data?.total ?? 0);
    if (hasMore) {
      queryClient
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .prefetchQuery([queryKey, page + 1, pageSize], rQuery.queryFn!)
        .catch((e) => {
          void e;
        });
    }
  }, [data, page, pageSize, queryClient, queryKey, rQuery.queryFn]);

  if (error && !data) {
    return <BrokenPage errorMessage={'Problem loading data'} />;
  }

  const searchFormProps = {
    defaultValue: getQueryParams(location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(
      SEARCH_QUERY_PARAM,
      (props as unknown) as RouteComponentProps
    ),
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
      title: lang.ORGANIZATION_NAME,
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name?.localeCompare(b.name as string),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      editable: true,
    },
    {
      title: lang.STATUS,
      dataIndex: 'status',
      editable: true,
    },
    {
      title: 'Part of',
      dataIndex: 'partOf',
      editable: true,
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${URL_EDIT_ORG_AFFILIATION}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item
                  className="viewdetails"
                  onClick={() => {
                    history.push(`${URL_ORG_AFFILIATION}/${record.id}`);
                  }}
                >
                  View Details
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns: columns as any,
    loading: isFetching,
    pagination: {
      current: page,
      pageSize,
      total: data?.total,
      defaultPageSize,
      onChange: (current: number, pageSize?: number) => {
        if (current && pageSize) {
          const newSParams = new URLSearchParams();
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
        <title>{lang.ORG_AFFILIATION_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={lang.ORG_AFFILIATION_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={'#'}>
              <Button type="primary">
                <PlusOutlined />
                Add Organization
              </Button>
            </Link>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        <ViewDetails resourceId={''} fhirBaseURL={fhirBaseURL} />
      </Row>
    </div>
  );
};

OrganizationList.defaultProps = defaultProps;

export default OrganizationList;
