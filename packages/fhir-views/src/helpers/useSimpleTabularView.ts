import { ChangeEvent, useCallback } from 'react';
import { FHIRServiceClass, getQueryParams, getResourcesFromBundle } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { getConfig } from '@opensrp/pkg-config';
import { RouteComponentProps, useHistory, useLocation, useRouteMatch } from 'react-router';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { URLParams } from 'opensrp-server-service/dist/types';

interface FhirApiFilter {
  page: number;
  pageSize: number;
  search: string | null;
}

export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';
export const searchQuery = 'search';

/**
 * get a string search param from url
 *
 * @param location - route information
 * @param paramKey - search param key
 */
const getStringParam = (location: RouteComponentProps['location'], paramKey: string) => {
  const sParams = new URLSearchParams(location.search);
  return sParams.get(paramKey);
};

/**
 * get a search param that's of Number from url
 *
 * @param location -  route information
 * @param paramKey - search param key
 * @param fallback - fallback if key not found, or malformed
 */
const getNumberParam = (
  location: RouteComponentProps['location'],
  paramKey: string,
  fallback: number | null = null
) => {
  const sParams = new URLSearchParams(location.search);
  const rawParamVal = sParams.get(paramKey);
  const paramVal = rawParamVal ? Number(rawParamVal) : NaN;
  return isNaN(paramVal) ? fallback : paramVal;
};

/**
 * Unified function that gets a list of fhir resources from any endpoint
 *
 * @param baseUrl - base url
 * @param resourceType - resource type as endpoint
 * @param params - our params
 * @param extraParams - any extra user-defined params
 */
const loadResources = (
  baseUrl: string,
  resourceType: string,
  params: FhirApiFilter,
  extraParams: URLParams
) => {
  const { page, pageSize, search } = params;
  const filterParams: URLParams = {
    _getpagesoffset: (page - 1) * pageSize,
    _count: pageSize,
    ...extraParams,
  };
  if (search) {
    filterParams['name:contains'] = search;
  }
  return new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(
    filterParams
  ) as Promise<IBundle>;
};

/**
 * Re-usable hook that abstracts search and table pagination for usual list view component
 *
 * @param fhirBaseUrl - fhir server baser url
 * @param resourceType - resource type as endpoint
 * @param extraParams - further custom search param filters during api requests
 */
export function useSimpleTabularView<T extends Resource>(
  fhirBaseUrl: string,
  resourceType: string,
  extraParams: URLParams = {}
) {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const defaultPage = 1;
  const page = getNumberParam(location, pageQuery, 1) as number;
  const search = getStringParam(location, searchQuery);
  const defaultPageSize = (getConfig('defaultTablesPageSize') as number | undefined) ?? 20;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize) as number;

  type TRQuery = [string, number, number, string];
  type QueryKeyType = { queryKey: TRQuery };

  const queryFn = useCallback(
    async ({ queryKey: [_, page, pageSize, search] }: QueryKeyType) =>
      loadResources(fhirBaseUrl, resourceType, { page, pageSize, search }, extraParams),
    [extraParams, fhirBaseUrl, resourceType]
  );

  const rQuery = {
    queryKey: [resourceType, page, pageSize, search] as TRQuery,
    queryFn,
    select: (data: IBundle) => ({
      records: getResourcesFromBundle<T>(data),
      total: data.total ?? 0,
    }),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };
  const { data, ...restQueryValues } = useQuery(rQuery);

  const searchFormProps = {
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
      const searchText = event.target.value;
      let nextUrl = match.url;
      const currentSParams = new URLSearchParams(location.search);

      if (searchText) {
        currentSParams.set(searchQuery, searchText);
        currentSParams.set(pageQuery, defaultPage.toString());
      } else {
        currentSParams.delete(searchQuery);
      }

      nextUrl = ''.concat(nextUrl, '?').concat(currentSParams.toString());
      history.push(nextUrl);
    },
  };

  const tablePaginationProps = {
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
  };

  return {
    tablePaginationProps,
    queryValues: {
      data,
      ...restQueryValues,
    },
    searchFormProps,
  };
}
