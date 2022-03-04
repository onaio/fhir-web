/** Just shows a table that lists organizations, allows users to filter and
 * search organizations, and links to create/edit organization views.
 */
import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import {
  RouteComponentProps,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router';
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
import {
  SEARCH_QUERY_PARAM,
  CREATE_EDIT_ORGANIZATION_URL,
  ORGANIZATION_LIST_URL,
} from '../../constants';
import { parseOrganization, ViewDetails } from '../ViewDetails';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { getConfig } from '@opensrp/pkg-config';
import { Dictionary } from '@onaio/utils/dist/types/types';

interface TabularViewWithDetailProps {
  fhirBaseURL: string;
  resourceType: string;
  getTableDataAndColumns: Function;
  detailsMapFun: () => any;
}

// TODO - move to react-utils
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

const getStringParam = (location: RouteComponentProps['location'], paramKey) => {
  const sParams = new URLSearchParams(location.search);
  return sParams.get(paramKey);
}

export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';
export const searchQuery = 'search';


const loadResources = (baseUrl: string, resourceType: string, params: object) => {
  const filterParams: Dictionary = {
    _getpagesoffset: (params.page - 1) * params.pageSize,
    _count: params.pageSize,
  };
  if (typeof params.search !== 'null') {
    filterParams['name:contains'] = search;
  }
  return new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(
    filterParams
  ) as Promise<IBundle>;
};

/**
 * list a way to fetch the table, Column render
 *  - can we make an assumption that fetching the data will always be the same.
 *    This would mean we might just probably want to pass the resourcetype and wallah
 *    Cases where this might not work:
 *      - when you need to call more than 2 endpoints to display the data.
 * ViewDetails:
 *  - Details map function.
 *  - if we need to add more information to viewDetails like teams view details. Shows
 *    both teams information, members and location where they are assigned
 */

/** Renders List of resources in a table
 *
 * @param props -  component props
 */
export const TabularViewWithDetails = (props: TabularViewWithDetailProps) => {
  const { fhirBaseURL, resourceType, getTableDataAndColumns, detailsMapFun } = props;
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const page = getNumberParam(location, pageQuery, 1);
  const search = getStringParam(location, searchQuery);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const defaultPageSize = (getConfig('defaultTablesPageSize') as number | undefined) || 20;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize);
  const { id: resourceId } = useParams<any>();

  type TRQuery = [string, number, number, string];
  type QueryKeyType = { queryKey: TRQuery };

  const queryFn = useCallback(
    async ({ queryKey: [_, page, pageSize, search] }: QueryKeyType) =>
      loadResources(fhirBaseURL, resourceType, { page, pageSize, search }),
    [fhirBaseURL, resourceType]
  );

  const rQuery = {
    queryFn,
    select: (data: IBundle) => ({
      records: (data?.entry?.map((dt) => dt.resource) ?? []) as IOrganization[],
      total: data.total ?? 0,
    }),
    keepPreviousData: true,
    staleTime: 5000,
  };

  const queryOptions = {
    ...rQuery,
    queryKey: [resourceType, page, pageSize, search] as TRQuery,
  };
  const { data, error, isFetching } = useQuery(queryOptions);


  if (error && !data) {
    return <BrokenPage errorMessage={'Problem loading data'} />;
  }

  const searchFormProps = {
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: createChangeHandler(searchQuery, (props as unknown) as RouteComponentProps),
  };

  const { tableData, columns } = getTableDataAndColumns();

  const tableProps = {
    datasource: tableData,
    columns,
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
        <ViewDetails resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
      </Row>
    </div>
  );
};
