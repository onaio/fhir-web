/** Reusable bare bone component for use for listing an array of resources
 * with api pagination
 */
import React, { useEffect } from 'react';
import { Row, PageHeader, Col } from 'antd';
import { BrokenPage, TableLayout } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { useQuery, useQueryClient } from 'react-query';
import { Column } from '@opensrp/react-utils';
import { getConfig } from '@opensrp/pkg-config';
import { RouteComponentProps, useHistory, useLocation, useRouteMatch } from 'react-router';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import type { UseQueryOptions } from 'react-query';

export type TRQuery = [string, number, number];

/** props for the PlansList view */
export interface SimpleTabularViewProps<TTableSource> {
  queryKey: string;
  rQuery: UseQueryOptions<
    IBundle,
    unknown,
    { records: TTableSource[]; total: number }, // what we should get from query select
    TRQuery
  >;
  pageTitle: string | (() => string);
  columns: Column<TTableSource>[];
  aboveTableRender?: () => JSX.Element;
}

const defaultProps = {};

export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';

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

/**
 * api paginated table view listing resources
 *
 * @param props - component props
 */
function SimpleTabularView<TableSourceT>(props: SimpleTabularViewProps<TableSourceT>) {
  const { columns, rQuery, pageTitle, aboveTableRender, queryKey } = props;
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const queryClient = useQueryClient();

  const page = getNumberParam(location, pageQuery, 1);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const defaultPageSize = (getConfig('defaultTablesPageSize') as number | undefined) || 20;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize);

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
  }, [data, page, pageSize, queryClient, queryKey, rQuery.queryFn, rQuery.queryKey]);

  if (error && !data) {
    return <BrokenPage errorMessage={'Problem loading data'} />;
  }

  const tableProps = {
    datasource: data?.records ?? [],
    columns,
    loading: isFetching,
    pagination: {
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

  const title = typeof pageTitle === 'function' ? pageTitle() : pageTitle;
  return (
    <div className="content-section">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageHeader title={title} className="page-header"></PageHeader>
      {aboveTableRender?.()}
      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
}

SimpleTabularView.defaultProps = defaultProps;

export { SimpleTabularView };
