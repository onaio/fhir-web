import React, { useMemo } from 'react';
import { ExtractResources, useSimpleTabularView } from '../../../hooks/useSimpleTabularView';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { BrokenPage } from '../../BrokenPage';
import TableLayout, { Column } from '../../TableLayout';
import { Dictionary } from '@onaio/utils';
import { SearchForm } from '../../Search';
import { Col, Row, Space } from 'antd';
import { PopulatedResourceDetailsProps } from '../PopulatedResourceDetails';
import { useTranslation } from '../../../mls';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { ResourceDetails, ResourceDetailsProps } from '../ResourceDetails';

export interface TabTableProps<T> {
  resourceId: string;
  fhirBaseURL: string;
  resourceType: string;
  tableColumns: Column<Dictionary>[];
  tableDataGetter: (data: T[]) => Dictionary[];
  enableSearch?: boolean;
  extractResourceFn?: ExtractResources;
  searchParamsFactory: (id: string) => Dictionary;
  extractSideViewDetails?: PopulatedResourceDetailsProps<T>['resourceDetailsPropsGetter'];
}
export const sideViewQuery = 'sideView';

/**
 * Generic component to render table tabs table
 *
 * @param props - TabsTable props
 */
export function TabsTable<T extends Resource>(props: TabTableProps<T>) {
  const {
    resourceId,
    fhirBaseURL,
    resourceType,
    tableDataGetter,
    extractResourceFn,
    tableColumns,
    enableSearch,
    searchParamsFactory,
    extractSideViewDetails,
  } = props;
  const getSearchParams = searchParamsFactory(resourceId);
  const { sParams } = useSearchParams();
  const tableRowDataId = sParams.get(sideViewQuery) ?? undefined;
  const { t } = useTranslation();

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useSimpleTabularView<T>(fhirBaseURL, resourceType, getSearchParams, extractResourceFn);

  const tableData = useMemo(() => tableDataGetter(data?.records ?? []), [data, tableDataGetter]);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableProps = {
    datasource: tableData,
    columns: tableColumns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  const sideViewData = (data?.records || []).filter((row) => tableRowDataId === row.id)[0];
  let parsedSideViewData;
  let resourceDetailsProps;
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  if (sideViewData && extractSideViewDetails) {
    parsedSideViewData = extractSideViewDetails(sideViewData, t);
    resourceDetailsProps = {
      column: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 },
      ...parsedSideViewData,
    } as ResourceDetailsProps;
  }

  return (
    <Row className="list-view">
      <Col className="main-content">
        {enableSearch && <SearchForm {...searchFormProps} />}
        <TableLayout {...tableProps} />
      </Col>
      {tableRowDataId && resourceDetailsProps && (
        <Col className="view-details-content">
          <Space direction="vertical">
            <ResourceDetails {...resourceDetailsProps} />
          </Space>
        </Col>
      )}
    </Row>
  );
}
