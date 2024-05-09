import React, { useMemo } from 'react';
import { ExtractResources, useSimpleTabularView } from '../../../hooks/useSimpleTabularView';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { BrokenPage } from '../../BrokenPage';
import TableLayout, { Column } from '../../TableLayout';
import { Dictionary } from '@onaio/utils';
import { SearchForm } from '../../Search';

const getSearchParamsFactory = (resourceId: string) => (_: string | null) => {
  return { 'subject:Patient': resourceId };
};

export interface TabTableProps<T> {
  resourceId: string;
  fhirBaseURL: string;
  resourceType: string;
  tableColumns: Column<Dictionary>[];
  tableDataGetter: (data: T[]) => Dictionary[];
  enableSearch?: boolean;
  extractResourceFn?: ExtractResources;
  searchParamsFactory?: typeof getSearchParamsFactory | ((id: string) => Dictionary);
}

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
    searchParamsFactory = getSearchParamsFactory,
  } = props;
  const getSearchParams = searchParamsFactory(resourceId);

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

  return (
    <div>
      {enableSearch && <SearchForm {...searchFormProps} />}
      <TableLayout {...tableProps} />
    </div>
  );
}
