import { ChangeEvent, useCallback } from 'react';
import { getQueryParams } from '../components/Search/utils';
import { getResourcesFromBundle } from '../helpers/utils';
import { useQuery } from 'react-query';
import { getConfig } from '@opensrp/pkg-config';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { URLParams } from '@opensrp/server-service';
import { loadAllResources } from '../helpers/fhir-utils';
import {
  getNextUrlOnSearch,
  getNumberParam,
  pageQuery,
  pageSizeQuery,
  searchQuery,
  startingPage,
  startingPageSize,
} from './utils';
import { useClientSideDataGridFilters, FilterDescription } from './useClientSideDataGridFilters';

/**
 * Re-usable hook that abstracts search and table pagination for usual list view component
 * Should only be used when getting data from a server that follows the hapi FHIR spec
 *
 * @param fhirBaseUrl - fhir server baser url
 * @param resourceType - resource type as endpoint
 * @param extraParams - further custom search param filters during api requests
 * @param dataTransformer - function to process data after fetch
 * @param initialFilters - initiate filters
 */
export function useClientSideActionsDataGrid<T extends object>(
  fhirBaseUrl: string,
  resourceType: string,
  extraParams: URLParams | ((search: string | null) => URLParams) = {},
  dataTransformer: (response: IBundle) => T[] = getResourcesFromBundle,
  initialFilters: FilterDescription<T> = {}
) {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const page = getNumberParam(location, pageQuery, startingPage) as number;
  const defaultPageSize =
    (getConfig('defaultTablesPageSize') as number | undefined) ?? startingPageSize;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize) as number;

  type TRQuery = [string, URLParams];
  type QueryKeyType = { queryKey: TRQuery };

  const queryFn = useCallback(
    async ({ queryKey: [_, extraParams] }: QueryKeyType) => {
      return loadAllResources(fhirBaseUrl, resourceType, extraParams);
    },
    [fhirBaseUrl, resourceType]
  );

  const rQuery = {
    queryKey: [resourceType, extraParams] as TRQuery,
    queryFn,
    select: (data: IBundle) => {
      return dataTransformer(data);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };

  const { data, ...restQueryValues } = useQuery(rQuery);
  const { filteredData, filterRegistry, registerFilter, deregisterFilter } =
    useClientSideDataGridFilters(data, initialFilters);

  const searchFormProps = {
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
      const nextUrl = getNextUrlOnSearch(event, location, match);
      history.push(nextUrl);
    },
  };

  const tablePaginationProps = {
    current: page,
    pageSize,
    total: filteredData.length,
    defaultPageSize,
    onChange: (current: number, pageSize?: number) => {
      if (current && pageSize) {
        const newSParams = new URLSearchParams(location.search);
        newSParams.set(pageSizeQuery, pageSize.toString());
        newSParams.set(pageQuery, current.toString());
        history.push(`${match.url}?${newSParams.toString()}`);
      }
    },
  };

  return {
    tablePaginationProps,
    filterOptions: {
      registerFilter,
      filterRegistry,
      deregisterFilter,
    },
    queryValues: {
      data: filteredData,
      ...restQueryValues,
    },
    searchFormProps,
  };
}

export const useTabularViewWithLocalSearch = useClientSideActionsDataGrid;
